/*
 * Application Insights JavaScript SDK - Core, 2.6.4
 * Copyright (c) Microsoft and contributors. All rights reserved.
 */


"use strict";
import { ProcessTelemetryContext } from './ProcessTelemetryContext';
import { isFunction, isNullOrUndefined, setValue } from "./HelperFuncs";
import { strExtensionConfig } from "./Constants";
var strGetPlugin = "getPlugin";
/**
 * BaseTelemetryPlugin provides a basic implementation of the ITelemetryPlugin interface so that plugins
 * can avoid implementation the same set of boiler plate code as well as provide a base
 * implementation so that new default implementations can be added without breaking all plugins.
 */
var BaseTelemetryPlugin = /** @class */ (function () {
    function BaseTelemetryPlugin() {
        var _self = this;
        var _isinitialized = false;
        var _rootCtx = null; // Used as the root context, holding the current config and initialized core
        var _nextPlugin = null; // Used for backward compatibility where plugins don't call the main pipeline
        _self.core = null;
        _self.diagLog = function (itemCtx) {
            return _self._getTelCtx(itemCtx).diagLog();
        };
        _self.isInitialized = function () {
            return _isinitialized;
        };
        _self.setInitialized = function (isInitialized) {
            _isinitialized = isInitialized;
        };
        // _self.getNextPlugin = () => DO NOT IMPLEMENT
        // Sub-classes of this base class *should* not be relying on this value and instead
        // should use processNext() function. If you require access to the plugin use the
        // IProcessTelemetryContext.getNext().getPlugin() while in the pipeline, Note getNext() may return null.
        _self.setNextPlugin = function (next) {
            _nextPlugin = next;
        };
        _self.processNext = function (env, itemCtx) {
            if (itemCtx) {
                // Normal core execution sequence
                itemCtx.processNext(env);
            }
            else if (_nextPlugin && isFunction(_nextPlugin.processTelemetry)) {
                // Looks like backward compatibility or out of band processing. And as it looks 
                // like a ITelemetryPlugin or ITelemetryPluginChain, just call processTelemetry
                _nextPlugin.processTelemetry(env, null);
            }
        };
        _self._getTelCtx = function (currentCtx) {
            if (currentCtx === void 0) { currentCtx = null; }
            var itemCtx = currentCtx;
            if (!itemCtx) {
                var rootCtx = _rootCtx || new ProcessTelemetryContext(null, {}, _self.core);
                // tslint:disable-next-line: prefer-conditional-expression
                if (_nextPlugin && _nextPlugin[strGetPlugin]) {
                    // Looks like a chain object
                    itemCtx = rootCtx.createNew(null, _nextPlugin[strGetPlugin]);
                }
                else {
                    itemCtx = rootCtx.createNew(null, _nextPlugin);
                }
            }
            return itemCtx;
        };
        _self._baseTelInit = function (config, core, extensions, pluginChain) {
            if (config) {
                // Make sure the extensionConfig exists
                setValue(config, strExtensionConfig, [], null, isNullOrUndefined);
            }
            if (!pluginChain && core) {
                // Get the first plugin from the core
                pluginChain = core.getProcessTelContext().getNext();
            }
            var nextPlugin = _nextPlugin;
            if (_nextPlugin && _nextPlugin[strGetPlugin]) {
                // If it looks like a proxy/chain then get the plugin
                nextPlugin = _nextPlugin[strGetPlugin]();
            }
            // Support legacy plugins where core was defined as a property
            _self.core = core;
            _rootCtx = new ProcessTelemetryContext(pluginChain, config, core, nextPlugin);
            _isinitialized = true;
        };
    }
    BaseTelemetryPlugin.prototype.initialize = function (config, core, extensions, pluginChain) {
        this._baseTelInit(config, core, extensions, pluginChain);
    };
    return BaseTelemetryPlugin;
}());
export { BaseTelemetryPlugin };//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/ee8c7def80afc00dd6e593ef12f37756d8f504ea/node_modules/@microsoft/applicationinsights-core-js/dist-esm/JavaScriptSDK/BaseTelemetryPlugin.js.map