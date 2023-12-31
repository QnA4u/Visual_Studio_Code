/*
 * Application Insights JavaScript SDK - Core, 2.6.4
 * Copyright (c) Microsoft and contributors. All rights reserved.
 */


"use strict";
import { objCreateFn } from "@microsoft/applicationinsights-shims";
import dynamicProto from '@microsoft/dynamicproto-js';
import { ChannelController } from './ChannelController';
import { ProcessTelemetryContext } from './ProcessTelemetryContext';
import { initializePlugins, sortPlugins } from './TelemetryHelpers';
import { PerfManager } from "./PerfManager";
import { createCookieMgr } from "./CookieMgr";
import { arrForEach, isNullOrUndefined, toISOString, getSetValue, setValue, throwError, isNotTruthy } from "./HelperFuncs";
import { strExtensionConfig, strIKey } from "./Constants";
var validationError = "Extensions must provide callback to initialize";
var strNotificationManager = "_notificationManager";
var BaseCore = /** @class */ (function () {
    function BaseCore() {
        var _isInitialized = false;
        var _eventQueue;
        var _channelController;
        var _notificationManager;
        var _perfManager;
        var _cookieManager;
        dynamicProto(BaseCore, this, function (_self) {
            _self._extensions = new Array();
            _channelController = new ChannelController();
            _self.logger = objCreateFn({
                throwInternal: function (severity, msgId, msg, properties, isUserAct) {
                    if (isUserAct === void 0) { isUserAct = false; }
                },
                warnToConsole: function (message) { },
                resetInternalMessageCount: function () { }
            });
            _eventQueue = [];
            _self.isInitialized = function () { return _isInitialized; };
            _self.initialize = function (config, extensions, logger, notificationManager) {
                // Make sure core is only initialized once
                if (_self.isInitialized()) {
                    throwError("Core should not be initialized more than once");
                }
                if (!config || isNullOrUndefined(config.instrumentationKey)) {
                    throwError("Please provide instrumentation key");
                }
                _notificationManager = notificationManager;
                // For backward compatibility only
                _self[strNotificationManager] = notificationManager;
                _self.config = config || {};
                config.extensions = isNullOrUndefined(config.extensions) ? [] : config.extensions;
                // add notification to the extensions in the config so other plugins can access it
                var extConfig = getSetValue(config, strExtensionConfig);
                extConfig.NotificationManager = notificationManager;
                if (logger) {
                    _self.logger = logger;
                }
                // Concat all available extensions
                var allExtensions = [];
                allExtensions.push.apply(allExtensions, extensions.concat(config.extensions));
                allExtensions = sortPlugins(allExtensions);
                var coreExtensions = [];
                var channelExtensions = [];
                // Check if any two extensions have the same priority, then warn to console
                // And extract the local extensions from the 
                var extPriorities = {};
                // Extension validation
                arrForEach(allExtensions, function (ext) {
                    if (isNullOrUndefined(ext) || isNullOrUndefined(ext.initialize)) {
                        throwError(validationError);
                    }
                    var extPriority = ext.priority;
                    var identifier = ext.identifier;
                    if (ext && extPriority) {
                        if (!isNullOrUndefined(extPriorities[extPriority])) {
                            logger.warnToConsole("Two extensions have same priority #" + extPriority + " - " + extPriorities[extPriority] + ", " + identifier);
                        }
                        else {
                            // set a value
                            extPriorities[extPriority] = identifier;
                        }
                    }
                    // Split extensions to core and channelController
                    if (!extPriority || extPriority < _channelController.priority) {
                        // Add to core extension that will be managed by BaseCore
                        coreExtensions.push(ext);
                    }
                    else {
                        // Add all other extensions to be managed by the channel controller
                        channelExtensions.push(ext);
                    }
                });
                // Validation complete
                // Add the channelController to the complete extension collection and
                // to the end of the core extensions
                allExtensions.push(_channelController);
                coreExtensions.push(_channelController);
                // Sort the complete set of extensions by priority
                allExtensions = sortPlugins(allExtensions);
                _self._extensions = allExtensions;
                // initialize channel controller first, this will initialize all channel plugins
                initializePlugins(new ProcessTelemetryContext([_channelController], config, _self), allExtensions);
                initializePlugins(new ProcessTelemetryContext(coreExtensions, config, _self), allExtensions);
                // Now reset the extensions to just those being managed by Basecore
                _self._extensions = coreExtensions;
                if (_self.getTransmissionControls().length === 0) {
                    throwError("No channels available");
                }
                _isInitialized = true;
                _self.releaseQueue();
            };
            _self.getTransmissionControls = function () {
                return _channelController.getChannelControls();
            };
            _self.track = function (telemetryItem) {
                // setup default iKey if not passed in
                setValue(telemetryItem, strIKey, _self.config.instrumentationKey, null, isNotTruthy);
                // add default timestamp if not passed in
                setValue(telemetryItem, "time", toISOString(new Date()), null, isNotTruthy);
                // Common Schema 4.0
                setValue(telemetryItem, "ver", "4.0", null, isNullOrUndefined);
                if (_self.isInitialized()) {
                    // Process the telemetry plugin chain
                    _self.getProcessTelContext().processNext(telemetryItem);
                }
                else {
                    // Queue events until all extensions are initialized
                    _eventQueue.push(telemetryItem);
                }
            };
            _self.getProcessTelContext = function () {
                var extensions = _self._extensions;
                var thePlugins = extensions;
                // invoke any common telemetry processors before sending through pipeline
                if (!extensions || extensions.length === 0) {
                    // Pass to Channel controller so data is sent to correct channel queues
                    thePlugins = [_channelController];
                }
                return new ProcessTelemetryContext(thePlugins, _self.config, _self);
            };
            _self.getNotifyMgr = function () {
                if (!_notificationManager) {
                    // Create Dummy notification manager
                    _notificationManager = objCreateFn({
                        addNotificationListener: function (listener) { },
                        removeNotificationListener: function (listener) { },
                        eventsSent: function (events) { },
                        eventsDiscarded: function (events, reason) { },
                        eventsSendRequest: function (sendReason, isAsync) { }
                    });
                    // For backward compatibility only
                    _self[strNotificationManager] = _notificationManager;
                }
                return _notificationManager;
            };
            _self.getCookieMgr = function () {
                if (!_cookieManager) {
                    _cookieManager = createCookieMgr(_self.config, _self.logger);
                }
                return _cookieManager;
            };
            _self.setCookieMgr = function (cookieMgr) {
                _cookieManager = cookieMgr;
            };
            _self.getPerfMgr = function () {
                if (!_perfManager) {
                    if (_self.config && _self.config.enablePerfMgr) {
                        _perfManager = new PerfManager(_self.getNotifyMgr());
                    }
                }
                return _perfManager;
            };
            _self.setPerfMgr = function (perfMgr) {
                _perfManager = perfMgr;
            };
            _self.eventCnt = function () {
                return _eventQueue.length;
            };
            _self.releaseQueue = function () {
                if (_eventQueue.length > 0) {
                    arrForEach(_eventQueue, function (event) {
                        _self.getProcessTelContext().processNext(event);
                    });
                    _eventQueue = [];
                }
            };
        });
    }
// Removed Stub for BaseCore.prototype.initialize.
// Removed Stub for BaseCore.prototype.getTransmissionControls.
// Removed Stub for BaseCore.prototype.track.
// Removed Stub for BaseCore.prototype.getProcessTelContext.
// Removed Stub for BaseCore.prototype.getNotifyMgr.
// Removed Stub for BaseCore.prototype.getCookieMgr.
// Removed Stub for BaseCore.prototype.setCookieMgr.
// Removed Stub for BaseCore.prototype.getPerfMgr.
// Removed Stub for BaseCore.prototype.setPerfMgr.
// Removed Stub for BaseCore.prototype.eventCnt.
// Removed Stub for BaseCore.prototype.releaseQueue.
    return BaseCore;
}());
export { BaseCore };//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/fe719cd3e5825bf14e14182fddeb88ee8daf044f/node_modules/@microsoft/applicationinsights-core-js/dist-esm/JavaScriptSDK/BaseCore.js.map