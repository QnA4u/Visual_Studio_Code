/*
 * Application Insights JavaScript SDK - Web, 2.6.4
 * Copyright (c) Microsoft and contributors. All rights reserved.
 */


import { AppInsightsCore, LoggingSeverity, _InternalMessageId, hasWindow, hasDocument, isReactNative, doPerf, objForEachKey, proxyAssign, arrForEach, isString, isFunction, isNullOrUndefined, addEventHandler, isArray, throwError } from "@microsoft/applicationinsights-core-js";
import { ApplicationInsights } from "@microsoft/applicationinsights-analytics-js";
import { Sender } from "@microsoft/applicationinsights-channel-js";
import { PropertiesPlugin } from "@microsoft/applicationinsights-properties-js";
import { AjaxPlugin as DependenciesPlugin } from '@microsoft/applicationinsights-dependencies-js';
import { Util, CorrelationIdHelper, UrlHelper, DateTimeUtils, ConnectionStringParser, RequestHeaders, DisabledPropertyName, ProcessLegacy, SampleRate, HttpMethod, DEFAULT_BREEZE_ENDPOINT, AIData, AIBase, Envelope, Event, Exception, Metric, PageView, PageViewData, RemoteDependencyData, Trace, PageViewPerformance, Data, SeverityLevel, ConfigurationManager, ContextTagKeys, DataSanitizer, TelemetryItemCreator, CtxTagKeys, Extensions, DistributedTracingModes, PropertiesPluginIdentifier, BreezeChannelIdentifier, AnalyticsPluginIdentifier, parseConnectionString } from "@microsoft/applicationinsights-common";
"use strict";
var _internalSdkSrc;
// This is an exclude list of properties that should not be updated during initialization
// They include a combination of private and internal property names
var _ignoreUpdateSnippetProperties = [
    "snippet", "dependencies", "properties", "_snippetVersion", "appInsightsNew", "getSKUDefaults",
];
;
// Re-exposing the Common classes as Telemetry, the list was taken by reviewing the generated code for the build while using
// the previous configuration :-
// import * as Common from "@microsoft/applicationinsights-common"
// export const Telemetry = Common;
var fieldType = {
    Default: 0 /* Default */,
    Required: 1 /* Required */,
    Array: 2 /* Array */,
    Hidden: 4 /* Hidden */
};
/**
 * Telemetry type classes, e.g. PageView, Exception, etc
 */
export var Telemetry = {
    __proto__: null,
    PropertiesPluginIdentifier: PropertiesPluginIdentifier,
    BreezeChannelIdentifier: BreezeChannelIdentifier,
    AnalyticsPluginIdentifier: AnalyticsPluginIdentifier,
    Util: Util,
    CorrelationIdHelper: CorrelationIdHelper,
    UrlHelper: UrlHelper,
    DateTimeUtils: DateTimeUtils,
    ConnectionStringParser: ConnectionStringParser,
    FieldType: fieldType,
    RequestHeaders: RequestHeaders,
    DisabledPropertyName: DisabledPropertyName,
    ProcessLegacy: ProcessLegacy,
    SampleRate: SampleRate,
    HttpMethod: HttpMethod,
    DEFAULT_BREEZE_ENDPOINT: DEFAULT_BREEZE_ENDPOINT,
    AIData: AIData,
    AIBase: AIBase,
    Envelope: Envelope,
    Event: Event,
    Exception: Exception,
    Metric: Metric,
    PageView: PageView,
    PageViewData: PageViewData,
    RemoteDependencyData: RemoteDependencyData,
    Trace: Trace,
    PageViewPerformance: PageViewPerformance,
    Data: Data,
    SeverityLevel: SeverityLevel,
    ConfigurationManager: ConfigurationManager,
    ContextTagKeys: ContextTagKeys,
    DataSanitizer: DataSanitizer,
    TelemetryItemCreator: TelemetryItemCreator,
    CtxTagKeys: CtxTagKeys,
    Extensions: Extensions,
    DistributedTracingModes: DistributedTracingModes
};
/**
 * Application Insights API
 * @class Initialization
 * @implements {IApplicationInsights}
 */
var Initialization = /** @class */ (function () {
    function Initialization(snippet) {
        var _self = this;
        // initialize the queue and config in case they are undefined
        _self._snippetVersion = "" + (snippet.sv || snippet.version || "");
        snippet.queue = snippet.queue || [];
        snippet.version = snippet.version || 2.0; // Default to new version
        var config = snippet.config || {};
        if (config.connectionString) {
            var cs = parseConnectionString(config.connectionString);
            var ingest = cs.ingestionendpoint;
            config.endpointUrl = ingest ? ingest + "/v2/track" : config.endpointUrl; // only add /v2/track when from connectionstring
            config.instrumentationKey = cs.instrumentationkey || config.instrumentationKey;
        }
        _self.appInsights = new ApplicationInsights();
        _self.properties = new PropertiesPlugin();
        _self.dependencies = new DependenciesPlugin();
        _self.core = new AppInsightsCore();
        _self._sender = new Sender();
        _self.snippet = snippet;
        _self.config = config;
        _self.getSKUDefaults();
    }
    // Analytics Plugin
    /**
     * Get the current cookie manager for this instance
     */
    Initialization.prototype.getCookieMgr = function () {
        return this.appInsights.getCookieMgr();
    };
    ;
    /**
     * Log a user action or other occurrence.
     * @param {IEventTelemetry} event
     * @param {ICustomProperties} [customProperties]
     * @memberof Initialization
     */
    Initialization.prototype.trackEvent = function (event, customProperties) {
        this.appInsights.trackEvent(event, customProperties);
    };
    /**
     * Logs that a page, or similar container was displayed to the user.
     * @param {IPageViewTelemetry} pageView
     * @memberof Initialization
     */
    Initialization.prototype.trackPageView = function (pageView) {
        var inPv = pageView || {};
        this.appInsights.trackPageView(inPv);
    };
    /**
     * Log a bag of performance information via the customProperties field.
     * @param {IPageViewPerformanceTelemetry} pageViewPerformance
     * @memberof Initialization
     */
    Initialization.prototype.trackPageViewPerformance = function (pageViewPerformance) {
        var inPvp = pageViewPerformance || {};
        this.appInsights.trackPageViewPerformance(inPvp);
    };
    /**
     * Log an exception that you have caught.
     * @param {IExceptionTelemetry} exception
     * @memberof Initialization
     */
    Initialization.prototype.trackException = function (exception) {
        if (exception && !exception.exception && exception.error) {
            exception.exception = exception.error;
        }
        this.appInsights.trackException(exception);
    };
    /**
     * Manually send uncaught exception telemetry. This method is automatically triggered
     * on a window.onerror event.
     * @param {IAutoExceptionTelemetry} exception
     * @memberof Initialization
     */
    Initialization.prototype._onerror = function (exception) {
        this.appInsights._onerror(exception);
    };
    /**
     * Log a diagnostic scenario such entering or leaving a function.
     * @param {ITraceTelemetry} trace
     * @param {ICustomProperties} [customProperties]
     * @memberof Initialization
     */
    Initialization.prototype.trackTrace = function (trace, customProperties) {
        this.appInsights.trackTrace(trace, customProperties);
    };
    /**
     * Log a numeric value that is not associated with a specific event. Typically used
     * to send regular reports of performance indicators.
     *
     * To send a single measurement, just use the `name` and `average` fields
     * of {@link IMetricTelemetry}.
     *
     * If you take measurements frequently, you can reduce the telemetry bandwidth by
     * aggregating multiple measurements and sending the resulting average and modifying
     * the `sampleCount` field of {@link IMetricTelemetry}.
     * @param {IMetricTelemetry} metric input object argument. Only `name` and `average` are mandatory.
     * @param {ICustomProperties} [customProperties]
     * @memberof Initialization
     */
    Initialization.prototype.trackMetric = function (metric, customProperties) {
        this.appInsights.trackMetric(metric, customProperties);
    };
    /**
     * Starts the timer for tracking a page load time. Use this instead of `trackPageView` if you want to control when the page view timer starts and stops,
     * but don't want to calculate the duration yourself. This method doesn't send any telemetry. Call `stopTrackPage` to log the end of the page view
     * and send the event.
     * @param name A string that idenfities this item, unique within this HTML document. Defaults to the document title.
     */
    Initialization.prototype.startTrackPage = function (name) {
        this.appInsights.startTrackPage(name);
    };
    /**
     * Stops the timer that was started by calling `startTrackPage` and sends the pageview load time telemetry with the specified properties and measurements.
     * The duration of the page view will be the time between calling `startTrackPage` and `stopTrackPage`.
     * @param   name  The string you used as the name in startTrackPage. Defaults to the document title.
     * @param   url   String - a relative or absolute URL that identifies the page or other item. Defaults to the window location.
     * @param   properties  map[string, string] - additional data used to filter pages and metrics in the portal. Defaults to empty.
     * @param   measurements    map[string, number] - metrics associated with this page, displayed in Metrics Explorer on the portal. Defaults to empty.
     */
    Initialization.prototype.stopTrackPage = function (name, url, customProperties, measurements) {
        this.appInsights.stopTrackPage(name, url, customProperties, measurements);
    };
    Initialization.prototype.startTrackEvent = function (name) {
        this.appInsights.startTrackEvent(name);
    };
    /**
     * Log an extended event that you started timing with `startTrackEvent`.
     * @param   name    The string you used to identify this event in `startTrackEvent`.
     * @param   properties  map[string, string] - additional data used to filter events and metrics in the portal. Defaults to empty.
     * @param   measurements    map[string, number] - metrics associated with this event, displayed in Metrics Explorer on the portal. Defaults to empty.
     */
    Initialization.prototype.stopTrackEvent = function (name, properties, measurements) {
        this.appInsights.stopTrackEvent(name, properties, measurements); // Todo: Fix to pass measurements once type is updated
    };
    Initialization.prototype.addTelemetryInitializer = function (telemetryInitializer) {
        return this.appInsights.addTelemetryInitializer(telemetryInitializer);
    };
    // Properties Plugin
    /**
     * Set the authenticated user id and the account id. Used for identifying a specific signed-in user. Parameters must not contain whitespace or ,;=|
     *
     * The method will only set the `authenticatedUserId` and `accountId` in the current page view. To set them for the whole session, you should set `storeInCookie = true`
     * @param {string} authenticatedUserId
     * @param {string} [accountId]
     * @param {boolean} [storeInCookie=false]
     * @memberof Initialization
     */
    Initialization.prototype.setAuthenticatedUserContext = function (authenticatedUserId, accountId, storeInCookie) {
        if (storeInCookie === void 0) { storeInCookie = false; }
        this.properties.context.user.setAuthenticatedUserContext(authenticatedUserId, accountId, storeInCookie);
    };
    /**
     * Clears the authenticated user id and account id. The associated cookie is cleared, if present.
     * @memberof Initialization
     */
    Initialization.prototype.clearAuthenticatedUserContext = function () {
        this.properties.context.user.clearAuthenticatedUserContext();
    };
    // Dependencies Plugin
    /**
     * Log a dependency call (e.g. ajax)
     * @param {IDependencyTelemetry} dependency
     * @memberof Initialization
     */
    Initialization.prototype.trackDependencyData = function (dependency) {
        this.dependencies.trackDependencyData(dependency);
    };
    // Misc
    /**
     * Manually trigger an immediate send of all telemetry still in the buffer.
     * @param {boolean} [async=true]
     * @memberof Initialization
     */
    Initialization.prototype.flush = function (async) {
        var _this = this;
        if (async === void 0) { async = true; }
        doPerf(this.core, function () { return "AISKU.flush"; }, function () {
            arrForEach(_this.core.getTransmissionControls(), function (channels) {
                arrForEach(channels, function (channel) {
                    channel.flush(async);
                });
            });
        }, null, async);
    };
    /**
     * Manually trigger an immediate send of all telemetry still in the buffer using beacon Sender.
     * Fall back to xhr sender if beacon is not supported.
     * @param {boolean} [async=true]
     * @memberof Initialization
     */
    Initialization.prototype.onunloadFlush = function (async) {
        if (async === void 0) { async = true; }
        arrForEach(this.core.getTransmissionControls(), function (channels) {
            arrForEach(channels, function (channel) {
                if (channel.onunloadFlush) {
                    channel.onunloadFlush();
                }
                else {
                    channel.flush(async);
                }
            });
        });
    };
    /**
     * Initialize this instance of ApplicationInsights
     * @returns {IApplicationInsights}
     * @memberof Initialization
     */
    Initialization.prototype.loadAppInsights = function (legacyMode, logger, notificationManager) {
        var _this = this;
        if (legacyMode === void 0) { legacyMode = false; }
        var _self = this;
        function _updateSnippetProperties(snippet) {
            if (snippet) {
                var snippetVer = "";
                if (!isNullOrUndefined(_self._snippetVersion)) {
                    snippetVer += _self._snippetVersion;
                }
                if (legacyMode) {
                    snippetVer += ".lg";
                }
                if (_self.context && _self.context.internal) {
                    _self.context.internal.snippetVer = snippetVer || "-";
                }
                // apply updated properties to the global instance (snippet)
                objForEachKey(_self, function (field, value) {
                    if (isString(field) &&
                        !isFunction(value) &&
                        field && field[0] !== "_" && // Don't copy "internal" values
                        _ignoreUpdateSnippetProperties.indexOf(field) === -1) {
                        snippet[field] = value;
                    }
                });
            }
        }
        // dont allow additional channels/other extensions for legacy mode; legacy mode is only to allow users to switch with no code changes!
        if (legacyMode && _self.config.extensions && _self.config.extensions.length > 0) {
            throwError("Extensions not allowed in legacy mode");
        }
        doPerf(_self.core, function () { return "AISKU.loadAppInsights"; }, function () {
            var extensions = [];
            extensions.push(_self._sender);
            extensions.push(_self.properties);
            extensions.push(_self.dependencies);
            extensions.push(_self.appInsights);
            // initialize core
            _self.core.initialize(_self.config, extensions, logger, notificationManager);
            _self.context = _self.properties.context;
            if (_internalSdkSrc && _self.context) {
                _self.context.internal.sdkSrc = _internalSdkSrc;
            }
            _updateSnippetProperties(_self.snippet);
            // Empty queue of all api calls logged prior to sdk download
            _self.emptyQueue();
            _self.pollInternalLogs();
            _self.addHousekeepingBeforeUnload(_this);
        });
        return _self;
    };
    /**
     * Overwrite the lazy loaded fields of global window snippet to contain the
     * actual initialized API methods
     * @param {Snippet} snippet
     * @memberof Initialization
     */
    Initialization.prototype.updateSnippetDefinitions = function (snippet) {
        // apply full appInsights to the global instance
        // Note: This must be called before loadAppInsights is called
        proxyAssign(snippet, this, function (name) {
            // Not excluding names prefixed with "_" as we need to proxy some functions like _onError
            return name && _ignoreUpdateSnippetProperties.indexOf(name) === -1;
        });
    };
    /**
     * Call any functions that were queued before the main script was loaded
     * @memberof Initialization
     */
    Initialization.prototype.emptyQueue = function () {
        var _self = this;
        // call functions that were queued before the main script was loaded
        try {
            if (isArray(_self.snippet.queue)) {
                // note: do not check length in the for-loop conditional in case something goes wrong and the stub methods are not overridden.
                var length_1 = _self.snippet.queue.length;
                for (var i = 0; i < length_1; i++) {
                    var call = _self.snippet.queue[i];
                    call();
                }
                _self.snippet.queue = undefined;
                delete _self.snippet.queue;
            }
        }
        catch (exception) {
            var properties = {};
            if (exception && isFunction(exception.toString)) {
                properties.exception = exception.toString();
            }
            // need from core
            // Microsoft.ApplicationInsights._InternalLogging.throwInternal(
            //     LoggingSeverity.WARNING,
            //     _InternalMessageId.FailedToSendQueuedTelemetry,
            //     "Failed to send queued telemetry",
            //     properties);
        }
    };
    Initialization.prototype.pollInternalLogs = function () {
        this.core.pollInternalLogs();
    };
    Initialization.prototype.addHousekeepingBeforeUnload = function (appInsightsInstance) {
        // Add callback to push events when the user navigates away
        if (hasWindow() || hasDocument()) {
            var performHousekeeping = function () {
                // Adds the ability to flush all data before the page unloads.
                // Note: This approach tries to push a sync request with all the pending events onbeforeunload.
                // Firefox does not respect this.Other browsers DO push out the call with < 100% hit rate.
                // Telemetry here will help us analyze how effective this approach is.
                // Another approach would be to make this call sync with a acceptable timeout to reduce the
                // impact on user experience.
                // appInsightsInstance.context._sender.triggerSend();
                appInsightsInstance.onunloadFlush(false);
                // Back up the current session to local storage
                // This lets us close expired sessions after the cookies themselves expire
                arrForEach(appInsightsInstance.appInsights.core['_extensions'], function (ext) {
                    if (ext.identifier === PropertiesPluginIdentifier) {
                        if (ext && ext.context && ext.context._sessionManager) {
                            ext.context._sessionManager.backup();
                        }
                        return -1;
                    }
                });
            };
            if (!appInsightsInstance.appInsights.config.disableFlushOnBeforeUnload) {
                // Hook the unload event for the document, window and body to ensure that the client events are flushed to the server
                // As just hooking the window does not always fire (on chrome) for page navigations.
                var added = addEventHandler('beforeunload', performHousekeeping);
                added = addEventHandler('unload', performHousekeeping) || added;
                added = addEventHandler('pagehide', performHousekeeping) || added;
                added = addEventHandler('visibilitychange', performHousekeeping) || added;
                // A reactNative app may not have a window and therefore the beforeunload/pagehide events -- so don't
                // log the failure in this case
                if (!added && !isReactNative()) {
                    appInsightsInstance.appInsights.core.logger.throwInternal(LoggingSeverity.CRITICAL, _InternalMessageId.FailedToAddHandlerForOnBeforeUnload, 'Could not add handler for beforeunload and pagehide');
                }
            }
            // We also need to hook the pagehide and visibilitychange events as not all versions of Safari support load/unload events.
            if (!appInsightsInstance.appInsights.config.disableFlushOnUnload) {
                // Not adding any telemetry as pagehide as it's not supported on all browsers
                addEventHandler('pagehide', performHousekeeping);
                addEventHandler('visibilitychange', performHousekeeping);
            }
        }
    };
    Initialization.prototype.getSender = function () {
        return this._sender;
    };
    Initialization.prototype.getSKUDefaults = function () {
        var _self = this;
        _self.config.diagnosticLogInterval =
            _self.config.diagnosticLogInterval && _self.config.diagnosticLogInterval > 0 ? _self.config.diagnosticLogInterval : 10000;
    };
    return Initialization;
}());
export { Initialization };
// tslint:disable-next-line
(function () {
    var sdkSrc = null;
    var isModule = false;
    var cdns = [
        "://js.monitor.azure.com/",
        "://az416426.vo.msecnd.net/"
    ];
    try {
        // Try and determine whether the sdk is being loaded from the CDN
        // currentScript is only valid during initial processing
        var scrpt = (document || {}).currentScript;
        if (scrpt) {
            sdkSrc = scrpt.src;
            // } else {
            //     // We need to update to at least typescript 2.9 for this to work :-(
            //     // Leaving as a stub for now so after we upgrade this breadcrumb is available
            //     let meta = import.meta;
            //     sdkSrc = (meta || {}).url;
            //     isModule = true;
        }
    }
    catch (e) {
        // eslint-disable-next-line no-empty
    }
    if (sdkSrc) {
        try {
            var url = sdkSrc.toLowerCase();
            if (url) {
                var src = "";
                for (var idx = 0; idx < cdns.length; idx++) {
                    if (url.indexOf(cdns[idx]) !== -1) {
                        src = "cdn" + (idx + 1);
                        if (url.indexOf("/scripts/") === -1) {
                            if (url.indexOf("/next/") !== -1) {
                                src += "-next";
                            }
                            else if (url.indexOf("/beta/") !== -1) {
                                src += "-beta";
                            }
                        }
                        _internalSdkSrc = src + (isModule ? ".mod" : "");
                        break;
                    }
                }
            }
        }
        catch (e) {
            // eslint-disable-next-line no-empty
        }
    }
})();//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/fe719cd3e5825bf14e14182fddeb88ee8daf044f/node_modules/@microsoft/applicationinsights-web/dist-esm/Initialization.js.map