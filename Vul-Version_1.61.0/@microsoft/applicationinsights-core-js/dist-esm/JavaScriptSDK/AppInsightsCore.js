/*
 * Application Insights JavaScript SDK - Core, 2.6.4
 * Copyright (c) Microsoft and contributors. All rights reserved.
 */
import { __extendsFn } from "@microsoft/applicationinsights-shims";
import { BaseCore } from './BaseCore';
import { EventsDiscardedReason } from "../JavaScriptSDK.Enums/EventsDiscardedReason";
import { NotificationManager } from "./NotificationManager";
import { doPerf } from "./PerfManager";
import { _InternalLogMessage, DiagnosticLogger } from "./DiagnosticLogger";
import dynamicProto from '@microsoft/dynamicproto-js';
import { arrForEach, isNullOrUndefined, toISOString, throwError } from "./HelperFuncs";
"use strict";
var AppInsightsCore = /** @class */ (function (_super) {
    __extendsFn(AppInsightsCore, _super);
    function AppInsightsCore() {
        var _this = _super.call(this) || this;
        dynamicProto(AppInsightsCore, _this, function (_self, _base) {
            _self.initialize = function (config, extensions, logger, notificationManager) {
                _base.initialize(config, extensions, logger || new DiagnosticLogger(config), notificationManager || new NotificationManager(config));
            };
            _self.track = function (telemetryItem) {
                doPerf(_self.getPerfMgr(), function () { return "AppInsightsCore:track"; }, function () {
                    if (telemetryItem === null) {
                        _notifyInvalidEvent(telemetryItem);
                        // throw error
                        throwError("Invalid telemetry item");
                    }
                    // do basic validation before sending it through the pipeline
                    _validateTelemetryItem(telemetryItem);
                    _base.track(telemetryItem);
                }, function () { return ({ item: telemetryItem }); }, !(telemetryItem.sync));
            };
            /**
             * Adds a notification listener. The SDK calls methods on the listener when an appropriate notification is raised.
             * The added plugins must raise notifications. If the plugins do not implement the notifications, then no methods will be
             * called.
             * @param {INotificationListener} listener - An INotificationListener object.
             */
            _self.addNotificationListener = function (listener) {
                var manager = _self.getNotifyMgr();
                if (manager) {
                    manager.addNotificationListener(listener);
                }
            };
            /**
             * Removes all instances of the listener.
             * @param {INotificationListener} listener - INotificationListener to remove.
             */
            _self.removeNotificationListener = function (listener) {
                var manager = _self.getNotifyMgr();
                if (manager) {
                    manager.removeNotificationListener(listener);
                }
            };
            /**
             * Periodically check logger.queue for
             */
            _self.pollInternalLogs = function (eventName) {
                var interval = _self.config.diagnosticLogInterval;
                if (!interval || !(interval > 0)) {
                    interval = 10000;
                }
                return setInterval(function () {
                    var queue = _self.logger ? _self.logger.queue : [];
                    arrForEach(queue, function (logMessage) {
                        var item = {
                            name: eventName ? eventName : "InternalMessageId: " + logMessage.messageId,
                            iKey: _self.config.instrumentationKey,
                            time: toISOString(new Date()),
                            baseType: _InternalLogMessage.dataType,
                            baseData: { message: logMessage.message }
                        };
                        _self.track(item);
                    });
                    queue.length = 0;
                }, interval);
            };
            function _validateTelemetryItem(telemetryItem) {
                if (isNullOrUndefined(telemetryItem.name)) {
                    _notifyInvalidEvent(telemetryItem);
                    throw Error("telemetry name required");
                }
            }
            function _notifyInvalidEvent(telemetryItem) {
                var manager = _self.getNotifyMgr();
                if (manager) {
                    manager.eventsDiscarded([telemetryItem], EventsDiscardedReason.InvalidEvent);
                }
            }
        });
        return _this;
    }
// Removed Stub for AppInsightsCore.prototype.initialize.
// Removed Stub for AppInsightsCore.prototype.track.
// Removed Stub for AppInsightsCore.prototype.addNotificationListener.
// Removed Stub for AppInsightsCore.prototype.removeNotificationListener.
// Removed Stub for AppInsightsCore.prototype.pollInternalLogs.
    return AppInsightsCore;
}(BaseCore));
export { AppInsightsCore };//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/ee8c7def80afc00dd6e593ef12f37756d8f504ea/node_modules/@microsoft/applicationinsights-core-js/dist-esm/JavaScriptSDK/AppInsightsCore.js.map