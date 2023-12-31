/*
 * Application Insights JavaScript SDK - Core, 2.6.4
 * Copyright (c) Microsoft and contributors. All rights reserved.
 */


"use strict";
import { arrForEach, isFunction } from './HelperFuncs';
var processTelemetry = "processTelemetry";
var priority = "priority";
var setNextPlugin = "setNextPlugin";
var isInitialized = "isInitialized";
/**
 * Initialize the queue of plugins
 * @param plugins - The array of plugins to initialize and setting of the next plugin
 * @param config The current config for the instance
 * @param core THe current core instance
 * @param extensions The extensions
 */
export function initializePlugins(processContext, extensions) {
    // Set the next plugin and identified the uninitialized plugins
    var initPlugins = [];
    var lastPlugin = null;
    var proxy = processContext.getNext();
    while (proxy) {
        var thePlugin = proxy.getPlugin();
        if (thePlugin) {
            if (lastPlugin &&
                isFunction(lastPlugin[setNextPlugin]) &&
                isFunction(thePlugin[processTelemetry])) {
                // Set this plugin as the next for the previous one
                lastPlugin[setNextPlugin](thePlugin);
            }
            if (!isFunction(thePlugin[isInitialized]) || !thePlugin[isInitialized]()) {
                initPlugins.push(thePlugin);
            }
            lastPlugin = thePlugin;
            proxy = proxy.getNext();
        }
    }
    // Now initiatilize the plugins
    arrForEach(initPlugins, function (thePlugin) {
        thePlugin.initialize(processContext.getCfg(), processContext.core(), extensions, processContext.getNext());
    });
}
export function sortPlugins(plugins) {
    // Sort by priority
    return plugins.sort(function (extA, extB) {
        var result = 0;
        var bHasProcess = isFunction(extB[processTelemetry]);
        if (isFunction(extA[processTelemetry])) {
            result = bHasProcess ? extA[priority] - extB[priority] : 1;
        }
        else if (bHasProcess) {
            result = -1;
        }
        return result;
    });
    // sort complete    
}//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/fe719cd3e5825bf14e14182fddeb88ee8daf044f/node_modules/@microsoft/applicationinsights-core-js/dist-esm/JavaScriptSDK/TelemetryHelpers.js.map