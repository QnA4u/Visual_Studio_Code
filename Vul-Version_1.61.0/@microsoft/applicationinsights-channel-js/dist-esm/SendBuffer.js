/*
 * Application Insights JavaScript SDK - Channel, 2.6.4
 * Copyright (c) Microsoft and contributors. All rights reserved.
 */
import { utlGetSessionStorage, utlSetSessionStorage } from '@microsoft/applicationinsights-common';
import { LoggingSeverity, _InternalMessageId, getJSON, arrForEach, isFunction, arrIndexOf, isString, dumpObj, isArray, getExceptionName } from '@microsoft/applicationinsights-core-js';
import dynamicProto from '@microsoft/dynamicproto-js';
/*
 * An array based send buffer.
 */
var ArraySendBuffer = /** @class */ (function () {
    function ArraySendBuffer(config) {
        var _buffer = [];
        dynamicProto(ArraySendBuffer, this, function (_self) {
            _self.enqueue = function (payload) {
                _buffer.push(payload);
            };
            _self.count = function () {
                return _buffer.length;
            };
            _self.clear = function () {
                _buffer.length = 0;
            };
            _self.getItems = function () {
                return _buffer.slice(0);
            };
            _self.batchPayloads = function (payload) {
                if (payload && payload.length > 0) {
                    var batch = config.emitLineDelimitedJson() ?
                        payload.join("\n") :
                        "[" + payload.join(",") + "]";
                    return batch;
                }
                return null;
            };
            _self.markAsSent = function (payload) {
                _self.clear();
            };
            _self.clearSent = function (payload) {
                // not supported
            };
        });
    }
// Removed Stub for ArraySendBuffer.prototype.enqueue.
// Removed Stub for ArraySendBuffer.prototype.count.
// Removed Stub for ArraySendBuffer.prototype.clear.
// Removed Stub for ArraySendBuffer.prototype.getItems.
// Removed Stub for ArraySendBuffer.prototype.batchPayloads.
// Removed Stub for ArraySendBuffer.prototype.markAsSent.
// Removed Stub for ArraySendBuffer.prototype.clearSent.
    return ArraySendBuffer;
}());
export { ArraySendBuffer };
/*
 * Session storage buffer holds a copy of all unsent items in the browser session storage.
 */
var SessionStorageSendBuffer = /** @class */ (function () {
    function SessionStorageSendBuffer(logger, config) {
        var _bufferFullMessageSent = false;
        // An in-memory copy of the buffer. A copy is saved to the session storage on enqueue() and clear().
        // The buffer is restored in a constructor and contains unsent events from a previous page.
        var _buffer;
        dynamicProto(SessionStorageSendBuffer, this, function (_self) {
            var bufferItems = _getBuffer(SessionStorageSendBuffer.BUFFER_KEY);
            var notDeliveredItems = _getBuffer(SessionStorageSendBuffer.SENT_BUFFER_KEY);
            _buffer = bufferItems.concat(notDeliveredItems);
            // If the buffer has too many items, drop items from the end.
            if (_buffer.length > SessionStorageSendBuffer.MAX_BUFFER_SIZE) {
                _buffer.length = SessionStorageSendBuffer.MAX_BUFFER_SIZE;
            }
            _setBuffer(SessionStorageSendBuffer.SENT_BUFFER_KEY, []);
            _setBuffer(SessionStorageSendBuffer.BUFFER_KEY, _buffer);
            _self.enqueue = function (payload) {
                if (_buffer.length >= SessionStorageSendBuffer.MAX_BUFFER_SIZE) {
                    // sent internal log only once per page view
                    if (!_bufferFullMessageSent) {
                        logger.throwInternal(LoggingSeverity.WARNING, _InternalMessageId.SessionStorageBufferFull, "Maximum buffer size reached: " + _buffer.length, true);
                        _bufferFullMessageSent = true;
                    }
                    return;
                }
                _buffer.push(payload);
                _setBuffer(SessionStorageSendBuffer.BUFFER_KEY, _buffer);
            };
            _self.count = function () {
                return _buffer.length;
            };
            _self.clear = function () {
                _buffer = [];
                _setBuffer(SessionStorageSendBuffer.BUFFER_KEY, []);
                _setBuffer(SessionStorageSendBuffer.SENT_BUFFER_KEY, []);
                _bufferFullMessageSent = false;
            };
            _self.getItems = function () {
                return _buffer.slice(0);
            };
            _self.batchPayloads = function (payload) {
                if (payload && payload.length > 0) {
                    var batch = config.emitLineDelimitedJson() ?
                        payload.join("\n") :
                        "[" + payload.join(",") + "]";
                    return batch;
                }
                return null;
            };
            _self.markAsSent = function (payload) {
                _buffer = _removePayloadsFromBuffer(payload, _buffer);
                _setBuffer(SessionStorageSendBuffer.BUFFER_KEY, _buffer);
                var sentElements = _getBuffer(SessionStorageSendBuffer.SENT_BUFFER_KEY);
                if (sentElements instanceof Array && payload instanceof Array) {
                    sentElements = sentElements.concat(payload);
                    if (sentElements.length > SessionStorageSendBuffer.MAX_BUFFER_SIZE) {
                        // We send telemetry normally. If the SENT_BUFFER is too big we don't add new elements
                        // until we receive a response from the backend and the buffer has free space again (see clearSent method)
                        logger.throwInternal(LoggingSeverity.CRITICAL, _InternalMessageId.SessionStorageBufferFull, "Sent buffer reached its maximum size: " + sentElements.length, true);
                        sentElements.length = SessionStorageSendBuffer.MAX_BUFFER_SIZE;
                    }
                    _setBuffer(SessionStorageSendBuffer.SENT_BUFFER_KEY, sentElements);
                }
            };
            _self.clearSent = function (payload) {
                var sentElements = _getBuffer(SessionStorageSendBuffer.SENT_BUFFER_KEY);
                sentElements = _removePayloadsFromBuffer(payload, sentElements);
                _setBuffer(SessionStorageSendBuffer.SENT_BUFFER_KEY, sentElements);
            };
            function _removePayloadsFromBuffer(payloads, buffer) {
                var remaining = [];
                arrForEach(buffer, function (value) {
                    if (!isFunction(value) && arrIndexOf(payloads, value) === -1) {
                        remaining.push(value);
                    }
                });
                return remaining;
            }
            function _getBuffer(key) {
                var prefixedKey = key;
                try {
                    prefixedKey = config.namePrefix && config.namePrefix() ? config.namePrefix() + "_" + prefixedKey : prefixedKey;
                    var bufferJson = utlGetSessionStorage(logger, prefixedKey);
                    if (bufferJson) {
                        var buffer = getJSON().parse(bufferJson);
                        if (isString(buffer)) {
                            // When using some version prototype.js the stringify / parse cycle does not decode array's correctly
                            buffer = getJSON().parse(buffer);
                        }
                        if (buffer && isArray(buffer)) {
                            return buffer;
                        }
                    }
                }
                catch (e) {
                    logger.throwInternal(LoggingSeverity.CRITICAL, _InternalMessageId.FailedToRestoreStorageBuffer, " storage key: " + prefixedKey + ", " + getExceptionName(e), { exception: dumpObj(e) });
                }
                return [];
            }
            function _setBuffer(key, buffer) {
                var prefixedKey = key;
                try {
                    prefixedKey = config.namePrefix && config.namePrefix() ? config.namePrefix() + "_" + prefixedKey : prefixedKey;
                    var bufferJson = JSON.stringify(buffer);
                    utlSetSessionStorage(logger, prefixedKey, bufferJson);
                }
                catch (e) {
                    // if there was an error, clear the buffer
                    // telemetry is stored in the _buffer array so we won't loose any items
                    utlSetSessionStorage(logger, prefixedKey, JSON.stringify([]));
                    logger.throwInternal(LoggingSeverity.WARNING, _InternalMessageId.FailedToSetStorageBuffer, " storage key: " + prefixedKey + ", " + getExceptionName(e) + ". Buffer cleared", { exception: dumpObj(e) });
                }
            }
        });
    }
// Removed Stub for SessionStorageSendBuffer.prototype.enqueue.
// Removed Stub for SessionStorageSendBuffer.prototype.count.
// Removed Stub for SessionStorageSendBuffer.prototype.clear.
// Removed Stub for SessionStorageSendBuffer.prototype.getItems.
// Removed Stub for SessionStorageSendBuffer.prototype.batchPayloads.
// Removed Stub for SessionStorageSendBuffer.prototype.markAsSent.
// Removed Stub for SessionStorageSendBuffer.prototype.clearSent.
    SessionStorageSendBuffer.BUFFER_KEY = "AI_buffer";
    SessionStorageSendBuffer.SENT_BUFFER_KEY = "AI_sentBuffer";
    // Maximum number of payloads stored in the buffer. If the buffer is full, new elements will be dropped.
    SessionStorageSendBuffer.MAX_BUFFER_SIZE = 2000;
    return SessionStorageSendBuffer;
}());
export { SessionStorageSendBuffer };//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/ee8c7def80afc00dd6e593ef12f37756d8f504ea/node_modules/@microsoft/applicationinsights-channel-js/dist-esm/SendBuffer.js.map