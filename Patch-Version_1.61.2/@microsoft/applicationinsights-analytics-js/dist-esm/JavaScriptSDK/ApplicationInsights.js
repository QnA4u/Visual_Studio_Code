/*
 * Application Insights JavaScript SDK - Web Analytics, 2.6.4
 * Copyright (c) Microsoft and contributors. All rights reserved.
 */
/**
 * ApplicationInsights.ts
 * @copyright Microsoft 2018
 */
import { __extendsFn, __assignFn } from "@microsoft/applicationinsights-shims";
import { PageViewPerformance, PageView, RemoteDependencyData, Event as EventTelemetry, TelemetryItemCreator, Metric, Exception, SeverityLevel, Trace, dateTimeUtilsDuration, PropertiesPluginIdentifier, AnalyticsPluginIdentifier, stringToBoolOrDefault, createDomEvent, strNotSpecified, isCrossOriginError, utlDisableStorage } from "@microsoft/applicationinsights-common";
import { BaseTelemetryPlugin, LoggingSeverity, _InternalMessageId, getWindow, getDocument, getHistory, getLocation, doPerf, objForEachKey, isFunction, isNullOrUndefined, arrForEach, generateW3CId, dumpObj, getExceptionName, safeGetCookieMgr } from "@microsoft/applicationinsights-core-js";
import { PageViewManager } from "./Telemetry/PageViewManager";
import { PageVisitTimeManager } from "./Telemetry/PageVisitTimeManager";
import { PageViewPerformanceManager } from './Telemetry/PageViewPerformanceManager';
import dynamicProto from "@microsoft/dynamicproto-js";
"use strict";
var durationProperty = "duration";
var strEvent = "event";
function _dispatchEvent(target, evnt) {
    if (target && target.dispatchEvent && evnt) {
        target.dispatchEvent(evnt);
    }
}
var ApplicationInsights = /** @class */ (function (_super) {
    __extendsFn(ApplicationInsights, _super);
    function ApplicationInsights() {
        var _this = _super.call(this) || this;
        _this.identifier = AnalyticsPluginIdentifier; // do not change name or priority
        _this.priority = 180; // take from reserved priority range 100- 200
        _this.autoRoutePVDelay = 500; // ms; Time to wait after a route change before triggering a pageview to allow DOM changes to take place
        var _eventTracking;
        var _pageTracking;
        var _properties;
        // Counts number of trackAjax invocations.
        // By default we only monitor X ajax call per view to avoid too much load.
        // Default value is set in config.
        // This counter keeps increasing even after the limit is reached.
        var _trackAjaxAttempts = 0;
        // array with max length of 2 that store current url and previous url for SPA page route change trackPageview use.
        var _prevUri; // Assigned in the constructor
        var _currUri;
        dynamicProto(ApplicationInsights, _this, function (_self, _base) {
            var location = getLocation(true);
            _prevUri = location && location.href || "";
            _self.getCookieMgr = function () {
                return safeGetCookieMgr(_self.core);
            };
            _self.processTelemetry = function (env, itemCtx) {
                doPerf(_self.core, function () { return _self.identifier + ":processTelemetry"; }, function () {
                    var doNotSendItem = false;
                    var telemetryInitializersCount = _self._telemetryInitializers.length;
                    itemCtx = _self._getTelCtx(itemCtx);
                    for (var i = 0; i < telemetryInitializersCount; ++i) {
                        var telemetryInitializer = _self._telemetryInitializers[i];
                        if (telemetryInitializer) {
                            try {
                                if (telemetryInitializer.apply(null, [env]) === false) {
                                    doNotSendItem = true;
                                    break;
                                }
                            }
                            catch (e) {
                                // log error but dont stop executing rest of the telemetry initializers
                                // doNotSendItem = true;
                                itemCtx.diagLog().throwInternal(LoggingSeverity.CRITICAL, _InternalMessageId.TelemetryInitializerFailed, "One of telemetry initializers failed, telemetry item will not be sent: " + getExceptionName(e), { exception: dumpObj(e) }, true);
                            }
                        }
                    }
                    if (!doNotSendItem) {
                        _self.processNext(env, itemCtx);
                    }
                }, function () { return ({ item: env }); }, !(env.sync));
            };
            _self.trackEvent = function (event, customProperties) {
                try {
                    var telemetryItem = TelemetryItemCreator.create(event, EventTelemetry.dataType, EventTelemetry.envelopeType, _self.diagLog(), customProperties);
                    _self.core.track(telemetryItem);
                }
                catch (e) {
                    _self.diagLog().throwInternal(LoggingSeverity.WARNING, _InternalMessageId.TrackTraceFailed, "trackTrace failed, trace will not be collected: " + getExceptionName(e), { exception: dumpObj(e) });
                }
            };
            /**
             * Start timing an extended event. Call `stopTrackEvent` to log the event when it ends.
             * @param   name    A string that identifies this event uniquely within the document.
             */
            _self.startTrackEvent = function (name) {
                try {
                    _eventTracking.start(name);
                }
                catch (e) {
                    _self.diagLog().throwInternal(LoggingSeverity.CRITICAL, _InternalMessageId.StartTrackEventFailed, "startTrackEvent failed, event will not be collected: " + getExceptionName(e), { exception: dumpObj(e) });
                }
            };
            /**
             * Log an extended event that you started timing with `startTrackEvent`.
             * @param   name    The string you used to identify this event in `startTrackEvent`.
             * @param   properties  map[string, string] - additional data used to filter events and metrics in the portal. Defaults to empty.
             * @param   measurements    map[string, number] - metrics associated with this event, displayed in Metrics Explorer on the portal. Defaults to empty.
             */
            _self.stopTrackEvent = function (name, properties, measurements) {
                try {
                    _eventTracking.stop(name, undefined, properties); // Todo: Fix to pass measurements once type is updated
                }
                catch (e) {
                    _self.diagLog().throwInternal(LoggingSeverity.CRITICAL, _InternalMessageId.StopTrackEventFailed, "stopTrackEvent failed, event will not be collected: " + getExceptionName(e), { exception: dumpObj(e) });
                }
            };
            /**
             * @description Log a diagnostic message
             * @param {ITraceTelemetry} trace
             * @param ICustomProperties.
             * @memberof ApplicationInsights
             */
            _self.trackTrace = function (trace, customProperties) {
                try {
                    var telemetryItem = TelemetryItemCreator.create(trace, Trace.dataType, Trace.envelopeType, _self.diagLog(), customProperties);
                    _self.core.track(telemetryItem);
                }
                catch (e) {
                    _self.diagLog().throwInternal(LoggingSeverity.WARNING, _InternalMessageId.TrackTraceFailed, "trackTrace failed, trace will not be collected: " + getExceptionName(e), { exception: dumpObj(e) });
                }
            };
            /**
             * @description Log a numeric value that is not associated with a specific event. Typically
             * used to send regular reports of performance indicators. To send single measurement, just
             * use the name and average fields of {@link IMetricTelemetry}. If you take measurements
             * frequently, you can reduce the telemetry bandwidth by aggregating multiple measurements
             * and sending the resulting average at intervals
             * @param {IMetricTelemetry} metric input object argument. Only name and average are mandatory.
             * @param {{[key: string]: any}} customProperties additional data used to filter metrics in the
             * portal. Defaults to empty.
             * @memberof ApplicationInsights
             */
            _self.trackMetric = function (metric, customProperties) {
                try {
                    var telemetryItem = TelemetryItemCreator.create(metric, Metric.dataType, Metric.envelopeType, _self.diagLog(), customProperties);
                    _self.core.track(telemetryItem);
                }
                catch (e) {
                    _self.diagLog().throwInternal(LoggingSeverity.CRITICAL, _InternalMessageId.TrackMetricFailed, "trackMetric failed, metric will not be collected: " + getExceptionName(e), { exception: dumpObj(e) });
                }
            };
            /**
             * Logs that a page or other item was viewed.
             * @param IPageViewTelemetry The string you used as the name in startTrackPage. Defaults to the document title.
             * @param customProperties Additional data used to filter events and metrics. Defaults to empty.
             * If a user wants to provide duration for pageLoad, it'll have to be in pageView.properties.duration
             */
            _self.trackPageView = function (pageView, customProperties) {
                try {
                    var inPv = pageView || {};
                    _self._pageViewManager.trackPageView(inPv, __assignFn({}, inPv.properties, inPv.measurements, customProperties));
                    if (_self.config.autoTrackPageVisitTime) {
                        _self._pageVisitTimeManager.trackPreviousPageVisit(inPv.name, inPv.uri);
                    }
                }
                catch (e) {
                    _self.diagLog().throwInternal(LoggingSeverity.CRITICAL, _InternalMessageId.TrackPVFailed, "trackPageView failed, page view will not be collected: " + getExceptionName(e), { exception: dumpObj(e) });
                }
            };
            /**
             * Create a page view telemetry item and send it to the SDK pipeline through the core.track API
             * @param pageView Page view item to be sent
             * @param properties Custom properties (Part C) that a user can add to the telemetry item
             * @param systemProperties System level properties (Part A) that a user can add to the telemetry item
             */
            _self.sendPageViewInternal = function (pageView, properties, systemProperties) {
                var doc = getDocument();
                if (doc) {
                    pageView.refUri = pageView.refUri === undefined ? doc.referrer : pageView.refUri;
                }
                var telemetryItem = TelemetryItemCreator.create(pageView, PageView.dataType, PageView.envelopeType, _self.diagLog(), properties, systemProperties);
                _self.core.track(telemetryItem);
                // reset ajaxes counter
                _trackAjaxAttempts = 0;
            };
            /**
             * @ignore INTERNAL ONLY
             * @param pageViewPerformance
             * @param properties
             */
            _self.sendPageViewPerformanceInternal = function (pageViewPerformance, properties, systemProperties) {
                var telemetryItem = TelemetryItemCreator.create(pageViewPerformance, PageViewPerformance.dataType, PageViewPerformance.envelopeType, _self.diagLog(), properties, systemProperties);
                _self.core.track(telemetryItem);
            };
            /**
             * Send browser performance metrics.
             * @param pageViewPerformance
             * @param customProperties
             */
            _self.trackPageViewPerformance = function (pageViewPerformance, customProperties) {
                try {
                    _self._pageViewPerformanceManager.populatePageViewPerformanceEvent(pageViewPerformance);
                    _self.sendPageViewPerformanceInternal(pageViewPerformance, customProperties);
                }
                catch (e) {
                    _self.diagLog().throwInternal(LoggingSeverity.CRITICAL, _InternalMessageId.TrackPVFailed, "trackPageViewPerformance failed, page view will not be collected: " + getExceptionName(e), { exception: dumpObj(e) });
                }
            };
            /**
             * Starts the timer for tracking a page load time. Use this instead of `trackPageView` if you want to control when the page view timer starts and stops,
             * but don't want to calculate the duration yourself. This method doesn't send any telemetry. Call `stopTrackPage` to log the end of the page view
             * and send the event.
             * @param name A string that idenfities this item, unique within this HTML document. Defaults to the document title.
             */
            _self.startTrackPage = function (name) {
                try {
                    if (typeof name !== "string") {
                        var doc = getDocument();
                        name = doc && doc.title || "";
                    }
                    _pageTracking.start(name);
                }
                catch (e) {
                    _self.diagLog().throwInternal(LoggingSeverity.CRITICAL, _InternalMessageId.StartTrackFailed, "startTrackPage failed, page view may not be collected: " + getExceptionName(e), { exception: dumpObj(e) });
                }
            };
            /**
             * Stops the timer that was started by calling `startTrackPage` and sends the pageview load time telemetry with the specified properties and measurements.
             * The duration of the page view will be the time between calling `startTrackPage` and `stopTrackPage`.
             * @param   name  The string you used as the name in startTrackPage. Defaults to the document title.
             * @param   url   String - a relative or absolute URL that identifies the page or other item. Defaults to the window location.
             * @param   properties  map[string, string] - additional data used to filter pages and metrics in the portal. Defaults to empty.
             * @param   measurements    map[string, number] - metrics associated with this page, displayed in Metrics Explorer on the portal. Defaults to empty.
             */
            _self.stopTrackPage = function (name, url, properties, measurement) {
                try {
                    if (typeof name !== "string") {
                        var doc = getDocument();
                        name = doc && doc.title || "";
                    }
                    if (typeof url !== "string") {
                        var loc = getLocation();
                        url = loc && loc.href || "";
                    }
                    _pageTracking.stop(name, url, properties, measurement);
                    if (_self.config.autoTrackPageVisitTime) {
                        _self._pageVisitTimeManager.trackPreviousPageVisit(name, url);
                    }
                }
                catch (e) {
                    _self.diagLog().throwInternal(LoggingSeverity.CRITICAL, _InternalMessageId.StopTrackFailed, "stopTrackPage failed, page view will not be collected: " + getExceptionName(e), { exception: dumpObj(e) });
                }
            };
            /**
             * @ignore INTERNAL ONLY
             * @param exception
             * @param properties
             * @param systemProperties
             */
            _self.sendExceptionInternal = function (exception, customProperties, systemProperties) {
                var theError = exception.exception || exception.error || new Error(strNotSpecified);
                var exceptionPartB = new Exception(_self.diagLog(), theError, exception.properties || customProperties, exception.measurements, exception.severityLevel, exception.id).toInterface();
                var telemetryItem = TelemetryItemCreator.create(exceptionPartB, Exception.dataType, Exception.envelopeType, _self.diagLog(), customProperties, systemProperties);
                _self.core.track(telemetryItem);
            };
            /**
             * Log an exception you have caught.
             *
             * @param {IExceptionTelemetry} exception   Object which contains exception to be sent
             * @param {{[key: string]: any}} customProperties   Additional data used to filter pages and metrics in the portal. Defaults to empty.
             *
             * Any property of type double will be considered a measurement, and will be treated by Application Insights as a metric.
             * @memberof ApplicationInsights
             */
            _self.trackException = function (exception, customProperties) {
                try {
                    _self.sendExceptionInternal(exception, customProperties);
                }
                catch (e) {
                    _self.diagLog().throwInternal(LoggingSeverity.CRITICAL, _InternalMessageId.TrackExceptionFailed, "trackException failed, exception will not be collected: " + getExceptionName(e), { exception: dumpObj(e) });
                }
            };
            /**
             * @description Custom error handler for Application Insights Analytics
             * @param {IAutoExceptionTelemetry} exception
             * @memberof ApplicationInsights
             */
            _self._onerror = function (exception) {
                var error = exception && exception.error;
                var evt = exception && exception.evt;
                try {
                    if (!evt) {
                        var _window = getWindow();
                        if (_window) {
                            evt = _window[strEvent];
                        }
                    }
                    var url = (exception && exception.url) || (getDocument() || {}).URL;
                    // If no error source is provided assume the default window.onerror handler
                    var errorSrc = exception.errorSrc || "window.onerror@" + url + ":" + (exception.lineNumber || 0) + ":" + (exception.columnNumber || 0);
                    var properties = {
                        errorSrc: errorSrc,
                        url: url,
                        lineNumber: exception.lineNumber || 0,
                        columnNumber: exception.columnNumber || 0,
                        message: exception.message
                    };
                    if (isCrossOriginError(exception.message, exception.url, exception.lineNumber, exception.columnNumber, exception.error)) {
                        _sendCORSException(Exception.CreateAutoException("Script error: The browser's same-origin policy prevents us from getting the details of this exception. Consider using the 'crossorigin' attribute.", url, exception.lineNumber || 0, exception.columnNumber || 0, error, evt, null, errorSrc), properties);
                    }
                    else {
                        if (!exception.errorSrc) {
                            exception.errorSrc = errorSrc;
                        }
                        _self.trackException({ exception: exception, severityLevel: SeverityLevel.Error }, properties);
                    }
                }
                catch (e) {
                    var errorString = error ? (error.name + ", " + error.message) : "null";
                    _self.diagLog().throwInternal(LoggingSeverity.CRITICAL, _InternalMessageId.ExceptionWhileLoggingError, "_onError threw exception while logging error, error will not be collected: "
                        + getExceptionName(e), { exception: dumpObj(e), errorString: errorString });
                }
            };
            _self.addTelemetryInitializer = function (telemetryInitializer) {
                _self._telemetryInitializers.push(telemetryInitializer);
            };
            _self.initialize = function (config, core, extensions, pluginChain) {
                if (_self.isInitialized()) {
                    return;
                }
                if (isNullOrUndefined(core)) {
                    throw Error("Error initializing");
                }
                _base.initialize(config, core, extensions, pluginChain);
                _self.setInitialized(false); // resetting the initialized state, just in case the following fails
                var ctx = _self._getTelCtx();
                var identifier = _self.identifier;
                _self.config = ctx.getExtCfg(identifier);
                // load default values if specified
                var defaults = ApplicationInsights.getDefaultConfig(config);
                if (defaults !== undefined) {
                    objForEachKey(defaults, function (field, value) {
                        // for each unspecified field, set the default value
                        _self.config[field] = ctx.getConfig(identifier, field, value);
                        if (_self.config[field] === undefined) {
                            _self.config[field] = value;
                        }
                    });
                }
                // Todo: move this out of static state
                if (_self.config.isStorageUseDisabled) {
                    utlDisableStorage();
                }
                var configGetters = {
                    instrumentationKey: function () { return config.instrumentationKey; },
                    accountId: function () { return _self.config.accountId || config.accountId; },
                    sessionRenewalMs: function () { return _self.config.sessionRenewalMs || config.sessionRenewalMs; },
                    sessionExpirationMs: function () { return _self.config.sessionExpirationMs || config.sessionExpirationMs; },
                    sampleRate: function () { return _self.config.samplingPercentage || config.samplingPercentage; },
                    sdkExtension: function () { return _self.config.sdkExtension || config.sdkExtension; },
                    isBrowserLinkTrackingEnabled: function () { return _self.config.isBrowserLinkTrackingEnabled || config.isBrowserLinkTrackingEnabled; },
                    appId: function () { return _self.config.appId || config.appId; }
                };
                _self._pageViewPerformanceManager = new PageViewPerformanceManager(_self.core);
                _self._pageViewManager = new PageViewManager(_this, _self.config.overridePageViewDuration, _self.core, _self._pageViewPerformanceManager);
                _self._pageVisitTimeManager = new PageVisitTimeManager(_self.diagLog(), function (pageName, pageUrl, pageVisitTime) { return trackPageVisitTime(pageName, pageUrl, pageVisitTime); });
                _self._telemetryInitializers = _self._telemetryInitializers || [];
                _addDefaultTelemetryInitializers(configGetters);
                _eventTracking = new Timing(_self.diagLog(), "trackEvent");
                _eventTracking.action =
                    function (name, url, duration, properties) {
                        if (!properties) {
                            properties = {};
                        }
                        properties[durationProperty] = duration.toString();
                        _self.trackEvent({ name: name, properties: properties });
                    };
                // initialize page view timing
                _pageTracking = new Timing(_self.diagLog(), "trackPageView");
                _pageTracking.action = function (name, url, duration, properties, measurements) {
                    // duration must be a custom property in order for the collector to extract it
                    if (isNullOrUndefined(properties)) {
                        properties = {};
                    }
                    properties[durationProperty] = duration.toString();
                    var pageViewItem = {
                        name: name,
                        uri: url,
                        properties: properties,
                        measurements: measurements
                    };
                    _self.sendPageViewInternal(pageViewItem, properties);
                };
                var _window = getWindow();
                var _history = getHistory();
                var _location = getLocation(true);
                var instance = _this;
                if (_self.config.disableExceptionTracking === false &&
                    !_self.config.autoExceptionInstrumented && _window) {
                    // We want to enable exception auto collection and it has not been done so yet
                    var onerror_1 = "onerror";
                    var originalOnError_1 = _window[onerror_1];
                    _window.onerror = function (message, url, lineNumber, columnNumber, error) {
                        var evt = _window[strEvent];
                        var handled = originalOnError_1 && originalOnError_1(message, url, lineNumber, columnNumber, error);
                        if (handled !== true) {
                            instance._onerror(Exception.CreateAutoException(message, url, lineNumber, columnNumber, error, evt));
                        }
                        return handled;
                    };
                    _self.config.autoExceptionInstrumented = true;
                }
                if (_self.config.disableExceptionTracking === false &&
                    _self.config.enableUnhandledPromiseRejectionTracking === true &&
                    !_self.config.autoUnhandledPromiseInstrumented && _window) {
                    // We want to enable exception auto collection and it has not been done so yet
                    var onunhandledrejection = "onunhandledrejection";
                    var originalOnUnhandledRejection_1 = _window[onunhandledrejection];
                    _window[onunhandledrejection] = function (error) {
                        var evt = _window[strEvent];
                        var handled = originalOnUnhandledRejection_1 && originalOnUnhandledRejection_1.call(_window, error);
                        if (handled !== true) {
                            instance._onerror(Exception.CreateAutoException(error.reason.toString(), _location ? _location.href : "", 0, 0, error, evt));
                        }
                        return handled;
                    };
                    _self.config.autoUnhandledPromiseInstrumented = true;
                }
                /**
                 * Create a custom "locationchange" event which is triggered each time the history object is changed
                 */
                if (_self.config.enableAutoRouteTracking === true
                    && _history && isFunction(_history.pushState) && isFunction(_history.replaceState)
                    && _window
                    && typeof Event !== "undefined") {
                    var _self_1 = _this;
                    // Find the properties plugin
                    arrForEach(extensions, function (extension) {
                        if (extension.identifier === PropertiesPluginIdentifier) {
                            _properties = extension;
                        }
                    });
                    _history.pushState = (function (f) { return function pushState() {
                        var ret = f.apply(this, arguments);
                        _dispatchEvent(_window, createDomEvent(_self_1.config.namePrefix + "pushState"));
                        _dispatchEvent(_window, createDomEvent(_self_1.config.namePrefix + "locationchange"));
                        return ret;
                    }; })(_history.pushState);
                    _history.replaceState = (function (f) { return function replaceState() {
                        var ret = f.apply(this, arguments);
                        _dispatchEvent(_window, createDomEvent(_self_1.config.namePrefix + "replaceState"));
                        _dispatchEvent(_window, createDomEvent(_self_1.config.namePrefix + "locationchange"));
                        return ret;
                    }; })(_history.replaceState);
                    if (_window.addEventListener) {
                        _window.addEventListener(_self_1.config.namePrefix + "popstate", function () {
                            _dispatchEvent(_window, createDomEvent(_self_1.config.namePrefix + "locationchange"));
                        });
                        _window.addEventListener(_self_1.config.namePrefix + "locationchange", function () {
                            if (_properties && _properties.context && _properties.context.telemetryTrace) {
                                _properties.context.telemetryTrace.traceID = generateW3CId();
                                var traceLocationName = "_unknown_";
                                if (_location && _location.pathname) {
                                    traceLocationName = _location.pathname + (_location.hash || "");
                                }
                                _properties.context.telemetryTrace.name = traceLocationName;
                            }
                            if (_currUri) {
                                _prevUri = _currUri;
                                _currUri = _location && _location.href || "";
                            }
                            else {
                                _currUri = _location && _location.href || "";
                            }
                            setTimeout((function (uri) {
                                // todo: override start time so that it is not affected by autoRoutePVDelay
                                _self_1.trackPageView({ refUri: uri, properties: { duration: 0 } }); // SPA route change loading durations are undefined, so send 0
                            }).bind(_this, _prevUri), _self_1.autoRoutePVDelay);
                        });
                    }
                }
                _self.setInitialized(true);
            };
            /**
             * Log a page visit time
             * @param    pageName    Name of page
             * @param    pageVisitDuration Duration of visit to the page in milleseconds
             */
            function trackPageVisitTime(pageName, pageUrl, pageVisitTime) {
                var properties = { PageName: pageName, PageUrl: pageUrl };
                _self.trackMetric({
                    name: "PageVisitTime",
                    average: pageVisitTime,
                    max: pageVisitTime,
                    min: pageVisitTime,
                    sampleCount: 1
                }, properties);
            }
            function _addDefaultTelemetryInitializers(configGetters) {
                if (!configGetters.isBrowserLinkTrackingEnabled()) {
                    var browserLinkPaths_1 = ['/browserLinkSignalR/', '/__browserLink/'];
                    var dropBrowserLinkRequests = function (envelope) {
                        if (envelope.baseType === RemoteDependencyData.dataType) {
                            var remoteData = envelope.baseData;
                            if (remoteData) {
                                for (var i = 0; i < browserLinkPaths_1.length; i++) {
                                    if (remoteData.target && remoteData.target.indexOf(browserLinkPaths_1[i]) >= 0) {
                                        return false;
                                    }
                                }
                            }
                        }
                        return true;
                    };
                    _addTelemetryInitializer(dropBrowserLinkRequests);
                }
            }
            function _addTelemetryInitializer(telemetryInitializer) {
                _self._telemetryInitializers.push(telemetryInitializer);
            }
            function _sendCORSException(exception, properties) {
                var telemetryItem = TelemetryItemCreator.create(exception, Exception.dataType, Exception.envelopeType, _self.diagLog(), properties);
                _self.core.track(telemetryItem);
            }
        });
        return _this;
    }
    ApplicationInsights.getDefaultConfig = function (config) {
        if (!config) {
            config = {};
        }
        // set default values
        config.sessionRenewalMs = 30 * 60 * 1000;
        config.sessionExpirationMs = 24 * 60 * 60 * 1000;
        config.disableExceptionTracking = stringToBoolOrDefault(config.disableExceptionTracking);
        config.autoTrackPageVisitTime = stringToBoolOrDefault(config.autoTrackPageVisitTime);
        config.overridePageViewDuration = stringToBoolOrDefault(config.overridePageViewDuration);
        config.enableUnhandledPromiseRejectionTracking = stringToBoolOrDefault(config.enableUnhandledPromiseRejectionTracking);
        if (isNaN(config.samplingPercentage) || config.samplingPercentage <= 0 || config.samplingPercentage >= 100) {
            config.samplingPercentage = 100;
        }
        config.isStorageUseDisabled = stringToBoolOrDefault(config.isStorageUseDisabled);
        config.isBrowserLinkTrackingEnabled = stringToBoolOrDefault(config.isBrowserLinkTrackingEnabled);
        config.enableAutoRouteTracking = stringToBoolOrDefault(config.enableAutoRouteTracking);
        config.namePrefix = config.namePrefix || "";
        config.enableDebug = stringToBoolOrDefault(config.enableDebug);
        config.disableFlushOnBeforeUnload = stringToBoolOrDefault(config.disableFlushOnBeforeUnload);
        config.disableFlushOnUnload = stringToBoolOrDefault(config.disableFlushOnUnload, config.disableFlushOnBeforeUnload);
        return config;
    };
// Removed Stub for ApplicationInsights.prototype.getCookieMgr.
// Removed Stub for ApplicationInsights.prototype.processTelemetry.
// Removed Stub for ApplicationInsights.prototype.trackEvent.
// Removed Stub for ApplicationInsights.prototype.startTrackEvent.
// Removed Stub for ApplicationInsights.prototype.stopTrackEvent.
// Removed Stub for ApplicationInsights.prototype.trackTrace.
// Removed Stub for ApplicationInsights.prototype.trackMetric.
// Removed Stub for ApplicationInsights.prototype.trackPageView.
// Removed Stub for ApplicationInsights.prototype.sendPageViewInternal.
// Removed Stub for ApplicationInsights.prototype.sendPageViewPerformanceInternal.
// Removed Stub for ApplicationInsights.prototype.trackPageViewPerformance.
// Removed Stub for ApplicationInsights.prototype.startTrackPage.
// Removed Stub for ApplicationInsights.prototype.stopTrackPage.
// Removed Stub for ApplicationInsights.prototype.sendExceptionInternal.
// Removed Stub for ApplicationInsights.prototype.trackException.
// Removed Stub for ApplicationInsights.prototype._onerror.
// Removed Stub for ApplicationInsights.prototype.addTelemetryInitializer.
// Removed Stub for ApplicationInsights.prototype.initialize.
    ApplicationInsights.Version = "2.6.4"; // Not currently used anywhere
    return ApplicationInsights;
}(BaseTelemetryPlugin));
export { ApplicationInsights };
/**
 * Used to record timed events and page views.
 */
var Timing = /** @class */ (function () {
    function Timing(logger, name) {
        var _self = this;
        var _events = {};
        _self.start = function (name) {
            if (typeof _events[name] !== "undefined") {
                logger.throwInternal(LoggingSeverity.WARNING, _InternalMessageId.StartCalledMoreThanOnce, "start was called more than once for this event without calling stop.", { name: name, key: name }, true);
            }
            _events[name] = +new Date;
        };
        _self.stop = function (name, url, properties, measurements) {
            var start = _events[name];
            if (isNaN(start)) {
                logger.throwInternal(LoggingSeverity.WARNING, _InternalMessageId.StopCalledWithoutStart, "stop was called without a corresponding start.", { name: name, key: name }, true);
            }
            else {
                var end = +new Date;
                var duration = dateTimeUtilsDuration(start, end);
                _self.action(name, url, duration, properties, measurements);
            }
            delete _events[name];
            _events[name] = undefined;
        };
    }
    return Timing;
}());//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/fe719cd3e5825bf14e14182fddeb88ee8daf044f/node_modules/@microsoft/applicationinsights-analytics-js/dist-esm/JavaScriptSDK/ApplicationInsights.js.map