/*
 * Application Insights JavaScript SDK - Dependencies Plugin, 2.6.4
 * Copyright (c) Microsoft and contributors. All rights reserved.
 */


import { __extendsFn } from "@microsoft/applicationinsights-shims";
import { RequestHeaders, CorrelationIdHelper, TelemetryItemCreator, RemoteDependencyData, dateTimeUtilsNow, DisabledPropertyName, PropertiesPluginIdentifier, DistributedTracingModes } from '@microsoft/applicationinsights-common';
import { isNullOrUndefined, arrForEach, isString, strTrim, isFunction, LoggingSeverity, _InternalMessageId, BaseTelemetryPlugin, getLocation, getGlobal, strUndefined, strPrototype, InstrumentFunc, InstrumentProto, getPerformance, objForEachKey, generateW3CId, getIEVersion, dumpObj } from '@microsoft/applicationinsights-core-js';
import { ajaxRecord } from './ajaxRecord';
import { EventHelper } from './ajaxUtils';
import { Traceparent } from './TraceParent';
import dynamicProto from "@microsoft/dynamicproto-js";
var AJAX_MONITOR_PREFIX = "ai.ajxmn.";
var strDiagLog = "diagLog";
var strAjaxData = "ajaxData";
var strThrowInternal = "throwInternal";
var strFetch = "fetch";
// Using a global value so that to handle same iKey with multiple app insights instances (mostly for testing)
var _markCount = 0;
/** @Ignore */
function _supportsFetch() {
    var _global = getGlobal();
    if (!_global ||
        isNullOrUndefined(_global.Request) ||
        isNullOrUndefined(_global.Request[strPrototype]) ||
        isNullOrUndefined(_global[strFetch])) {
        return null;
    }
    return _global[strFetch];
}
/**
 * Determines whether ajax monitoring can be enabled on this document
 * @returns True if Ajax monitoring is supported on this page, otherwise false
 * @ignore
 */
function _supportsAjaxMonitoring(ajaxMonitorInstance) {
    var result = false;
    if (typeof XMLHttpRequest !== strUndefined && !isNullOrUndefined(XMLHttpRequest)) {
        var proto = XMLHttpRequest[strPrototype];
        result = !isNullOrUndefined(proto) &&
            !isNullOrUndefined(proto.open) &&
            !isNullOrUndefined(proto.send) &&
            !isNullOrUndefined(proto.abort);
    }
    var ieVer = getIEVersion();
    if (ieVer && ieVer < 9) {
        result = false;
    }
    if (result) {
        // Disable if the XmlHttpRequest can't be extended or hooked
        try {
            var xhr = new XMLHttpRequest();
            xhr[strAjaxData] = {};
            // Check that we can update the prototype
            var theOpen = XMLHttpRequest[strPrototype].open;
            XMLHttpRequest[strPrototype].open = theOpen;
        }
        catch (e) {
            // We can't decorate the xhr object so disable monitoring
            result = false;
            _throwInternalCritical(ajaxMonitorInstance, _InternalMessageId.FailedMonitorAjaxOpen, "Failed to enable XMLHttpRequest monitoring, extension is not supported", {
                exception: dumpObj(e)
            });
        }
    }
    return result;
}
/** @Ignore */
function _getFailedAjaxDiagnosticsMessage(xhr) {
    var result = "";
    try {
        if (!isNullOrUndefined(xhr) &&
            !isNullOrUndefined(xhr[strAjaxData]) &&
            !isNullOrUndefined(xhr[strAjaxData].requestUrl)) {
            result += "(url: '" + xhr[strAjaxData].requestUrl + "')";
        }
    }
    catch (e) { }
    return result;
}
/** @ignore */
function _throwInternalCritical(ajaxMonitorInstance, msgId, message, properties, isUserAct) {
    ajaxMonitorInstance[strDiagLog]()[strThrowInternal](LoggingSeverity.CRITICAL, msgId, message, properties, isUserAct);
}
/** @ignore */
function _throwInternalWarning(ajaxMonitorInstance, msgId, message, properties, isUserAct) {
    ajaxMonitorInstance[strDiagLog]()[strThrowInternal](LoggingSeverity.WARNING, msgId, message, properties, isUserAct);
}
/** @Ignore */
function _createErrorCallbackFunc(ajaxMonitorInstance, internalMessage, message) {
    // tslint:disable-next-line
    return function (args) {
        _throwInternalCritical(ajaxMonitorInstance, internalMessage, message, {
            ajaxDiagnosticsMessage: _getFailedAjaxDiagnosticsMessage(args.inst),
            exception: dumpObj(args.err)
        });
    };
}
function _indexOf(value, match) {
    if (value && match) {
        return value.indexOf(match);
    }
    return -1;
}
var AjaxMonitor = /** @class */ (function (_super) {
    __extendsFn(AjaxMonitor, _super);
    function AjaxMonitor() {
        var _this = _super.call(this) || this;
        _this.identifier = AjaxMonitor.identifier;
        _this.priority = 120;
        var strTrackDependencyDataInternal = "trackDependencyDataInternal"; // Using string to help with minification
        var location = getLocation();
        var _fetchInitialized = false; // fetch monitoring initialized
        var _xhrInitialized = false; // XHR monitoring initialized
        var _currentWindowHost = location && location.host && location.host.toLowerCase();
        var _config = AjaxMonitor.getEmptyConfig();
        var _enableRequestHeaderTracking = false;
        var _trackAjaxAttempts = 0;
        var _context;
        var _isUsingW3CHeaders;
        var _isUsingAIHeaders;
        var _markPrefix;
        var _enableAjaxPerfTracking = false;
        var _maxAjaxCallsPerView = 0;
        var _enableResponseHeaderTracking = false;
        var _hooks = [];
        var _disabledUrls = {};
        var _excludeRequestFromAutoTrackingPatterns;
        dynamicProto(AjaxMonitor, _this, function (_self, base) {
            _self.initialize = function (config, core, extensions, pluginChain) {
                if (!_self.isInitialized()) {
                    base.initialize(config, core, extensions, pluginChain);
                    var ctx_1 = _self._getTelCtx();
                    var defaultConfig = AjaxMonitor.getDefaultConfig();
                    objForEachKey(defaultConfig, function (field, value) {
                        _config[field] = ctx_1.getConfig(AjaxMonitor.identifier, field, value);
                    });
                    var distributedTracingMode = _config.distributedTracingMode;
                    _enableRequestHeaderTracking = _config.enableRequestHeaderTracking;
                    _enableAjaxPerfTracking = _config.enableAjaxPerfTracking;
                    _maxAjaxCallsPerView = _config.maxAjaxCallsPerView;
                    _enableResponseHeaderTracking = _config.enableResponseHeaderTracking;
                    _excludeRequestFromAutoTrackingPatterns = _config.excludeRequestFromAutoTrackingPatterns;
                    _isUsingAIHeaders = distributedTracingMode === DistributedTracingModes.AI || distributedTracingMode === DistributedTracingModes.AI_AND_W3C;
                    _isUsingW3CHeaders = distributedTracingMode === DistributedTracingModes.AI_AND_W3C || distributedTracingMode === DistributedTracingModes.W3C;
                    if (_enableAjaxPerfTracking) {
                        var iKey = config.instrumentationKey || "unkwn";
                        if (iKey.length > 5) {
                            _markPrefix = AJAX_MONITOR_PREFIX + iKey.substring(iKey.length - 5) + ".";
                        }
                        else {
                            _markPrefix = AJAX_MONITOR_PREFIX + iKey + ".";
                        }
                    }
                    if (_config.disableAjaxTracking === false) {
                        _instrumentXhr();
                    }
                    _instrumentFetch();
                    if (extensions.length > 0 && extensions) {
                        var propExt = void 0, extIx = 0;
                        while (!propExt && extIx < extensions.length) {
                            if (extensions[extIx] && extensions[extIx].identifier === PropertiesPluginIdentifier) {
                                propExt = extensions[extIx];
                            }
                            extIx++;
                        }
                        if (propExt) {
                            _context = propExt.context; // we could move IPropertiesPlugin to common as well
                        }
                    }
                }
            };
            _self.teardown = function () {
                // Remove all instrumentation hooks
                arrForEach(_hooks, function (fn) {
                    fn.rm();
                });
                _hooks = [];
                _fetchInitialized = false;
                _xhrInitialized = false;
                _self.setInitialized(false);
            };
            _self.trackDependencyData = function (dependency, properties) {
                _self[strTrackDependencyDataInternal](dependency, properties);
            };
            _self.includeCorrelationHeaders = function (ajaxData, input, init, xhr) {
                // Test Hook to allow the overriding of the location host
                var currentWindowHost = _self["_currentWindowHost"] || _currentWindowHost;
                if (input) {
                    if (CorrelationIdHelper.canIncludeCorrelationHeader(_config, ajaxData.getAbsoluteUrl(), currentWindowHost)) {
                        if (!init) {
                            init = {};
                        }
                        // init headers override original request headers
                        // so, if they exist use only them, otherwise use request's because they should have been applied in the first place
                        // not using original request headers will result in them being lost
                        init.headers = new Headers(init.headers || (input instanceof Request ? (input.headers || {}) : {}));
                        if (_isUsingAIHeaders) {
                            var id = "|" + ajaxData.traceID + "." + ajaxData.spanID;
                            init.headers.set(RequestHeaders.requestIdHeader, id);
                            if (_enableRequestHeaderTracking) {
                                ajaxData.requestHeaders[RequestHeaders.requestIdHeader] = id;
                            }
                        }
                        var appId = _config.appId || (_context && _context.appId());
                        if (appId) {
                            init.headers.set(RequestHeaders.requestContextHeader, RequestHeaders.requestContextAppIdFormat + appId);
                            if (_enableRequestHeaderTracking) {
                                ajaxData.requestHeaders[RequestHeaders.requestContextHeader] = RequestHeaders.requestContextAppIdFormat + appId;
                            }
                        }
                        if (_isUsingW3CHeaders) {
                            var traceparent = new Traceparent(ajaxData.traceID, ajaxData.spanID);
                            init.headers.set(RequestHeaders.traceParentHeader, traceparent.toString());
                            if (_enableRequestHeaderTracking) {
                                ajaxData.requestHeaders[RequestHeaders.traceParentHeader] = traceparent.toString();
                            }
                        }
                    }
                    return init;
                }
                else if (xhr) {
                    if (CorrelationIdHelper.canIncludeCorrelationHeader(_config, ajaxData.getAbsoluteUrl(), currentWindowHost)) {
                        if (_isUsingAIHeaders) {
                            var id = "|" + ajaxData.traceID + "." + ajaxData.spanID;
                            xhr.setRequestHeader(RequestHeaders.requestIdHeader, id);
                            if (_enableRequestHeaderTracking) {
                                ajaxData.requestHeaders[RequestHeaders.requestIdHeader] = id;
                            }
                        }
                        var appId = _config.appId || (_context && _context.appId());
                        if (appId) {
                            xhr.setRequestHeader(RequestHeaders.requestContextHeader, RequestHeaders.requestContextAppIdFormat + appId);
                            if (_enableRequestHeaderTracking) {
                                ajaxData.requestHeaders[RequestHeaders.requestContextHeader] = RequestHeaders.requestContextAppIdFormat + appId;
                            }
                        }
                        if (_isUsingW3CHeaders) {
                            var traceparent = new Traceparent(ajaxData.traceID, ajaxData.spanID);
                            xhr.setRequestHeader(RequestHeaders.traceParentHeader, traceparent.toString());
                            if (_enableRequestHeaderTracking) {
                                ajaxData.requestHeaders[RequestHeaders.traceParentHeader] = traceparent.toString();
                            }
                        }
                    }
                    return xhr;
                }
                return undefined;
            };
            _self[strTrackDependencyDataInternal] = function (dependency, properties, systemProperties) {
                if (_maxAjaxCallsPerView === -1 || _trackAjaxAttempts < _maxAjaxCallsPerView) {
                    // Hack since expected format in w3c mode is |abc.def.
                    // Non-w3c format is |abc.def
                    // @todo Remove if better solution is available, e.g. handle in portal
                    if ((_config.distributedTracingMode === DistributedTracingModes.W3C
                        || _config.distributedTracingMode === DistributedTracingModes.AI_AND_W3C)
                        && typeof dependency.id === "string" && dependency.id[dependency.id.length - 1] !== ".") {
                        dependency.id += ".";
                    }
                    if (isNullOrUndefined(dependency.startTime)) {
                        dependency.startTime = new Date();
                    }
                    var item = TelemetryItemCreator.create(dependency, RemoteDependencyData.dataType, RemoteDependencyData.envelopeType, _self[strDiagLog](), properties, systemProperties);
                    _self.core.track(item);
                }
                else if (_trackAjaxAttempts === _maxAjaxCallsPerView) {
                    _throwInternalCritical(_self, _InternalMessageId.MaxAjaxPerPVExceeded, "Maximum ajax per page view limit reached, ajax monitoring is paused until the next trackPageView(). In order to increase the limit set the maxAjaxCallsPerView configuration parameter.", true);
                }
                ++_trackAjaxAttempts;
            };
            // discard the header if it's defined as ignoreHeaders in ICorrelationConfig
            function _canIncludeHeaders(header) {
                var rlt = true;
                if (header || _config.ignoreHeaders) {
                    arrForEach(_config.ignoreHeaders, (function (key) {
                        if (key.toLowerCase() === header.toLowerCase()) {
                            rlt = false;
                            return -1;
                        }
                    }));
                }
                return rlt;
            }
            // Fetch Stuff
            function _instrumentFetch() {
                var fetch = _supportsFetch();
                if (!fetch) {
                    return;
                }
                var global = getGlobal();
                var isPolyfill = fetch.polyfill;
                if (_config.disableFetchTracking === false) {
                    _hooks.push(InstrumentFunc(global, strFetch, {
                        // Add request hook
                        req: function (callDetails, input, init) {
                            var fetchData;
                            if (_fetchInitialized &&
                                !_isDisabledRequest(null, input, init) &&
                                // If we have a polyfil and XHR instrumented then let XHR report otherwise we get duplicates
                                !(isPolyfill && _xhrInitialized)) {
                                var ctx = callDetails.ctx();
                                fetchData = _createFetchRecord(input, init);
                                var newInit = _self.includeCorrelationHeaders(fetchData, input, init);
                                if (newInit !== init) {
                                    callDetails.set(1, newInit);
                                }
                                ctx.data = fetchData;
                            }
                        },
                        rsp: function (callDetails, input) {
                            var fetchData = callDetails.ctx().data;
                            if (fetchData) {
                                // Replace the result with the new promise from this code
                                callDetails.rslt = callDetails.rslt.then(function (response) {
                                    _reportFetchMetrics(callDetails, (response || {}).status, response, fetchData, function () {
                                        var ajaxResponse = {
                                            statusText: response.statusText,
                                            headerMap: null,
                                            correlationContext: _getFetchCorrelationContext(response)
                                        };
                                        if (_enableResponseHeaderTracking) {
                                            var responseHeaderMap_1 = {};
                                            response.headers.forEach(function (value, name) {
                                                if (_canIncludeHeaders(name)) {
                                                    responseHeaderMap_1[name] = value;
                                                }
                                            });
                                            ajaxResponse.headerMap = responseHeaderMap_1;
                                        }
                                        return ajaxResponse;
                                    });
                                    return response;
                                })["catch"](function (reason) {
                                    _reportFetchMetrics(callDetails, 0, input, fetchData, null, { error: reason.message });
                                    throw reason;
                                });
                            }
                        },
                        // Create an error callback to report any hook errors
                        hkErr: _createErrorCallbackFunc(_self, _InternalMessageId.FailedMonitorAjaxOpen, "Failed to monitor Window.fetch, monitoring data for this fetch call may be incorrect.")
                    }));
                    _fetchInitialized = true;
                }
                else if (isPolyfill) {
                    // If fetch is a polyfill we need to capture the request to ensure that we correctly track
                    // disabled request URLS (i.e. internal urls) to ensure we don't end up in a constant loop
                    // of reporting ourselves, for example React Native uses a polyfill for fetch
                    // Note: Polyfill implementations that don't support the "poyyfill" tag are not supported
                    // the workaround is to add a polyfill property to your fetch implementation before initializing
                    // App Insights
                    _hooks.push(InstrumentFunc(global, strFetch, {
                        req: function (callDetails, input, init) {
                            // Just call so that we record any disabled URL
                            _isDisabledRequest(null, input, init);
                        }
                    }));
                }
                if (isPolyfill) {
                    // retag the instrumented fetch with the same polyfill settings this is mostly for testing
                    // But also supports multiple App Insights usages
                    global[strFetch].polyfill = isPolyfill;
                }
            }
            function _hookProto(target, funcName, callbacks) {
                _hooks.push(InstrumentProto(target, funcName, callbacks));
            }
            function _instrumentXhr() {
                if (_supportsAjaxMonitoring(_self) && !_xhrInitialized) {
                    // Instrument open
                    _hookProto(XMLHttpRequest, "open", {
                        req: function (args, method, url, async) {
                            var xhr = args.inst;
                            var ajaxData = xhr[strAjaxData];
                            if (!_isDisabledRequest(xhr, url) && _isMonitoredXhrInstance(xhr, true) &&
                                (!ajaxData || !ajaxData.xhrMonitoringState.openDone)) {
                                _openHandler(xhr, method, url, async);
                            }
                        },
                        hkErr: _createErrorCallbackFunc(_self, _InternalMessageId.FailedMonitorAjaxOpen, "Failed to monitor XMLHttpRequest.open, monitoring data for this ajax call may be incorrect.")
                    });
                    // Instrument send
                    _hookProto(XMLHttpRequest, "send", {
                        req: function (args, context) {
                            var xhr = args.inst;
                            var ajaxData = xhr[strAjaxData];
                            if (_isMonitoredXhrInstance(xhr) && !ajaxData.xhrMonitoringState.sendDone) {
                                _createMarkId("xhr", ajaxData);
                                ajaxData.requestSentTime = dateTimeUtilsNow();
                                _self.includeCorrelationHeaders(ajaxData, undefined, undefined, xhr);
                                ajaxData.xhrMonitoringState.sendDone = true;
                            }
                        },
                        hkErr: _createErrorCallbackFunc(_self, _InternalMessageId.FailedMonitorAjaxSend, "Failed to monitor XMLHttpRequest, monitoring data for this ajax call may be incorrect.")
                    });
                    // Instrument abort
                    _hookProto(XMLHttpRequest, "abort", {
                        req: function (args) {
                            var xhr = args.inst;
                            var ajaxData = xhr[strAjaxData];
                            if (_isMonitoredXhrInstance(xhr) && !ajaxData.xhrMonitoringState.abortDone) {
                                ajaxData.aborted = 1;
                                ajaxData.xhrMonitoringState.abortDone = true;
                            }
                        },
                        hkErr: _createErrorCallbackFunc(_self, _InternalMessageId.FailedMonitorAjaxAbort, "Failed to monitor XMLHttpRequest.abort, monitoring data for this ajax call may be incorrect.")
                    });
                    // Instrument setRequestHeader
                    if (_enableRequestHeaderTracking) {
                        _hookProto(XMLHttpRequest, "setRequestHeader", {
                            req: function (args, header, value) {
                                var xhr = args.inst;
                                if (_isMonitoredXhrInstance(xhr) && _canIncludeHeaders(header)) {
                                    xhr[strAjaxData].requestHeaders[header] = value;
                                }
                            },
                            hkErr: _createErrorCallbackFunc(_self, _InternalMessageId.FailedMonitorAjaxSetRequestHeader, "Failed to monitor XMLHttpRequest.setRequestHeader, monitoring data for this ajax call may be incorrect.")
                        });
                    }
                    _xhrInitialized = true;
                }
            }
            function _isDisabledRequest(xhr, request, init) {
                var isDisabled = false;
                var theUrl = ((!isString(request) ? (request || {}).url || "" : request) || "").toLowerCase();
                // check excludeRequestFromAutoTrackingPatterns before stripping off any query string
                arrForEach(_excludeRequestFromAutoTrackingPatterns, function (regex) {
                    var theRegex = regex;
                    if (isString(regex)) {
                        theRegex = new RegExp(regex);
                    }
                    if (!isDisabled) {
                        isDisabled = theRegex.test(theUrl);
                    }
                });
                // if request url matches with exclude regex pattern, return true and no need to check for headers
                if (isDisabled) {
                    return isDisabled;
                }
                var idx = _indexOf(theUrl, "?");
                var idx2 = _indexOf(theUrl, "#");
                if (idx === -1 || (idx2 !== -1 && idx2 < idx)) {
                    idx = idx2;
                }
                if (idx !== -1) {
                    // Strip off any Query string
                    theUrl = theUrl.substring(0, idx);
                }
                // check that this instance is not not used by ajax call performed inside client side monitoring to send data to collector
                if (!isNullOrUndefined(xhr)) {
                    // Look on the XMLHttpRequest of the URL string value
                    isDisabled = xhr[DisabledPropertyName] === true || theUrl[DisabledPropertyName] === true;
                }
                else if (!isNullOrUndefined(request)) {
                    // Look for DisabledPropertyName in either Request or RequestInit
                    isDisabled = (typeof request === 'object' ? request[DisabledPropertyName] === true : false) ||
                        (init ? init[DisabledPropertyName] === true : false);
                }
                if (isDisabled) {
                    // Add the disabled url if not present
                    if (!_disabledUrls[theUrl]) {
                        _disabledUrls[theUrl] = 1;
                    }
                }
                else {
                    // Check to see if the url is listed as disabled
                    if (_disabledUrls[theUrl]) {
                        isDisabled = true;
                    }
                }
                return isDisabled;
            }
            /// <summary>Verifies that particalar instance of XMLHttpRequest needs to be monitored</summary>
            /// <param name="excludeAjaxDataValidation">Optional parameter. True if ajaxData must be excluded from verification</param>
            /// <returns type="bool">True if instance needs to be monitored, otherwise false</returns>
            function _isMonitoredXhrInstance(xhr, excludeAjaxDataValidation) {
                var ajaxValidation = true;
                var initialized = _xhrInitialized;
                if (!isNullOrUndefined(xhr)) {
                    ajaxValidation = excludeAjaxDataValidation === true || !isNullOrUndefined(xhr[strAjaxData]);
                }
                // checking to see that all interested functions on xhr were instrumented
                return initialized
                    // checking on ajaxData to see that it was not removed in user code
                    && ajaxValidation;
            }
            function _openHandler(xhr, method, url, async) {
                var traceID = (_context && _context.telemetryTrace && _context.telemetryTrace.traceID) || generateW3CId();
                var spanID = generateW3CId().substr(0, 16);
                var ajaxData = new ajaxRecord(traceID, spanID, _self[strDiagLog]());
                ajaxData.method = method;
                ajaxData.requestUrl = url;
                ajaxData.xhrMonitoringState.openDone = true;
                ajaxData.requestHeaders = {};
                ajaxData.async = async;
                xhr[strAjaxData] = ajaxData;
                _attachToOnReadyStateChange(xhr);
            }
            function _attachToOnReadyStateChange(xhr) {
                xhr[strAjaxData].xhrMonitoringState.stateChangeAttached = EventHelper.Attach(xhr, "readystatechange", function () {
                    try {
                        if (xhr && xhr.readyState === 4 && _isMonitoredXhrInstance(xhr)) {
                            _onAjaxComplete(xhr);
                        }
                    }
                    catch (e) {
                        var exceptionText = dumpObj(e);
                        // ignore messages with c00c023f, as this a known IE9 XHR abort issue
                        if (!exceptionText || _indexOf(exceptionText.toLowerCase(), "c00c023f") === -1) {
                            _throwInternalCritical(_self, _InternalMessageId.FailedMonitorAjaxRSC, "Failed to monitor XMLHttpRequest 'readystatechange' event handler, monitoring data for this ajax call may be incorrect.", {
                                ajaxDiagnosticsMessage: _getFailedAjaxDiagnosticsMessage(xhr),
                                exception: exceptionText
                            });
                        }
                    }
                });
            }
            function _getResponseText(xhr) {
                try {
                    var responseType = xhr.responseType;
                    if (responseType === "" || responseType === "text") {
                        // As per the specification responseText is only valid if the type is an empty string or "text"
                        return xhr.responseText;
                    }
                }
                catch (e) {
                    // This shouldn't happend because of the above check -- but just in case, so just ignore
                }
                return null;
            }
            function _onAjaxComplete(xhr) {
                var ajaxData = xhr[strAjaxData];
                ajaxData.responseFinishedTime = dateTimeUtilsNow();
                ajaxData.status = xhr.status;
                function _reportXhrError(e, failedProps) {
                    var errorProps = failedProps || {};
                    errorProps["ajaxDiagnosticsMessage"] = _getFailedAjaxDiagnosticsMessage(xhr);
                    if (e) {
                        errorProps["exception"] = dumpObj(e);
                    }
                    _throwInternalWarning(_self, _InternalMessageId.FailedMonitorAjaxDur, "Failed to calculate the duration of the ajax call, monitoring data for this ajax call won't be sent.", errorProps);
                }
                _findPerfResourceEntry("xmlhttprequest", ajaxData, function () {
                    try {
                        var dependency = ajaxData.CreateTrackItem("Ajax", _enableRequestHeaderTracking, function () {
                            var ajaxResponse = {
                                statusText: xhr.statusText,
                                headerMap: null,
                                correlationContext: _getAjaxCorrelationContext(xhr),
                                type: xhr.responseType,
                                responseText: _getResponseText(xhr),
                                response: xhr.response
                            };
                            if (_enableResponseHeaderTracking) {
                                var headers = xhr.getAllResponseHeaders();
                                if (headers) {
                                    // xhr.getAllResponseHeaders() method returns all the response headers, separated by CRLF, as a string or null
                                    // the regex converts the header string into an array of individual headers
                                    var arr = strTrim(headers).split(/[\r\n]+/);
                                    var responseHeaderMap_2 = {};
                                    arrForEach(arr, function (line) {
                                        var parts = line.split(': ');
                                        var header = parts.shift();
                                        var value = parts.join(': ');
                                        if (_canIncludeHeaders(header)) {
                                            responseHeaderMap_2[header] = value;
                                        }
                                    });
                                    ajaxResponse.headerMap = responseHeaderMap_2;
                                }
                            }
                            return ajaxResponse;
                        });
                        if (dependency) {
                            _self[strTrackDependencyDataInternal](dependency);
                        }
                        else {
                            _reportXhrError(null, {
                                requestSentTime: ajaxData.requestSentTime,
                                responseFinishedTime: ajaxData.responseFinishedTime
                            });
                        }
                    }
                    finally {
                        // cleanup telemetry data
                        try {
                            xhr[strAjaxData] = null;
                        }
                        catch (e) {
                            // May throw in environments that prevent extension or freeze xhr
                        }
                    }
                }, function (e) {
                    _reportXhrError(e, null);
                });
            }
            function _getAjaxCorrelationContext(xhr) {
                try {
                    var responseHeadersString = xhr.getAllResponseHeaders();
                    if (responseHeadersString !== null) {
                        var index = _indexOf(responseHeadersString.toLowerCase(), RequestHeaders.requestContextHeaderLowerCase);
                        if (index !== -1) {
                            var responseHeader = xhr.getResponseHeader(RequestHeaders.requestContextHeader);
                            return CorrelationIdHelper.getCorrelationContext(responseHeader);
                        }
                    }
                }
                catch (e) {
                    _throwInternalWarning(_self, _InternalMessageId.FailedMonitorAjaxGetCorrelationHeader, "Failed to get Request-Context correlation header as it may be not included in the response or not accessible.", {
                        ajaxDiagnosticsMessage: _getFailedAjaxDiagnosticsMessage(xhr),
                        exception: dumpObj(e)
                    });
                }
            }
            function _createMarkId(type, ajaxData) {
                if (ajaxData.requestUrl && _markPrefix && _enableAjaxPerfTracking) {
                    var performance_1 = getPerformance();
                    if (performance_1 && isFunction(performance_1.mark)) {
                        _markCount++;
                        var markId = _markPrefix + type + "#" + _markCount;
                        performance_1.mark(markId);
                        var entries = performance_1.getEntriesByName(markId);
                        if (entries && entries.length === 1) {
                            ajaxData.perfMark = entries[0];
                        }
                    }
                }
            }
            function _findPerfResourceEntry(initiatorType, ajaxData, trackCallback, reportError) {
                var perfMark = ajaxData.perfMark;
                var performance = getPerformance();
                var maxAttempts = _config.maxAjaxPerfLookupAttempts;
                var retryDelay = _config.ajaxPerfLookupDelay;
                var requestUrl = ajaxData.requestUrl;
                var attempt = 0;
                (function locateResourceTiming() {
                    try {
                        if (performance && perfMark) {
                            attempt++;
                            var perfTiming = null;
                            var entries = performance.getEntries();
                            for (var lp = entries.length - 1; lp >= 0; lp--) {
                                var entry = entries[lp];
                                if (entry) {
                                    if (entry.entryType === "resource") {
                                        if (entry.initiatorType === initiatorType &&
                                            (_indexOf(entry.name, requestUrl) !== -1 || _indexOf(requestUrl, entry.name) !== -1)) {
                                            perfTiming = entry;
                                        }
                                    }
                                    else if (entry.entryType === "mark" && entry.name === perfMark.name) {
                                        // We hit the start event
                                        ajaxData.perfTiming = perfTiming;
                                        break;
                                    }
                                    if (entry.startTime < perfMark.startTime - 1000) {
                                        // Fallback to try and reduce the time spent looking for the perf entry
                                        break;
                                    }
                                }
                            }
                        }
                        if (!perfMark || // - we don't have a perfMark or
                            ajaxData.perfTiming || // - we have not found the perf entry or
                            attempt >= maxAttempts || // - we have tried too many attempts or
                            ajaxData.async === false) {
                            if (perfMark && isFunction(performance.clearMarks)) {
                                // Remove the mark so we don't fill up the performance resources too much
                                performance.clearMarks(perfMark.name);
                            }
                            ajaxData.perfAttempts = attempt;
                            // just continue and report the track event
                            trackCallback();
                        }
                        else {
                            // We need to wait for the browser to populate the window.performance entry
                            // This needs to be at least 1ms as waiting <= 1 (on firefox) is not enough time for fetch or xhr,
                            // this is a scheduling issue for the browser implementation
                            setTimeout(locateResourceTiming, retryDelay);
                        }
                    }
                    catch (e) {
                        reportError(e);
                    }
                })();
            }
            function _createFetchRecord(input, init) {
                var traceID = (_context && _context.telemetryTrace && _context.telemetryTrace.traceID) || generateW3CId();
                var spanID = generateW3CId().substr(0, 16);
                var ajaxData = new ajaxRecord(traceID, spanID, _self[strDiagLog]());
                ajaxData.requestSentTime = dateTimeUtilsNow();
                if (input instanceof Request) {
                    ajaxData.requestUrl = input ? input.url : "";
                }
                else {
                    ajaxData.requestUrl = input;
                }
                var method = "GET";
                if (init && init.method) {
                    method = init.method;
                }
                else if (input && input instanceof Request) {
                    method = input.method;
                }
                ajaxData.method = method;
                var requestHeaders = {};
                if (_enableRequestHeaderTracking) {
                    var headers = new Headers((init ? init.headers : 0) || (input instanceof Request ? (input.headers || {}) : {}));
                    headers.forEach(function (value, key) {
                        if (_canIncludeHeaders(key)) {
                            requestHeaders[key] = value;
                        }
                    });
                }
                ajaxData.requestHeaders = requestHeaders;
                _createMarkId("fetch", ajaxData);
                return ajaxData;
            }
            function _getFailedFetchDiagnosticsMessage(input) {
                var result = "";
                try {
                    if (!isNullOrUndefined(input)) {
                        if (typeof (input) === "string") {
                            result += "(url: '" + input + "')";
                        }
                        else {
                            result += "(url: '" + input.url + "')";
                        }
                    }
                }
                catch (e) {
                    _throwInternalCritical(_self, _InternalMessageId.FailedMonitorAjaxOpen, "Failed to grab failed fetch diagnostics message", { exception: dumpObj(e) });
                }
                return result;
            }
            function _reportFetchMetrics(callDetails, status, input, ajaxData, getResponse, properties) {
                if (!ajaxData) {
                    return;
                }
                function _reportFetchError(msgId, e, failedProps) {
                    var errorProps = failedProps || {};
                    errorProps["fetchDiagnosticsMessage"] = _getFailedFetchDiagnosticsMessage(input);
                    if (e) {
                        errorProps["exception"] = dumpObj(e);
                    }
                    _throwInternalWarning(_self, msgId, "Failed to calculate the duration of the fetch call, monitoring data for this fetch call won't be sent.", errorProps);
                }
                ajaxData.responseFinishedTime = dateTimeUtilsNow();
                ajaxData.status = status;
                _findPerfResourceEntry("fetch", ajaxData, function () {
                    var dependency = ajaxData.CreateTrackItem("Fetch", _enableRequestHeaderTracking, getResponse);
                    if (dependency) {
                        _self[strTrackDependencyDataInternal](dependency);
                    }
                    else {
                        _reportFetchError(_InternalMessageId.FailedMonitorAjaxDur, null, {
                            requestSentTime: ajaxData.requestSentTime,
                            responseFinishedTime: ajaxData.responseFinishedTime
                        });
                    }
                }, function (e) {
                    _reportFetchError(_InternalMessageId.FailedMonitorAjaxGetCorrelationHeader, e, null);
                });
            }
            function _getFetchCorrelationContext(response) {
                if (response && response.headers) {
                    try {
                        var responseHeader = response.headers.get(RequestHeaders.requestContextHeader);
                        return CorrelationIdHelper.getCorrelationContext(responseHeader);
                    }
                    catch (e) {
                        _throwInternalWarning(_self, _InternalMessageId.FailedMonitorAjaxGetCorrelationHeader, "Failed to get Request-Context correlation header as it may be not included in the response or not accessible.", {
                            fetchDiagnosticsMessage: _getFailedFetchDiagnosticsMessage(response),
                            exception: dumpObj(e)
                        });
                    }
                }
            }
        });
        return _this;
    }
    AjaxMonitor.getDefaultConfig = function () {
        var config = {
            maxAjaxCallsPerView: 500,
            disableAjaxTracking: false,
            disableFetchTracking: true,
            excludeRequestFromAutoTrackingPatterns: undefined,
            disableCorrelationHeaders: false,
            distributedTracingMode: DistributedTracingModes.AI_AND_W3C,
            correlationHeaderExcludedDomains: [
                "*.blob.core.windows.net",
                "*.blob.core.chinacloudapi.cn",
                "*.blob.core.cloudapi.de",
                "*.blob.core.usgovcloudapi.net"
            ],
            correlationHeaderDomains: undefined,
            correlationHeaderExcludePatterns: undefined,
            appId: undefined,
            enableCorsCorrelation: false,
            enableRequestHeaderTracking: false,
            enableResponseHeaderTracking: false,
            enableAjaxErrorStatusText: false,
            enableAjaxPerfTracking: false,
            maxAjaxPerfLookupAttempts: 3,
            ajaxPerfLookupDelay: 25,
            ignoreHeaders: [
                "Authorization",
                "X-API-Key",
                "WWW-Authenticate"
            ]
        };
        return config;
    };
    AjaxMonitor.getEmptyConfig = function () {
        var emptyConfig = this.getDefaultConfig();
        objForEachKey(emptyConfig, function (value) {
            emptyConfig[value] = undefined;
        });
        return emptyConfig;
    };
// Removed Stub for AjaxMonitor.prototype.initialize.
// Removed Stub for AjaxMonitor.prototype.teardown.
    AjaxMonitor.prototype.processTelemetry = function (item, itemCtx) {
        this.processNext(item, itemCtx);
    };
// Removed Stub for AjaxMonitor.prototype.trackDependencyData.
// Removed Stub for AjaxMonitor.prototype.includeCorrelationHeaders.
// Removed Stub for AjaxMonitor.prototype.trackDependencyDataInternal.
    AjaxMonitor.identifier = "AjaxDependencyPlugin";
    return AjaxMonitor;
}(BaseTelemetryPlugin));
export { AjaxMonitor };//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/ee8c7def80afc00dd6e593ef12f37756d8f504ea/node_modules/@microsoft/applicationinsights-dependencies-js/dist-esm/ajax.js.map