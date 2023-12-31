/*
 * Application Insights JavaScript SDK - Core, 2.6.4
 * Copyright (c) Microsoft and contributors. All rights reserved.
 */
import dynamicProto from "@microsoft/dynamicproto-js";
import { arrForEach, arrIndexOf } from './HelperFuncs';
/**
 * Class to manage sending notifications to all the listeners.
 */
var NotificationManager = /** @class */ (function () {
    function NotificationManager(config) {
        this.listeners = [];
        var perfEvtsSendAll = !!(config || {}).perfEvtsSendAll;
        dynamicProto(NotificationManager, this, function (_self) {
            _self.addNotificationListener = function (listener) {
                _self.listeners.push(listener);
            };
            /**
             * Removes all instances of the listener.
             * @param {INotificationListener} listener - AWTNotificationListener to remove.
             */
            _self.removeNotificationListener = function (listener) {
                var index = arrIndexOf(_self.listeners, listener);
                while (index > -1) {
                    _self.listeners.splice(index, 1);
                    index = arrIndexOf(_self.listeners, listener);
                }
            };
            /**
             * Notification for events sent.
             * @param {ITelemetryItem[]} events - The array of events that have been sent.
             */
            _self.eventsSent = function (events) {
                arrForEach(_self.listeners, function (listener) {
                    if (listener && listener.eventsSent) {
                        setTimeout(function () { return listener.eventsSent(events); }, 0);
                    }
                });
            };
            /**
             * Notification for events being discarded.
             * @param {ITelemetryItem[]} events - The array of events that have been discarded by the SDK.
             * @param {number} reason           - The reason for which the SDK discarded the events. The EventsDiscardedReason
             * constant should be used to check the different values.
             */
            _self.eventsDiscarded = function (events, reason) {
                arrForEach(_self.listeners, function (listener) {
                    if (listener && listener.eventsDiscarded) {
                        setTimeout(function () { return listener.eventsDiscarded(events, reason); }, 0);
                    }
                });
            };
            /**
             * [Optional] A function called when the events have been requested to be sent to the sever.
             * @param {number} sendReason - The reason why the event batch is being sent.
             * @param {boolean} isAsync   - A flag which identifies whether the requests are being sent in an async or sync manner.
             */
            _self.eventsSendRequest = function (sendReason, isAsync) {
                arrForEach(_self.listeners, function (listener) {
                    if (listener && listener.eventsSendRequest) {
                        if (isAsync) {
                            setTimeout(function () { return listener.eventsSendRequest(sendReason, isAsync); }, 0);
                        }
                        else {
                            try {
                                listener.eventsSendRequest(sendReason, isAsync);
                            }
                            catch (e) {
                                // Catch errors to ensure we don't block sending the requests
                            }
                        }
                    }
                });
            };
            _self.perfEvent = function (perfEvent) {
                if (perfEvent) {
                    // Send all events or only parent events
                    if (perfEvtsSendAll || !perfEvent.isChildEvt()) {
                        arrForEach(_self.listeners, function (listener) {
                            if (listener && listener.perfEvent) {
                                if (perfEvent.isAsync) {
                                    setTimeout(function () { return listener.perfEvent(perfEvent); }, 0);
                                }
                                else {
                                    try {
                                        listener.perfEvent(perfEvent);
                                    }
                                    catch (e) {
                                        // Catch errors to ensure we don't block sending the requests
                                    }
                                }
                            }
                        });
                    }
                }
            };
        });
    }
// Removed Stub for NotificationManager.prototype.addNotificationListener.
// Removed Stub for NotificationManager.prototype.removeNotificationListener.
// Removed Stub for NotificationManager.prototype.eventsSent.
// Removed Stub for NotificationManager.prototype.eventsDiscarded.
// Removed Stub for NotificationManager.prototype.eventsSendRequest.
    return NotificationManager;
}());
export { NotificationManager };//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/ee8c7def80afc00dd6e593ef12f37756d8f504ea/node_modules/@microsoft/applicationinsights-core-js/dist-esm/JavaScriptSDK/NotificationManager.js.map