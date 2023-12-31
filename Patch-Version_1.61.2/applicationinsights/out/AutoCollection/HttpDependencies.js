"use strict";
var http = require("http");
var https = require("https");
var Logging = require("../Library/Logging");
var Util = require("../Library/Util");
var RequestResponseHeaders = require("../Library/RequestResponseHeaders");
var HttpDependencyParser = require("./HttpDependencyParser");
var CorrelationContextManager_1 = require("./CorrelationContextManager");
var DiagChannel = require("./diagnostic-channel/initialization");
var AutoCollectHttpDependencies = (function () {
    function AutoCollectHttpDependencies(client) {
        if (!!AutoCollectHttpDependencies.INSTANCE) {
            throw new Error("Client request tracking should be configured from the applicationInsights object");
        }
        AutoCollectHttpDependencies.INSTANCE = this;
        this._client = client;
    }
    AutoCollectHttpDependencies.prototype.enable = function (isEnabled) {
        this._isEnabled = isEnabled;
        if (this._isEnabled && !this._isInitialized) {
            this._initialize();
        }
        if (DiagChannel.IsInitialized) {
            require("./diagnostic-channel/mongodb.sub").enable(isEnabled, this._client);
            require("./diagnostic-channel/mysql.sub").enable(isEnabled, this._client);
            require("./diagnostic-channel/redis.sub").enable(isEnabled, this._client);
            require("./diagnostic-channel/postgres.sub").enable(isEnabled, this._client);
        }
    };
    AutoCollectHttpDependencies.prototype.isInitialized = function () {
        return this._isInitialized;
    };
    AutoCollectHttpDependencies.prototype._initialize = function () {
        var _this = this;
        this._isInitialized = true;
        var originalGet = http.get;
        var originalRequest = http.request;
        var originalHttpsRequest = https.request;
        var clientRequestPatch = function (request, options) {
            var shouldCollect = !options[AutoCollectHttpDependencies.disableCollectionRequestOption] &&
                !request[AutoCollectHttpDependencies.alreadyAutoCollectedFlag];
            request[AutoCollectHttpDependencies.alreadyAutoCollectedFlag] = true;
            if (request && options && shouldCollect) {
                AutoCollectHttpDependencies.trackRequest(_this._client, { options: options, request: request });
            }
        };
        // On node >= v0.11.12 and < 9.0 (excluding 8.9.0) https.request just calls http.request (with additional options).
        // On node < 0.11.12, 8.9.0, and 9.0 > https.request is handled separately
        // Patch both and leave a flag to not double-count on versions that just call through
        // We add the flag to both http and https to protect against strange double collection in other scenarios
        http.request = function (options) {
            var requestArgs = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                requestArgs[_i - 1] = arguments[_i];
            }
            var request = originalRequest.call.apply(originalRequest, [http, options].concat(requestArgs));
            clientRequestPatch(request, options);
            return request;
        };
        https.request = function (options) {
            var requestArgs = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                requestArgs[_i - 1] = arguments[_i];
            }
            var request = originalHttpsRequest.call.apply(originalHttpsRequest, [https, options].concat(requestArgs));
            clientRequestPatch(request, options);
            return request;
        };
        // Node 8 calls http.request from http.get using a local reference!
        // We have to patch .get manually in this case and can't just assume request is enough
        // We have to replace the entire method in this case. We can't call the original.
        // This is because calling the original will give us no chance to set headers as it internally does .end().
        http.get = function (options) {
            var requestArgs = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                requestArgs[_i - 1] = arguments[_i];
            }
            var request = (_a = http.request).call.apply(_a, [http, options].concat(requestArgs));
            request.end();
            return request;
            var _a;
        };
        https.get = function (options) {
            var requestArgs = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                requestArgs[_i - 1] = arguments[_i];
            }
            var request = (_a = https.request).call.apply(_a, [https, options].concat(requestArgs));
            request.end();
            return request;
            var _a;
        };
    };
    /**
     * Tracks an outgoing request. Because it may set headers this method must be called before
     * writing content to or ending the request.
     */
    AutoCollectHttpDependencies.trackRequest = function (client, telemetry) {
        if (!telemetry.options || !telemetry.request || !client) {
            Logging.info("AutoCollectHttpDependencies.trackRequest was called with invalid parameters: ", !telemetry.options, !telemetry.request, !client);
            return;
        }
        var requestParser = new HttpDependencyParser(telemetry.options, telemetry.request);
        var currentContext = CorrelationContextManager_1.CorrelationContextManager.getCurrentContext();
        var uniqueRequestId = currentContext && currentContext.operation && (currentContext.operation.parentId + AutoCollectHttpDependencies.requestNumber++ + '.');
        // Add the source correlationId to the request headers, if a value was not already provided.
        // The getHeader/setHeader methods aren't available on very old Node versions, and
        // are not included in the v0.10 type declarations currently used. So check if the
        // methods exist before invoking them.
        if (Util.canIncludeCorrelationHeader(client, requestParser.getUrl()) && telemetry.request.getHeader && telemetry.request.setHeader) {
            if (client.config && client.config.correlationId) {
                var correlationHeader = telemetry.request.getHeader(RequestResponseHeaders.requestContextHeader);
                if (correlationHeader) {
                    var components = correlationHeader.split(",");
                    var key_1 = RequestResponseHeaders.requestContextSourceKey + "=";
                    if (!components.some(function (value) { return value.substring(0, key_1.length) === key_1; })) {
                        telemetry.request.setHeader(RequestResponseHeaders.requestContextHeader, correlationHeader + "," + RequestResponseHeaders.requestContextSourceKey + "=" + client.config.correlationId);
                    }
                }
                else {
                    telemetry.request.setHeader(RequestResponseHeaders.requestContextHeader, RequestResponseHeaders.requestContextSourceKey + "=" + client.config.correlationId);
                }
            }
            if (currentContext && currentContext.operation) {
                telemetry.request.setHeader(RequestResponseHeaders.requestIdHeader, uniqueRequestId);
                // Also set legacy headers
                telemetry.request.setHeader(RequestResponseHeaders.parentIdHeader, currentContext.operation.id);
                telemetry.request.setHeader(RequestResponseHeaders.rootIdHeader, uniqueRequestId);
                var correlationContextHeader = currentContext.customProperties.serializeToHeader();
                if (correlationContextHeader) {
                    telemetry.request.setHeader(RequestResponseHeaders.correlationContextHeader, correlationContextHeader);
                }
            }
        }
        // Collect dependency telemetry about the request when it finishes.
        if (telemetry.request.on) {
            telemetry.request.on('response', function (response) {
                requestParser.onResponse(response);
                var dependencyTelemetry = requestParser.getDependencyTelemetry(telemetry, uniqueRequestId);
                dependencyTelemetry.contextObjects = dependencyTelemetry.contextObjects || {};
                dependencyTelemetry.contextObjects["http.RequestOptions"] = telemetry.options;
                dependencyTelemetry.contextObjects["http.ClientRequest"] = telemetry.request;
                dependencyTelemetry.contextObjects["http.ClientResponse"] = response;
                client.trackDependency(dependencyTelemetry);
            });
            telemetry.request.on('error', function (e) {
                requestParser.onError(e);
                var dependencyTelemetry = requestParser.getDependencyTelemetry(telemetry, uniqueRequestId);
                dependencyTelemetry.contextObjects = dependencyTelemetry.contextObjects || {};
                dependencyTelemetry.contextObjects["http.RequestOptions"] = telemetry.options;
                dependencyTelemetry.contextObjects["http.ClientRequest"] = telemetry.request;
                dependencyTelemetry.contextObjects["Error"] = e;
                client.trackDependency(dependencyTelemetry);
            });
        }
    };
    AutoCollectHttpDependencies.prototype.dispose = function () {
        AutoCollectHttpDependencies.INSTANCE = null;
        this.enable(false);
        this._isInitialized = false;
    };
    AutoCollectHttpDependencies.disableCollectionRequestOption = 'disableAppInsightsAutoCollection';
    AutoCollectHttpDependencies.requestNumber = 1;
    AutoCollectHttpDependencies.alreadyAutoCollectedFlag = '_appInsightsAutoCollected';
    return AutoCollectHttpDependencies;
}());
module.exports = AutoCollectHttpDependencies;//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/fe719cd3e5825bf14e14182fddeb88ee8daf044f/node_modules/applicationinsights/out/AutoCollection/HttpDependencies.js.map