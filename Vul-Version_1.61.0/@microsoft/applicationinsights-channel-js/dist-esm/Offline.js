/*
 * Application Insights JavaScript SDK - Channel, 2.6.4
 * Copyright (c) Microsoft and contributors. All rights reserved.
 */
import { EventHelper, getWindow, getDocument, getNavigator, isUndefined, isNullOrUndefined } from '@microsoft/applicationinsights-core-js';
import dynamicProto from '@microsoft/dynamicproto-js';
/**
 * @description Monitors browser for offline events
 * @export default - Offline: Static instance of OfflineListener
 * @class OfflineListener
 */
var OfflineListener = /** @class */ (function () {
    function OfflineListener() {
        var _window = getWindow();
        var _document = getDocument();
        var isListening = false;
        var _onlineStatus = true;
        dynamicProto(OfflineListener, this, function (_self) {
            try {
                if (_window) {
                    if (EventHelper.Attach(_window, 'online', _setOnline)) {
                        EventHelper.Attach(_window, 'offline', _setOffline);
                        isListening = true;
                    }
                }
                if (_document) {
                    // Also attach to the document.body or document
                    var target = _document.body || _document;
                    if (!isUndefined(target.ononline)) {
                        target.ononline = _setOnline;
                        target.onoffline = _setOffline;
                        isListening = true;
                    }
                }
                if (isListening) {
                    // We are listening to events so lets set the current status rather than assuming we are online #1538
                    var _navigator = getNavigator(); // Gets the window.navigator or workerNavigator depending on the global
                    if (_navigator && !isNullOrUndefined(_navigator.onLine)) {
                        _onlineStatus = _navigator.onLine;
                    }
                }
            }
            catch (e) {
                // this makes react-native less angry
                isListening = false;
            }
            _self.isListening = isListening;
            _self.isOnline = function () {
                var result = true;
                var _navigator = getNavigator();
                if (isListening) {
                    result = _onlineStatus;
                }
                else if (_navigator && !isNullOrUndefined(_navigator.onLine)) {
                    result = _navigator.onLine;
                }
                return result;
            };
            _self.isOffline = function () {
                return !_self.isOnline();
            };
            function _setOnline() {
                _onlineStatus = true;
            }
            function _setOffline() {
                _onlineStatus = false;
            }
        });
    }
// Removed Stub for OfflineListener.prototype.isOnline.
// Removed Stub for OfflineListener.prototype.isOffline.
    OfflineListener.Offline = new OfflineListener;
    return OfflineListener;
}());
export { OfflineListener };
export var Offline = OfflineListener.Offline;//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/ee8c7def80afc00dd6e593ef12f37756d8f504ea/node_modules/@microsoft/applicationinsights-channel-js/dist-esm/Offline.js.map