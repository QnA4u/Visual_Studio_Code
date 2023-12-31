/*
 * Application Insights JavaScript SDK - Core, 2.6.4
 * Copyright (c) Microsoft and contributors. All rights reserved.
 */


"use strict";
import { safeGetLogger } from "./DiagnosticLogger";
import { TelemetryPluginChain } from "./TelemetryPluginChain";
import { arrForEach, isFunction, isNullOrUndefined, isUndefined } from "./HelperFuncs";
/**
 * Creates the instance execution chain for the plugins
 */
function _createProxyChain(plugins, itemCtx) {
    var proxies = [];
    if (plugins && plugins.length > 0) {
        // Create the proxies and wire up the next plugin chain
        var lastProxy = null;
        for (var idx = 0; idx < plugins.length; idx++) {
            var thePlugin = plugins[idx];
            if (thePlugin && isFunction(thePlugin.processTelemetry)) {
                // Only add plugins that are processors
                var newProxy = new TelemetryPluginChain(thePlugin, itemCtx);
                proxies.push(newProxy);
                if (lastProxy) {
                    // Set this new proxy as the next for the previous one
                    lastProxy.setNext(newProxy);
                }
                lastProxy = newProxy;
            }
        }
    }
    return proxies.length > 0 ? proxies[0] : null;
}
function _copyProxyChain(proxy, itemCtx, startAt) {
    var plugins = [];
    var add = startAt ? false : true;
    if (proxy) {
        while (proxy) {
            var thePlugin = proxy.getPlugin();
            if (add || thePlugin === startAt) {
                add = true;
                plugins.push(thePlugin);
            }
            proxy = proxy.getNext();
        }
    }
    if (!add) {
        plugins.push(startAt);
    }
    return _createProxyChain(plugins, itemCtx);
}
function _copyPluginChain(srcPlugins, itemCtx, startAt) {
    var plugins = srcPlugins;
    var add = false;
    if (startAt && srcPlugins) {
        plugins = [];
        arrForEach(srcPlugins, function (thePlugin) {
            if (add || thePlugin === startAt) {
                add = true;
                plugins.push(thePlugin);
            }
        });
    }
    if (startAt && !add) {
        if (!plugins) {
            plugins = [];
        }
        plugins.push(startAt);
    }
    return _createProxyChain(plugins, itemCtx);
}
var ProcessTelemetryContext = /** @class */ (function () {
    /**
     * Creates a new Telemetry Item context with the current config, core and plugin execution chain
     * @param plugins - The plugin instances that will be executed
     * @param config - The current config
     * @param core - The current core instance
     */
    function ProcessTelemetryContext(plugins, config, core, startAt) {
        var _self = this;
        var _nextProxy = null; // Null == No next plugin
        // There is no next element (null) vs not defined (undefined)
        if (startAt !== null) {
            if (plugins && isFunction(plugins.getPlugin)) {
                // We have a proxy chain object
                _nextProxy = _copyProxyChain(plugins, _self, startAt || plugins.getPlugin());
            }
            else {
                // We just have an array
                if (startAt) {
                    _nextProxy = _copyPluginChain(plugins, _self, startAt);
                }
                else if (isUndefined(startAt)) {
                    // Undefined means copy the existing chain
                    _nextProxy = _createProxyChain(plugins, _self);
                }
            }
        }
        _self.core = function () {
            return core;
        };
        _self.diagLog = function () {
            return safeGetLogger(core, config);
        };
        _self.getCfg = function () {
            return config;
        };
        _self.getExtCfg = function (identifier, defaultValue) {
            if (defaultValue === void 0) { defaultValue = {}; }
            var theConfig;
            if (config) {
                var extConfig = config.extensionConfig;
                if (extConfig && identifier) {
                    theConfig = extConfig[identifier];
                }
            }
            return (theConfig ? theConfig : defaultValue);
        };
        _self.getConfig = function (identifier, field, defaultValue) {
            if (defaultValue === void 0) { defaultValue = false; }
            var theValue;
            var extConfig = _self.getExtCfg(identifier, null);
            if (extConfig && !isNullOrUndefined(extConfig[field])) {
                theValue = extConfig[field];
            }
            else if (config && !isNullOrUndefined(config[field])) {
                theValue = config[field];
            }
            return !isNullOrUndefined(theValue) ? theValue : defaultValue;
        };
        _self.hasNext = function () {
            return _nextProxy != null;
        };
        _self.getNext = function () {
            return _nextProxy;
        };
        _self.setNext = function (nextPlugin) {
            _nextProxy = nextPlugin;
        };
        _self.processNext = function (env) {
            var nextPlugin = _nextProxy;
            if (nextPlugin) {
                // Automatically move to the next plugin
                _nextProxy = nextPlugin.getNext();
                nextPlugin.processTelemetry(env, _self);
            }
        };
        _self.createNew = function (plugins, startAt) {
            if (plugins === void 0) { plugins = null; }
            return new ProcessTelemetryContext(plugins || _nextProxy, config, core, startAt);
        };
    }
    return ProcessTelemetryContext;
}());
export { ProcessTelemetryContext };//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/fe719cd3e5825bf14e14182fddeb88ee8daf044f/node_modules/@microsoft/applicationinsights-core-js/dist-esm/JavaScriptSDK/ProcessTelemetryContext.js.map