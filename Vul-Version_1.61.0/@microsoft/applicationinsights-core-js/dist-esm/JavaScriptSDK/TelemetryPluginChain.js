/*
 * Application Insights JavaScript SDK - Core, 2.6.4
 * Copyright (c) Microsoft and contributors. All rights reserved.
 */


"use strict";
import { doPerf } from "./PerfManager";
import { LoggingSeverity, _InternalMessageId } from '../JavaScriptSDK.Enums/LoggingEnums';
import { isFunction } from './HelperFuncs';
var TelemetryPluginChain = /** @class */ (function () {
    function TelemetryPluginChain(plugin, defItemCtx) {
        var _self = this;
        var _nextProxy = null;
        var _hasProcessTelemetry = isFunction(plugin.processTelemetry);
        var _hasSetNext = isFunction(plugin.setNextPlugin);
        _self._hasRun = false;
        _self.getPlugin = function () {
            return plugin;
        };
        _self.getNext = function () {
            return _nextProxy;
        };
        _self.setNext = function (nextPlugin) {
            _nextProxy = nextPlugin;
        };
        _self.processTelemetry = function (env, itemCtx) {
            if (!itemCtx) {
                // Looks like a plugin didn't pass the (optional) context, so restore to the default
                itemCtx = defItemCtx;
            }
            var identifier = plugin ? plugin.identifier : "TelemetryPluginChain";
            doPerf(itemCtx ? itemCtx.core() : null, function () { return identifier + ":processTelemetry"; }, function () {
                if (plugin && _hasProcessTelemetry) {
                    _self._hasRun = true;
                    try {
                        // Ensure that we keep the context in sync (for processNext()), just in case a plugin
                        // doesn't calls processTelemetry() instead of itemContext.processNext() or some 
                        // other form of error occurred
                        itemCtx.setNext(_nextProxy);
                        if (_hasSetNext) {
                            // Backward compatibility setting the next plugin on the instance
                            plugin.setNextPlugin(_nextProxy);
                        }
                        // Set a flag on the next plugin so we know if it was attempted to be executed
                        _nextProxy && (_nextProxy._hasRun = false);
                        plugin.processTelemetry(env, itemCtx);
                    }
                    catch (error) {
                        var hasRun = _nextProxy && _nextProxy._hasRun;
                        if (!_nextProxy || !hasRun) {
                            // Either we have no next plugin or the current one did not attempt to call the next plugin
                            // Which means the current one is the root of the failure so log/report this failure
                            itemCtx.diagLog().throwInternal(LoggingSeverity.CRITICAL, _InternalMessageId.PluginException, "Plugin [" + plugin.identifier + "] failed during processTelemetry - " + error);
                        }
                        if (_nextProxy && !hasRun) {
                            // As part of the failure the current plugin did not attempt to call the next plugin in the cahin
                            // So rather than leave the pipeline dead in the water we call the next plugin
                            _nextProxy.processTelemetry(env, itemCtx);
                        }
                    }
                }
                else if (_nextProxy) {
                    _self._hasRun = true;
                    // The underlying plugin is either not defined or does not have a processTelemetry implementation
                    // so we still want the next plugin to be executed.
                    _nextProxy.processTelemetry(env, itemCtx);
                }
            }, function () { return ({ item: env }); }, !(env.sync));
        };
    }
    return TelemetryPluginChain;
}());
export { TelemetryPluginChain };//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/ee8c7def80afc00dd6e593ef12f37756d8f504ea/node_modules/@microsoft/applicationinsights-core-js/dist-esm/JavaScriptSDK/TelemetryPluginChain.js.map