"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Logging = require("../Library/Logging");
var DiagChannel = require("./diagnostic-channel/initialization");
var CorrelationContextManager = (function () {
    function CorrelationContextManager() {
    }
    /**
     *  Provides the current Context.
     *  The context is the most recent one entered into for the current
     *  logical chain of execution, including across asynchronous calls.
     */
    CorrelationContextManager.getCurrentContext = function () {
        if (!CorrelationContextManager.enabled) {
            return null;
        }
        return Zone.current.get("context");
    };
    /**
     *  A helper to generate objects conforming to the CorrelationContext interface
     */
    CorrelationContextManager.generateContextObject = function (operationId, parentId, operationName, correlationContextHeader) {
        parentId = parentId || operationId;
        if (this.enabled) {
            return {
                operation: {
                    name: operationName,
                    id: operationId,
                    parentId: parentId
                },
                customProperties: new CustomPropertiesImpl(correlationContextHeader)
            };
        }
        return null;
    };
    /**
     *  Runs a function inside a given Context.
     *  All logical children of the execution path that entered this Context
     *  will receive this Context object on calls to GetCurrentContext.
     */
    CorrelationContextManager.runWithContext = function (context, fn) {
        if (CorrelationContextManager.enabled) {
            var newZone = Zone.current.fork({
                name: "AI-" + ((context && context.operation.parentId) || "Unknown"),
                properties: { context: context }
            });
            newZone.run(fn);
        }
        else {
            fn();
        }
    };
    /**
     *  Patches a callback to restore the correct Context when getCurrentContext
     *  is run within it. This is necessary if automatic correlation fails to work
     *  with user-included libraries.
     *
     *  The supplied callback will be given the same context that was present for
     *  the call to wrapCallback.  */
    CorrelationContextManager.wrapCallback = function (fn) {
        if (CorrelationContextManager.enabled) {
            return Zone.current.wrap(fn, "User-wrapped method");
        }
        return fn;
    };
    /**
     *  Enables the CorrelationContextManager.
     */
    CorrelationContextManager.enable = function () {
        if (this.enabled) {
            return;
        }
        if (!this.isNodeVersionCompatible()) {
            this.enabled = false;
            return;
        }
        // Run patches for Zone.js
        if (!CorrelationContextManager.hasEverEnabled) {
            this.hasEverEnabled = true;
            // Load in Zone.js
            try {
                // Require zone if we can't detect its presence - guarded because of issue #346
                // Note that usually multiple requires of zone.js does not error - but we see reports of it happening
                // in the Azure Functions environment.
                // This indicates that the file is being included multiple times in the same global scope,
                // averting require's cache somehow.
                if (typeof Zone === "undefined") {
                    require("zone.js");
                }
            }
            catch (e) {
                // Zone was already loaded even though we couldn't find its global variable
                Logging.warn("Failed to require zone.js");
            }
            DiagChannel.registerContextPreservation(function (cb) {
                return Zone.current.wrap(cb, "AI-ContextPreservation");
            });
            this.patchError();
            this.patchTimers(["setTimeout", "setInterval"]);
        }
        this.enabled = true;
    };
    /**
     *  Disables the CorrelationContextManager.
     */
    CorrelationContextManager.disable = function () {
        this.enabled = false;
    };
    /**
     *  Reports if the CorrelationContextManager is able to run in this environment
     */
    CorrelationContextManager.isNodeVersionCompatible = function () {
        // Unit tests warn of errors < 3.3 from timer patching. All versions before 4 were 0.x
        var nodeVer = process.versions.node.split(".");
        return parseInt(nodeVer[0]) > 3 || (parseInt(nodeVer[0]) > 2 && parseInt(nodeVer[1]) > 2);
    };
    // Zone.js breaks concatenation of timer return values.
    // This fixes that.
    CorrelationContextManager.patchTimers = function (methodNames) {
        methodNames.forEach(function (methodName) {
            var orig = global[methodName];
            global[methodName] = function () {
                var ret = orig.apply(this, arguments);
                ret.toString = function () {
                    if (this.data && typeof this.data.handleId !== 'undefined') {
                        return this.data.handleId.toString();
                    }
                    else {
                        return Object.prototype.toString.call(this);
                    }
                };
                return ret;
            };
        });
    };
    // Zone.js breaks deepEqual on error objects (by making internal properties enumerable).
    // This fixes that by subclassing the error object and making all properties not enumerable
    CorrelationContextManager.patchError = function () {
        var orig = global.Error;
        // New error handler
        function AppInsightsAsyncCorrelatedErrorWrapper() {
            if (!(this instanceof AppInsightsAsyncCorrelatedErrorWrapper)) {
                return AppInsightsAsyncCorrelatedErrorWrapper.apply(Object.create(AppInsightsAsyncCorrelatedErrorWrapper.prototype), arguments);
            }
            // Is this object set to rewrite the stack?
            // If so, we should turn off some Zone stuff that is prone to break
            var stackRewrite = orig.stackRewrite;
            if (orig.prepareStackTrace) {
                orig.stackRewrite = false;
                var stackTrace = orig.prepareStackTrace;
                orig.prepareStackTrace = function (e, s) {
                    // Remove some AI and Zone methods from the stack trace
                    // Otherwise we leave side-effects
                    // Algorithm is to find the first frame on the stack after the first instance(s)
                    // of AutoCollection/CorrelationContextManager
                    // Eg. this should return the User frame on an array like below:
                    //  Zone | Zone | CorrelationContextManager | CorrelationContextManager | User
                    var foundOne = false;
                    for (var i = 0; i < s.length; i++) {
                        var fileName = s[i].getFileName();
                        if (fileName) {
                            if (fileName.indexOf("AutoCollection/CorrelationContextManager") === -1 &&
                                fileName.indexOf("AutoCollection\\CorrelationContextManager") === -1) {
                                if (foundOne) {
                                    break;
                                }
                            }
                            else {
                                foundOne = true;
                            }
                        }
                    }
                    // Loop above goes one extra step
                    i = Math.max(0, i - 1);
                    if (foundOne) {
                        s.splice(0, i);
                    }
                    return stackTrace(e, s);
                };
            }
            // Apply the error constructor
            orig.apply(this, arguments);
            // Restore Zone stack rewriting settings
            orig.stackRewrite = stackRewrite;
            // Remove unexpected bits from stack trace
            if (this.stack && typeof this.stack === "string") {
                var stackFrames = this.stack.split("\n");
                // Remove this class
                if (stackFrames.length > 3) {
                    if (stackFrames[2].trim().indexOf("at Error.AppInsightsAsyncCorrelatedErrorWrapper") === 0) {
                        stackFrames.splice(2, 1);
                    }
                    else if (stackFrames[1].trim().indexOf("at AppInsightsAsyncCorrelatedErrorWrapper.ZoneAwareError") === 0
                        && stackFrames[2].trim().indexOf("at new AppInsightsAsyncCorrelatedErrorWrapper") === 0) {
                        stackFrames.splice(1, 2);
                    }
                }
                // Remove AI correlation ids
                this.stack = stackFrames.map(function (v) {
                    var startIndex = v.indexOf(") [");
                    if (startIndex > -1) {
                        v = v.substr(0, startIndex + 1);
                    }
                    return v;
                }).join("\n");
            }
            // getOwnPropertyNames should be a superset of Object.keys...
            // This appears to not always be the case
            var props = Object.getOwnPropertyNames(this).concat(Object.keys(this));
            // Zone.js will automatically create some hidden properties at read time.
            // We need to proactively make those not enumerable as well as the currently visible properties
            for (var i = 0; i < props.length; i++) {
                var propertyName = props[i];
                var hiddenPropertyName = Zone['__symbol__'](propertyName);
                Object.defineProperty(this, propertyName, { enumerable: false });
                Object.defineProperty(this, hiddenPropertyName, { enumerable: false, writable: true });
            }
            return this;
        }
        // Inherit from the Zone.js error handler
        AppInsightsAsyncCorrelatedErrorWrapper.prototype = orig.prototype;
        // We need this loop to copy outer methods like Error.captureStackTrace
        var props = Object.getOwnPropertyNames(orig);
        for (var i = 0; i < props.length; i++) {
            var propertyName = props[i];
            if (!AppInsightsAsyncCorrelatedErrorWrapper[propertyName]) {
                Object.defineProperty(AppInsightsAsyncCorrelatedErrorWrapper, propertyName, Object.getOwnPropertyDescriptor(orig, propertyName));
            }
        }
        // explicit cast to <any> required to avoid type error for captureStackTrace
        // with latest node.d.ts (despite workaround above)
        global.Error = AppInsightsAsyncCorrelatedErrorWrapper;
    };
    CorrelationContextManager.enabled = false;
    CorrelationContextManager.hasEverEnabled = false;
    return CorrelationContextManager;
}());
exports.CorrelationContextManager = CorrelationContextManager;
var CustomPropertiesImpl = (function () {
    function CustomPropertiesImpl(header) {
        this.props = [];
        this.addHeaderData(header);
    }
    CustomPropertiesImpl.prototype.addHeaderData = function (header) {
        var keyvals = header ? header.split(", ") : [];
        this.props = keyvals.map(function (keyval) {
            var parts = keyval.split("=");
            return { key: parts[0], value: parts[1] };
        }).concat(this.props);
    };
    CustomPropertiesImpl.prototype.serializeToHeader = function () {
        return this.props.map(function (keyval) {
            return keyval.key + "=" + keyval.value;
        }).join(", ");
    };
    CustomPropertiesImpl.prototype.getProperty = function (prop) {
        for (var i = 0; i < this.props.length; ++i) {
            var keyval = this.props[i];
            if (keyval.key === prop) {
                return keyval.value;
            }
        }
        return;
    };
    // TODO: Strictly according to the spec, properties which are recieved from
    // an incoming request should be left untouched, while we may add our own new
    // properties. The logic here will need to change to track that.
    CustomPropertiesImpl.prototype.setProperty = function (prop, val) {
        if (CustomPropertiesImpl.bannedCharacters.test(prop) || CustomPropertiesImpl.bannedCharacters.test(val)) {
            Logging.warn("Correlation context property keys and values must not contain ',' or '='. setProperty was called with key: " + prop + " and value: " + val);
            return;
        }
        for (var i = 0; i < this.props.length; ++i) {
            var keyval = this.props[i];
            if (keyval.key === prop) {
                keyval.value = val;
                return;
            }
        }
        this.props.push({ key: prop, value: val });
    };
    CustomPropertiesImpl.bannedCharacters = /[,=]/;
    return CustomPropertiesImpl;
}());//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/ee8c7def80afc00dd6e593ef12f37756d8f504ea/node_modules/applicationinsights/out/AutoCollection/CorrelationContextManager.js.map