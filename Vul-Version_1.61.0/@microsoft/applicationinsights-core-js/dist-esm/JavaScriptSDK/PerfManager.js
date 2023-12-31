/*
 * Application Insights JavaScript SDK - Core, 2.6.4
 * Copyright (c) Microsoft and contributors. All rights reserved.
 */
import dynamicProto from "@microsoft/dynamicproto-js";
import { dateNow, isArray, isFunction, objDefineAccessors } from './HelperFuncs';
var strExecutionContextKey = "ctx";
var PerfEvent = /** @class */ (function () {
    function PerfEvent(name, payloadDetails, isAsync) {
        var _self = this;
        var accessorDefined = false;
        _self.start = dateNow();
        _self.name = name;
        _self.isAsync = isAsync;
        _self.isChildEvt = function () { return false; };
        if (isFunction(payloadDetails)) {
            // Create an accessor to minimize the potential performance impact of executing the payloadDetails callback
            var theDetails_1;
            accessorDefined = objDefineAccessors(_self, 'payload', function () {
                // Delay the execution of the payloadDetails until needed
                if (!theDetails_1 && isFunction(payloadDetails)) {
                    theDetails_1 = payloadDetails();
                    // clear it out now so the referenced objects can be garbage collected
                    payloadDetails = null;
                }
                return theDetails_1;
            });
        }
        _self.getCtx = function (key) {
            if (key) {
                // The parent and child links are located directly on the object (for better viewing in the DebugPlugin)
                if (key === PerfEvent.ParentContextKey || key === PerfEvent.ChildrenContextKey) {
                    return _self[key];
                }
                return (_self[strExecutionContextKey] || {})[key];
            }
            return null;
        };
        _self.setCtx = function (key, value) {
            if (key) {
                // Put the parent and child links directly on the object (for better viewing in the DebugPlugin)
                if (key === PerfEvent.ParentContextKey) {
                    // Simple assumption, if we are setting a parent then we must be a child
                    if (!_self[key]) {
                        _self.isChildEvt = function () { return true; };
                    }
                    _self[key] = value;
                }
                else if (key === PerfEvent.ChildrenContextKey) {
                    _self[key] = value;
                }
                else {
                    var ctx = _self[strExecutionContextKey] = _self[strExecutionContextKey] || {};
                    ctx[key] = value;
                }
            }
        };
        _self.complete = function () {
            var childTime = 0;
            var childEvts = _self.getCtx(PerfEvent.ChildrenContextKey);
            if (isArray(childEvts)) {
                for (var lp = 0; lp < childEvts.length; lp++) {
                    var childEvt = childEvts[lp];
                    if (childEvt) {
                        childTime += childEvt.time;
                    }
                }
            }
            _self.time = dateNow() - _self.start;
            _self.exTime = _self.time - childTime;
            _self.complete = function () { };
            if (!accessorDefined && isFunction(payloadDetails)) {
                // If we couldn't define the property set during complete -- to minimize the perf impact until after the time
                _self.payload = payloadDetails();
            }
        };
    }
    PerfEvent.ParentContextKey = "parent";
    PerfEvent.ChildrenContextKey = "childEvts";
    return PerfEvent;
}());
export { PerfEvent };
var PerfManager = /** @class */ (function () {
    function PerfManager(manager) {
        /**
         * General bucket used for execution context set and retrieved via setCtx() and getCtx.
         * Defined as private so it can be visualized via the DebugPlugin
         */
        this.ctx = {};
        dynamicProto(PerfManager, this, function (_self) {
            _self.create = function (src, payloadDetails, isAsync) {
                // TODO (@MSNev): at some point we will want to add additional configuration to "select" which events to instrument
                // for now this is just a simple do everything.
                return new PerfEvent(src, payloadDetails, isAsync);
            };
            _self.fire = function (perfEvent) {
                if (perfEvent) {
                    perfEvent.complete();
                    if (manager) {
                        manager.perfEvent(perfEvent);
                    }
                }
            };
            _self.setCtx = function (key, value) {
                if (key) {
                    var ctx = _self[strExecutionContextKey] = _self[strExecutionContextKey] || {};
                    ctx[key] = value;
                }
            };
            _self.getCtx = function (key) {
                return (_self[strExecutionContextKey] || {})[key];
            };
        });
    }
// Removed Stub for PerfManager.prototype.create.
// Removed Stub for PerfManager.prototype.fire.
// Removed Stub for PerfManager.prototype.setCtx.
// Removed Stub for PerfManager.prototype.getCtx.
    return PerfManager;
}());
export { PerfManager };
var doPerfActiveKey = "CoreUtils.doPerf";
/**
 * Helper function to wrap a function with a perf event
 * @param mgrSource - The Performance Manager or a Performance provider source (may be null)
 * @param getSource - The callback to create the source name for the event (if perf monitoring is enabled)
 * @param func - The function to call and measure
 * @param details - A function to return the payload details
 * @param isAsync - Is the event / function being call asynchronously or synchronously
 */
export function doPerf(mgrSource, getSource, func, details, isAsync) {
    if (mgrSource) {
        var perfMgr = mgrSource;
        if (isFunction(perfMgr["getPerfMgr"])) {
            // Looks like a perf manager provider object
            perfMgr = perfMgr["getPerfMgr"]();
        }
        if (perfMgr) {
            var perfEvt = void 0;
            var currentActive = perfMgr.getCtx(doPerfActiveKey);
            try {
                perfEvt = perfMgr.create(getSource(), details, isAsync);
                if (perfEvt) {
                    if (currentActive && perfEvt.setCtx) {
                        perfEvt.setCtx(PerfEvent.ParentContextKey, currentActive);
                        if (currentActive.getCtx && currentActive.setCtx) {
                            var children = currentActive.getCtx(PerfEvent.ChildrenContextKey);
                            if (!children) {
                                children = [];
                                currentActive.setCtx(PerfEvent.ChildrenContextKey, children);
                            }
                            children.push(perfEvt);
                        }
                    }
                    // Set this event as the active event now
                    perfMgr.setCtx(doPerfActiveKey, perfEvt);
                    return func(perfEvt);
                }
            }
            catch (ex) {
                if (perfEvt && perfEvt.setCtx) {
                    perfEvt.setCtx("exception", ex);
                }
            }
            finally {
                // fire the perf event
                if (perfEvt) {
                    perfMgr.fire(perfEvt);
                }
                // Reset the active event to the previous value
                perfMgr.setCtx(doPerfActiveKey, currentActive);
            }
        }
    }
    return func();
}//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/ee8c7def80afc00dd6e593ef12f37756d8f504ea/node_modules/@microsoft/applicationinsights-core-js/dist-esm/JavaScriptSDK/PerfManager.js.map