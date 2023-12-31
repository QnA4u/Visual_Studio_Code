/*
 * Application Insights JavaScript SDK - Core, 2.6.4
 * Copyright (c) Microsoft and contributors. All rights reserved.
 */


"use strict";
import { _InternalMessageId, LoggingSeverity } from "../JavaScriptSDK.Enums/LoggingEnums";
import { hasJSON, getJSON, getConsole } from "./EnvUtils";
import dynamicProto from '@microsoft/dynamicproto-js';
import { isFunction, isNullOrUndefined, isUndefined } from "./HelperFuncs";
/**
 * For user non actionable traces use AI Internal prefix.
 */
var AiNonUserActionablePrefix = "AI (Internal): ";
/**
 * Prefix of the traces in portal.
 */
var AiUserActionablePrefix = "AI: ";
/**
 *  Session storage key for the prefix for the key indicating message type already logged
 */
var AIInternalMessagePrefix = "AITR_";
function _sanitizeDiagnosticText(text) {
    if (text) {
        return "\"" + text.replace(/\"/g, "") + "\"";
    }
    return "";
}
var _InternalLogMessage = /** @class */ (function () {
    function _InternalLogMessage(msgId, msg, isUserAct, properties) {
        if (isUserAct === void 0) { isUserAct = false; }
        var _self = this;
        _self.messageId = msgId;
        _self.message =
            (isUserAct ? AiUserActionablePrefix : AiNonUserActionablePrefix) +
                msgId;
        var strProps = "";
        if (hasJSON()) {
            strProps = getJSON().stringify(properties);
        }
        var diagnosticText = (msg ? " message:" + _sanitizeDiagnosticText(msg) : "") +
            (properties ? " props:" + _sanitizeDiagnosticText(strProps) : "");
        _self.message += diagnosticText;
    }
    _InternalLogMessage.dataType = "MessageData";
    return _InternalLogMessage;
}());
export { _InternalLogMessage };
export function safeGetLogger(core, config) {
    return (core || {}).logger || new DiagnosticLogger(config);
}
var DiagnosticLogger = /** @class */ (function () {
    function DiagnosticLogger(config) {
        this.identifier = 'DiagnosticLogger';
        /**
         * The internal logging queue
         */
        this.queue = [];
        /**
         * Count of internal messages sent
         */
        var _messageCount = 0;
        /**
         * Holds information about what message types were already logged to console or sent to server.
         */
        var _messageLogged = {};
        dynamicProto(DiagnosticLogger, this, function (_self) {
            if (isNullOrUndefined(config)) {
                config = {};
            }
            _self.consoleLoggingLevel = function () { return _getConfigValue('loggingLevelConsole', 0); };
            _self.telemetryLoggingLevel = function () { return _getConfigValue('loggingLevelTelemetry', 1); };
            _self.maxInternalMessageLimit = function () { return _getConfigValue('maxMessageLimit', 25); };
            _self.enableDebugExceptions = function () { return _getConfigValue('enableDebugExceptions', false); };
            /**
             * This method will throw exceptions in debug mode or attempt to log the error as a console warning.
             * @param severity {LoggingSeverity} - The severity of the log message
             * @param message {_InternalLogMessage} - The log message.
             */
            _self.throwInternal = function (severity, msgId, msg, properties, isUserAct) {
                if (isUserAct === void 0) { isUserAct = false; }
                var message = new _InternalLogMessage(msgId, msg, isUserAct, properties);
                if (_self.enableDebugExceptions()) {
                    throw message;
                }
                else {
                    if (!isUndefined(message.message)) {
                        var logLevel = _self.consoleLoggingLevel();
                        if (isUserAct) {
                            // check if this message type was already logged to console for this page view and if so, don't log it again
                            var messageKey = +message.messageId;
                            if (!_messageLogged[messageKey] && logLevel >= LoggingSeverity.WARNING) {
                                _self.warnToConsole(message.message);
                                _messageLogged[messageKey] = true;
                            }
                        }
                        else {
                            // don't log internal AI traces in the console, unless the verbose logging is enabled
                            if (logLevel >= LoggingSeverity.WARNING) {
                                _self.warnToConsole(message.message);
                            }
                        }
                        _self.logInternalMessage(severity, message);
                    }
                }
            };
            /**
             * This will write a warning to the console if possible
             * @param message {string} - The warning message
             */
            _self.warnToConsole = function (message) {
                var theConsole = getConsole();
                if (!!theConsole) {
                    var logFunc = 'log';
                    if (theConsole.warn) {
                        logFunc = 'warn';
                    }
                    if (isFunction(theConsole[logFunc])) {
                        theConsole[logFunc](message);
                    }
                }
            };
            /**
             * Resets the internal message count
             */
            _self.resetInternalMessageCount = function () {
                _messageCount = 0;
                _messageLogged = {};
            };
            /**
             * Logs a message to the internal queue.
             * @param severity {LoggingSeverity} - The severity of the log message
             * @param message {_InternalLogMessage} - The message to log.
             */
            _self.logInternalMessage = function (severity, message) {
                if (_areInternalMessagesThrottled()) {
                    return;
                }
                // check if this message type was already logged for this session and if so, don't log it again
                var logMessage = true;
                var messageKey = AIInternalMessagePrefix + message.messageId;
                // if the session storage is not available, limit to only one message type per page view
                if (_messageLogged[messageKey]) {
                    logMessage = false;
                }
                else {
                    _messageLogged[messageKey] = true;
                }
                if (logMessage) {
                    // Push the event in the internal queue
                    if (severity <= _self.telemetryLoggingLevel()) {
                        _self.queue.push(message);
                        _messageCount++;
                    }
                    // When throttle limit reached, send a special event
                    if (_messageCount === _self.maxInternalMessageLimit()) {
                        var throttleLimitMessage = "Internal events throttle limit per PageView reached for this app.";
                        var throttleMessage = new _InternalLogMessage(_InternalMessageId.MessageLimitPerPVExceeded, throttleLimitMessage, false);
                        _self.queue.push(throttleMessage);
                        _self.warnToConsole(throttleLimitMessage);
                    }
                }
            };
            function _getConfigValue(name, defValue) {
                var value = config[name];
                if (!isNullOrUndefined(value)) {
                    return value;
                }
                return defValue;
            }
            function _areInternalMessagesThrottled() {
                return _messageCount >= _self.maxInternalMessageLimit();
            }
        });
    }
// Removed Stub for DiagnosticLogger.prototype.enableDebugExceptions.
// Removed Stub for DiagnosticLogger.prototype.consoleLoggingLevel.
// Removed Stub for DiagnosticLogger.prototype.telemetryLoggingLevel.
// Removed Stub for DiagnosticLogger.prototype.maxInternalMessageLimit.
// Removed Stub for DiagnosticLogger.prototype.throwInternal.
// Removed Stub for DiagnosticLogger.prototype.warnToConsole.
// Removed Stub for DiagnosticLogger.prototype.resetInternalMessageCount.
// Removed Stub for DiagnosticLogger.prototype.logInternalMessage.
    return DiagnosticLogger;
}());
export { DiagnosticLogger };//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/fe719cd3e5825bf14e14182fddeb88ee8daf044f/node_modules/@microsoft/applicationinsights-core-js/dist-esm/JavaScriptSDK/DiagnosticLogger.js.map