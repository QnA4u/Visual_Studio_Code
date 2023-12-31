/*
 * Application Insights JavaScript SDK - Web, 2.6.4
 * Copyright (c) Microsoft and contributors. All rights reserved.
 */
import { stringToBoolOrDefault, ProcessLegacy } from "@microsoft/applicationinsights-common";
import { proxyAssign, throwError } from "@microsoft/applicationinsights-core-js";
// This is an exclude list of properties that should not be updated during initialization
// They include a combination of private and internal property names
var _ignoreUpdateSnippetProperties = [
    "snippet", "getDefaultConfig", "_hasLegacyInitializers", "_queue", "_processLegacyInitializers"
];
// ToDo: fix properties and measurements once updates are done to common
var AppInsightsDeprecated = /** @class */ (function () {
    function AppInsightsDeprecated(snippet, appInsightsNew) {
        this._hasLegacyInitializers = false;
        this._queue = [];
        this.config = AppInsightsDeprecated.getDefaultConfig(snippet.config);
        this.appInsightsNew = appInsightsNew;
        this.context = { addTelemetryInitializer: this.addTelemetryInitializers.bind(this) };
    }
    AppInsightsDeprecated.getDefaultConfig = function (config) {
        if (!config) {
            config = {};
        }
        // set default values
        config.endpointUrl = config.endpointUrl || "https://dc.services.visualstudio.com/v2/track";
        config.sessionRenewalMs = 30 * 60 * 1000;
        config.sessionExpirationMs = 24 * 60 * 60 * 1000;
        config.maxBatchSizeInBytes = config.maxBatchSizeInBytes > 0 ? config.maxBatchSizeInBytes : 102400; // 100kb
        config.maxBatchInterval = !isNaN(config.maxBatchInterval) ? config.maxBatchInterval : 15000;
        config.enableDebug = stringToBoolOrDefault(config.enableDebug);
        config.disableExceptionTracking = stringToBoolOrDefault(config.disableExceptionTracking);
        config.disableTelemetry = stringToBoolOrDefault(config.disableTelemetry);
        config.verboseLogging = stringToBoolOrDefault(config.verboseLogging);
        config.emitLineDelimitedJson = stringToBoolOrDefault(config.emitLineDelimitedJson);
        config.diagnosticLogInterval = config.diagnosticLogInterval || 10000;
        config.autoTrackPageVisitTime = stringToBoolOrDefault(config.autoTrackPageVisitTime);
        if (isNaN(config.samplingPercentage) || config.samplingPercentage <= 0 || config.samplingPercentage >= 100) {
            config.samplingPercentage = 100;
        }
        config.disableAjaxTracking = stringToBoolOrDefault(config.disableAjaxTracking);
        config.maxAjaxCallsPerView = !isNaN(config.maxAjaxCallsPerView) ? config.maxAjaxCallsPerView : 500;
        config.isBeaconApiDisabled = stringToBoolOrDefault(config.isBeaconApiDisabled, true);
        config.disableCorrelationHeaders = stringToBoolOrDefault(config.disableCorrelationHeaders);
        config.correlationHeaderExcludedDomains = config.correlationHeaderExcludedDomains || [
            "*.blob.core.windows.net",
            "*.blob.core.chinacloudapi.cn",
            "*.blob.core.cloudapi.de",
            "*.blob.core.usgovcloudapi.net"
        ];
        config.disableFlushOnBeforeUnload = stringToBoolOrDefault(config.disableFlushOnBeforeUnload);
        config.disableFlushOnUnload = stringToBoolOrDefault(config.disableFlushOnUnload, config.disableFlushOnBeforeUnload);
        config.enableSessionStorageBuffer = stringToBoolOrDefault(config.enableSessionStorageBuffer, true);
        config.isRetryDisabled = stringToBoolOrDefault(config.isRetryDisabled);
        config.isCookieUseDisabled = stringToBoolOrDefault(config.isCookieUseDisabled);
        config.isStorageUseDisabled = stringToBoolOrDefault(config.isStorageUseDisabled);
        config.isBrowserLinkTrackingEnabled = stringToBoolOrDefault(config.isBrowserLinkTrackingEnabled);
        config.enableCorsCorrelation = stringToBoolOrDefault(config.enableCorsCorrelation);
        return config;
    };
    /**
     * The array of telemetry initializers to call before sending each telemetry item.
     */
    AppInsightsDeprecated.prototype.addTelemetryInitializers = function (callBack) {
        var _this = this;
        // Add initializer to current processing only if there is any old telemetry initializer
        if (!this._hasLegacyInitializers) {
            this.appInsightsNew.addTelemetryInitializer(function (item) {
                _this._processLegacyInitializers(item); // setup call back for each legacy processor
            });
            this._hasLegacyInitializers = true;
        }
        this._queue.push(callBack);
    };
    /**
     * Get the current cookie manager for this instance
     */
    AppInsightsDeprecated.prototype.getCookieMgr = function () {
        return this.appInsightsNew.getCookieMgr();
    };
    AppInsightsDeprecated.prototype.startTrackPage = function (name) {
        this.appInsightsNew.startTrackPage(name);
    };
    AppInsightsDeprecated.prototype.stopTrackPage = function (name, url, properties, measurements) {
        this.appInsightsNew.stopTrackPage(name, url, properties); // update
    };
    AppInsightsDeprecated.prototype.trackPageView = function (name, url, properties, measurements, duration) {
        var telemetry = {
            name: name,
            uri: url,
            properties: properties,
            measurements: measurements
        };
        // fix for props, measurements, duration
        this.appInsightsNew.trackPageView(telemetry);
    };
    AppInsightsDeprecated.prototype.trackEvent = function (name, properties, measurements) {
        this.appInsightsNew.trackEvent({ name: name });
    };
    AppInsightsDeprecated.prototype.trackDependency = function (id, method, absoluteUrl, pathName, totalTime, success, resultCode) {
        this.appInsightsNew.trackDependencyData({
            id: id,
            target: absoluteUrl,
            type: pathName,
            duration: totalTime,
            properties: { HttpMethod: method },
            success: success,
            responseCode: resultCode
        });
    };
    AppInsightsDeprecated.prototype.trackException = function (exception, handledAt, properties, measurements, severityLevel) {
        this.appInsightsNew.trackException({
            exception: exception
        });
    };
    AppInsightsDeprecated.prototype.trackMetric = function (name, average, sampleCount, min, max, properties) {
        this.appInsightsNew.trackMetric({ name: name, average: average, sampleCount: sampleCount, min: min, max: max });
    };
    AppInsightsDeprecated.prototype.trackTrace = function (message, properties, severityLevel) {
        this.appInsightsNew.trackTrace({ message: message, severityLevel: severityLevel });
    };
    AppInsightsDeprecated.prototype.flush = function (async) {
        this.appInsightsNew.flush(async);
    };
    AppInsightsDeprecated.prototype.setAuthenticatedUserContext = function (authenticatedUserId, accountId, storeInCookie) {
        this.appInsightsNew.context.user.setAuthenticatedUserContext(authenticatedUserId, accountId, storeInCookie);
    };
    AppInsightsDeprecated.prototype.clearAuthenticatedUserContext = function () {
        this.appInsightsNew.context.user.clearAuthenticatedUserContext();
    };
    AppInsightsDeprecated.prototype._onerror = function (message, url, lineNumber, columnNumber, error) {
        this.appInsightsNew._onerror({ message: message, url: url, lineNumber: lineNumber, columnNumber: columnNumber, error: error });
    };
    AppInsightsDeprecated.prototype.startTrackEvent = function (name) {
        this.appInsightsNew.startTrackEvent(name);
    };
    AppInsightsDeprecated.prototype.stopTrackEvent = function (name, properties, measurements) {
        this.appInsightsNew.stopTrackEvent(name, properties, measurements);
    };
    AppInsightsDeprecated.prototype.downloadAndSetup = function (config) {
        throwError("downloadAndSetup not implemented in web SKU");
    };
    AppInsightsDeprecated.prototype.updateSnippetDefinitions = function (snippet) {
        // apply full appInsights to the global instance
        // Note: This must be called before loadAppInsights is called
        proxyAssign(snippet, this, function (name) {
            // Not excluding names prefixed with "_" as we need to proxy some functions like _onError
            return name && _ignoreUpdateSnippetProperties.indexOf(name) === -1;
        });
    };
    // note: these are split into methods to enable unit tests
    AppInsightsDeprecated.prototype.loadAppInsights = function () {
        // initialize global instance of appInsights
        // var appInsights = new Microsoft.ApplicationInsights.AppInsights(this.config);
        var _this = this;
        // implement legacy version of trackPageView for 0.10<
        if (this.config["iKey"]) {
            var originalTrackPageView_1 = this.trackPageView;
            this.trackPageView = function (pagePath, properties, measurements) {
                originalTrackPageView_1.apply(_this, [null, pagePath, properties, measurements]);
            };
        }
        // implement legacy pageView interface if it is present in the snippet
        var legacyPageView = "logPageView";
        if (typeof this.snippet[legacyPageView] === "function") {
            this[legacyPageView] = function (pagePath, properties, measurements) {
                _this.trackPageView(null, pagePath, properties, measurements);
            };
        }
        // implement legacy event interface if it is present in the snippet
        var legacyEvent = "logEvent";
        if (typeof this.snippet[legacyEvent] === "function") {
            this[legacyEvent] = function (name, props, measurements) {
                _this.trackEvent(name, props, measurements);
            };
        }
        return this;
    };
    AppInsightsDeprecated.prototype._processLegacyInitializers = function (item) {
        // instead of mapping new to legacy and then back again and repeating in channel, attach callback for channel to call
        item.tags[ProcessLegacy] = this._queue;
        return item;
    };
    return AppInsightsDeprecated;
}());
export { AppInsightsDeprecated };//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/ee8c7def80afc00dd6e593ef12f37756d8f504ea/node_modules/@microsoft/applicationinsights-web/dist-esm/ApplicationInsightsDeprecated.js.map