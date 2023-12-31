"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var CorrelationContextManager = require("./AutoCollection/CorrelationContextManager"); // Keep this first
var AutoCollectConsole = require("./AutoCollection/Console");
var AutoCollectExceptions = require("./AutoCollection/Exceptions");
var AutoCollectPerformance = require("./AutoCollection/Performance");
var AutoCollectHttpDependencies = require("./AutoCollection/HttpDependencies");
var AutoCollectHttpRequests = require("./AutoCollection/HttpRequests");
var Logging = require("./Library/Logging");
// We export these imports so that SDK users may use these classes directly.
// They're exposed using "export import" so that types are passed along as expected
exports.TelemetryClient = require("./Library/NodeClient");
exports.Contracts = require("./Declarations/Contracts");
// Default autocollection configuration
var _isConsole = true;
var _isConsoleLog = false;
var _isExceptions = true;
var _isPerformance = true;
var _isRequests = true;
var _isDependencies = true;
var _isDiskRetry = true;
var _isCorrelating = true;
var _diskRetryInterval = undefined;
var _diskRetryMaxBytes = undefined;
var _console;
var _exceptions;
var _performance;
var _serverRequests;
var _clientRequests;
var _isStarted = false;
/**
 * Initializes the default client. Should be called after setting
 * configuration options.
 *
 * @param instrumentationKey the instrumentation key to use. Optional, if
 * this is not specified, the value will be read from the environment
 * variable APPINSIGHTS_INSTRUMENTATIONKEY.
 * @returns {Configuration} the configuration class to initialize
 * and start the SDK.
 */
function setup(instrumentationKey) {
    if (!exports.defaultClient) {
        exports.defaultClient = new exports.TelemetryClient(instrumentationKey);
        _console = new AutoCollectConsole(exports.defaultClient);
        _exceptions = new AutoCollectExceptions(exports.defaultClient);
        _performance = new AutoCollectPerformance(exports.defaultClient);
        _serverRequests = new AutoCollectHttpRequests(exports.defaultClient);
        _clientRequests = new AutoCollectHttpDependencies(exports.defaultClient);
    }
    else {
        Logging.info("The default client is already setup");
    }
    if (exports.defaultClient && exports.defaultClient.channel) {
        exports.defaultClient.channel.setUseDiskRetryCaching(_isDiskRetry, _diskRetryInterval, _diskRetryMaxBytes);
    }
    return Configuration;
}
exports.setup = setup;
/**
 * Starts automatic collection of telemetry. Prior to calling start no
 * telemetry will be *automatically* collected, though manual collection
 * is enabled.
 * @returns {ApplicationInsights} this class
 */
function start() {
    if (!!exports.defaultClient) {
        _isStarted = true;
        _console.enable(_isConsole, _isConsoleLog);
        _exceptions.enable(_isExceptions);
        _performance.enable(_isPerformance);
        _serverRequests.useAutoCorrelation(_isCorrelating);
        _serverRequests.enable(_isRequests);
        _clientRequests.enable(_isDependencies);
    }
    else {
        Logging.warn("Start cannot be called before setup");
    }
    return Configuration;
}
exports.start = start;
/**
 * Returns an object that is shared across all code handling a given request.
 * This can be used similarly to thread-local storage in other languages.
 * Properties set on this object will be available to telemetry processors.
 *
 * Do not store sensitive information here.
 * Custom properties set on this object can be exposed in a future SDK
 * release via outgoing HTTP headers.
 * This is to allow for correlating data cross-component.
 *
 * This method will return null if automatic dependency correlation is disabled.
 * @returns A plain object for request storage or null if automatic dependency correlation is disabled.
 */
function getCorrelationContext() {
    if (_isCorrelating) {
        return CorrelationContextManager.CorrelationContextManager.getCurrentContext();
    }
    return null;
}
exports.getCorrelationContext = getCorrelationContext;
/**
 * Returns a function that will get the same correlation context within its
 * function body as the code executing this function.
 * Use this method if automatic dependency correlation is not propagating
 * correctly to an asynchronous callback.
 */
function wrapWithCorrelationContext(fn) {
    return CorrelationContextManager.CorrelationContextManager.wrapCallback(fn);
}
exports.wrapWithCorrelationContext = wrapWithCorrelationContext;
/**
 * The active configuration for global SDK behaviors, such as autocollection.
 */
var Configuration = (function () {
    function Configuration() {
    }
    /**
     * Sets the state of console and logger tracking (enabled by default for third-party loggers only)
     * @param value if true logger activity will be sent to Application Insights
     * @param collectConsoleLog if true, logger autocollection will include console.log calls (default false)
     * @returns {Configuration} this class
     */
    Configuration.setAutoCollectConsole = function (value, collectConsoleLog) {
        if (collectConsoleLog === void 0) { collectConsoleLog = false; }
        _isConsole = value;
        _isConsoleLog = collectConsoleLog;
        if (_isStarted) {
            _console.enable(value, collectConsoleLog);
        }
        return Configuration;
    };
    /**
     * Sets the state of exception tracking (enabled by default)
     * @param value if true uncaught exceptions will be sent to Application Insights
     * @returns {Configuration} this class
     */
    Configuration.setAutoCollectExceptions = function (value) {
        _isExceptions = value;
        if (_isStarted) {
            _exceptions.enable(value);
        }
        return Configuration;
    };
    /**
     * Sets the state of performance tracking (enabled by default)
     * @param value if true performance counters will be collected every second and sent to Application Insights
     * @returns {Configuration} this class
     */
    Configuration.setAutoCollectPerformance = function (value) {
        _isPerformance = value;
        if (_isStarted) {
            _performance.enable(value);
        }
        return Configuration;
    };
    /**
     * Sets the state of request tracking (enabled by default)
     * @param value if true requests will be sent to Application Insights
     * @returns {Configuration} this class
     */
    Configuration.setAutoCollectRequests = function (value) {
        _isRequests = value;
        if (_isStarted) {
            _serverRequests.enable(value);
        }
        return Configuration;
    };
    /**
     * Sets the state of dependency tracking (enabled by default)
     * @param value if true dependencies will be sent to Application Insights
     * @returns {Configuration} this class
     */
    Configuration.setAutoCollectDependencies = function (value) {
        _isDependencies = value;
        if (_isStarted) {
            _clientRequests.enable(value);
        }
        return Configuration;
    };
    /**
     * Sets the state of automatic dependency correlation (enabled by default)
     * @param value if true dependencies will be correlated with requests
     * @returns {Configuration} this class
     */
    Configuration.setAutoDependencyCorrelation = function (value) {
        _isCorrelating = value;
        if (_isStarted) {
            _serverRequests.useAutoCorrelation(value);
        }
        return Configuration;
    };
    /**
     * Enable or disable disk-backed retry caching to cache events when client is offline (enabled by default)
     * Note that this method only applies to the default client. Disk-backed retry caching is disabled by default for additional clients.
     * For enable for additional clients, use client.channel.setUseDiskRetryCaching(true).
     * These cached events are stored in your system or user's temporary directory and access restricted to your user when possible.
     * @param value if true events that occured while client is offline will be cached on disk
     * @param resendInterval The wait interval for resending cached events.
     * @param maxBytesOnDisk The maximum size (in bytes) that the created temporary directory for cache events can grow to, before caching is disabled.
     * @returns {Configuration} this class
     */
    Configuration.setUseDiskRetryCaching = function (value, resendInterval, maxBytesOnDisk) {
        _isDiskRetry = value;
        _diskRetryInterval = resendInterval;
        _diskRetryMaxBytes = maxBytesOnDisk;
        if (exports.defaultClient && exports.defaultClient.channel) {
            exports.defaultClient.channel.setUseDiskRetryCaching(value, resendInterval, maxBytesOnDisk);
        }
        return Configuration;
    };
    /**
     * Enables debug and warning logging for AppInsights itself.
     * @param enableDebugLogging if true, enables debug logging
     * @param enableWarningLogging if true, enables warning logging
     * @returns {Configuration} this class
     */
    Configuration.setInternalLogging = function (enableDebugLogging, enableWarningLogging) {
        if (enableDebugLogging === void 0) { enableDebugLogging = false; }
        if (enableWarningLogging === void 0) { enableWarningLogging = true; }
        Logging.enableDebug = enableDebugLogging;
        Logging.disableWarnings = !enableWarningLogging;
        return Configuration;
    };
    // Convenience shortcut to ApplicationInsights.start
    Configuration.start = start;
    return Configuration;
}());
exports.Configuration = Configuration;
/**
 * Disposes the default client and all the auto collectors so they can be reinitialized with different configuration
*/
function dispose() {
    exports.defaultClient = null;
    _isStarted = false;
    if (_console) {
        _console.dispose();
    }
    if (_exceptions) {
        _exceptions.dispose();
    }
    if (_performance) {
        _performance.dispose();
    }
    if (_serverRequests) {
        _serverRequests.dispose();
    }
    if (_clientRequests) {
        _clientRequests.dispose();
    }
}
exports.dispose = dispose;//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/fe719cd3e5825bf14e14182fddeb88ee8daf044f/node_modules/applicationinsights/out/applicationinsights.js.map