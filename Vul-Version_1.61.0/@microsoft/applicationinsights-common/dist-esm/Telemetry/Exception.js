/*
 * Application Insights JavaScript SDK - Common, 2.6.4
 * Copyright (c) Microsoft and contributors. All rights reserved.
 */


import { __extendsFn, __assignFn } from "@microsoft/applicationinsights-shims";
import { StackFrame } from '../Interfaces/Contracts/Generated/StackFrame';
import { ExceptionData } from '../Interfaces/Contracts/Generated/ExceptionData';
import { ExceptionDetails } from '../Interfaces/Contracts/Generated/ExceptionDetails';
import { dataSanitizeException, dataSanitizeMeasurements, dataSanitizeMessage, dataSanitizeProperties, dataSanitizeString } from './Common/DataSanitizer';
import { isNullOrUndefined, arrMap, isString, strTrim, isArray, isError, arrForEach, isObject, isFunction } from '@microsoft/applicationinsights-core-js';
import { strNotSpecified } from '../Constants';
var NoMethod = "<no_method>";
var strError = "error";
var strStack = "stack";
var strStackDetails = "stackDetails";
var strErrorSrc = "errorSrc";
var strMessage = "message";
var strDescription = "description";
function _stringify(value, convertToString) {
    var result = value;
    if (result && !isString(result)) {
        if (JSON && JSON.stringify) {
            result = JSON.stringify(value);
            if (convertToString && (!result || result === "{}")) {
                if (isFunction(value.toString)) {
                    result = value.toString();
                }
                else {
                    result = "" + value;
                }
            }
        }
        else {
            result = "" + value + " - (Missing JSON.stringify)";
        }
    }
    return result || "";
}
function _formatMessage(theEvent, errorType) {
    var evtMessage = theEvent;
    if (theEvent) {
        evtMessage = theEvent[strMessage] || theEvent[strDescription] || "";
        // Make sure the message is a string
        if (evtMessage && !isString(evtMessage)) {
            // tslint:disable-next-line: prefer-conditional-expression
            evtMessage = _stringify(evtMessage, true);
        }
        if (theEvent["filename"]) {
            // Looks like an event object with filename
            evtMessage = evtMessage + " @" + (theEvent["filename"] || "") + ":" + (theEvent["lineno"] || "?") + ":" + (theEvent["colno"] || "?");
        }
    }
    // Automatically add the error type to the message if it does already appear to be present
    if (errorType && errorType !== "String" && errorType !== "Object" && errorType !== "Error" && (evtMessage || "").indexOf(errorType) === -1) {
        evtMessage = errorType + ": " + evtMessage;
    }
    return evtMessage || "";
}
function _isExceptionDetailsInternal(value) {
    if (isObject(value)) {
        return "hasFullStack" in value && "typeName" in value;
    }
    return false;
}
function _isExceptionInternal(value) {
    if (isObject(value)) {
        return ("ver" in value && "exceptions" in value && "properties" in value);
    }
    return false;
}
function _isStackDetails(details) {
    return details && details.src && isString(details.src) && details.obj && isArray(details.obj);
}
function _convertStackObj(errorStack) {
    var src = errorStack || "";
    if (!isString(src)) {
        if (isString(src[strStack])) {
            src = src[strStack];
        }
        else {
            src = "" + src;
        }
    }
    var items = src.split("\n");
    return {
        src: src,
        obj: items
    };
}
function _getOperaStack(errorMessage) {
    var stack = [];
    var lines = errorMessage.split("\n");
    for (var lp = 0; lp < lines.length; lp++) {
        var entry = lines[lp];
        if (lines[lp + 1]) {
            entry += "@" + lines[lp + 1];
            lp++;
        }
        stack.push(entry);
    }
    return {
        src: errorMessage,
        obj: stack
    };
}
function _getStackFromErrorObj(errorObj) {
    var details = null;
    if (errorObj) {
        try {
            /* Using bracket notation is support older browsers (IE 7/8 -- dont remember the version) that throw when using dot
            notation for undefined objects and we don't want to loose the error from being reported */
            if (errorObj[strStack]) {
                // Chrome/Firefox
                details = _convertStackObj(errorObj[strStack]);
            }
            else if (errorObj[strError] && errorObj[strError][strStack]) {
                // Edge error event provides the stack and error object
                details = _convertStackObj(errorObj[strError][strStack]);
            }
            else if (errorObj['exception'] && errorObj.exception[strStack]) {
                details = _convertStackObj(errorObj.exception[strStack]);
            }
            else if (_isStackDetails(errorObj)) {
                details = errorObj;
            }
            else if (_isStackDetails(errorObj[strStackDetails])) {
                details = errorObj[strStackDetails];
            }
            else if (window['opera'] && errorObj[strMessage]) {
                // Opera
                details = _getOperaStack(errorObj.message);
            }
            else if (isString(errorObj)) {
                details = _convertStackObj(errorObj);
            }
            else {
                var evtMessage = errorObj[strMessage] || errorObj[strDescription] || "";
                if (isString(errorObj[strErrorSrc])) {
                    if (evtMessage) {
                        evtMessage += "\n";
                    }
                    evtMessage += " from " + errorObj[strErrorSrc];
                }
                if (evtMessage) {
                    details = _convertStackObj(evtMessage);
                }
            }
        }
        catch (e) {
            // something unexpected happened so to avoid failing to report any error lets swallow the exception 
            // and fallback to the callee/caller method
            details = _convertStackObj(e);
        }
    }
    return details || {
        src: "",
        obj: null
    };
}
function _formatStackTrace(stackDetails) {
    var stack = "";
    if (stackDetails) {
        if (stackDetails.obj) {
            arrForEach(stackDetails.obj, function (entry) {
                stack += entry + "\n";
            });
        }
        else {
            stack = stackDetails.src || "";
        }
    }
    return stack;
}
function _parseStack(stack) {
    var parsedStack;
    var frames = stack.obj;
    if (frames && frames.length > 0) {
        parsedStack = [];
        var level_1 = 0;
        var totalSizeInBytes_1 = 0;
        arrForEach(frames, function (frame) {
            var theFrame = frame.toString();
            if (_StackFrame.regex.test(theFrame)) {
                var parsedFrame = new _StackFrame(theFrame, level_1++);
                totalSizeInBytes_1 += parsedFrame.sizeInBytes;
                parsedStack.push(parsedFrame);
            }
        });
        // DP Constraint - exception parsed stack must be < 32KB
        // remove frames from the middle to meet the threshold
        var exceptionParsedStackThreshold = 32 * 1024;
        if (totalSizeInBytes_1 > exceptionParsedStackThreshold) {
            var left = 0;
            var right = parsedStack.length - 1;
            var size = 0;
            var acceptedLeft = left;
            var acceptedRight = right;
            while (left < right) {
                // check size
                var lSize = parsedStack[left].sizeInBytes;
                var rSize = parsedStack[right].sizeInBytes;
                size += lSize + rSize;
                if (size > exceptionParsedStackThreshold) {
                    // remove extra frames from the middle
                    var howMany = acceptedRight - acceptedLeft + 1;
                    parsedStack.splice(acceptedLeft, howMany);
                    break;
                }
                // update pointers
                acceptedLeft = left;
                acceptedRight = right;
                left++;
                right--;
            }
        }
    }
    return parsedStack;
}
function _getErrorType(errorType) {
    // Gets the Error Type by passing the constructor (used to get the true type of native error object).
    var typeName = "";
    if (errorType) {
        typeName = errorType.typeName || errorType.name || "";
        if (!typeName) {
            try {
                var funcNameRegex = /function (.{1,200})\(/;
                var results = (funcNameRegex).exec((errorType).constructor.toString());
                typeName = (results && results.length > 1) ? results[1] : "";
            }
            catch (e) {
                // eslint-disable-next-line no-empty -- Ignoring any failures as nothing we can do
            }
        }
    }
    return typeName;
}
/**
 * Formats the provided errorObj for display and reporting, it may be a String, Object, integer or undefined depending on the browser.
 * @param errorObj The supplied errorObj
 */
export function _formatErrorCode(errorObj) {
    if (errorObj) {
        try {
            if (!isString(errorObj)) {
                var errorType = _getErrorType(errorObj);
                var result = _stringify(errorObj, false);
                if (!result || result === "{}") {
                    if (errorObj[strError]) {
                        // Looks like an MS Error Event
                        errorObj = errorObj[strError];
                        errorType = _getErrorType(errorObj);
                    }
                    result = _stringify(errorObj, true);
                }
                if (result.indexOf(errorType) !== 0 && errorType !== "String") {
                    return errorType + ":" + result;
                }
                return result;
            }
        }
        catch (e) {
            // eslint-disable-next-line no-empty -- Ignoring any failures as nothing we can do
        }
    }
    // Fallback to just letting the object format itself into a string
    return "" + (errorObj || "");
}
var Exception = /** @class */ (function (_super) {
    __extendsFn(Exception, _super);
    /**
     * Constructs a new instance of the ExceptionTelemetry object
     */
    function Exception(logger, exception, properties, measurements, severityLevel, id) {
        var _this = _super.call(this) || this;
        _this.aiDataContract = {
            ver: 1 /* Required */,
            exceptions: 1 /* Required */,
            severityLevel: 0 /* Default */,
            properties: 0 /* Default */,
            measurements: 0 /* Default */
        };
        if (!_isExceptionInternal(exception)) {
            if (!properties) {
                properties = {};
            }
            _this.exceptions = [new _ExceptionDetails(logger, exception, properties)];
            _this.properties = dataSanitizeProperties(logger, properties);
            _this.measurements = dataSanitizeMeasurements(logger, measurements);
            if (severityLevel) {
                _this.severityLevel = severityLevel;
            }
            if (id) {
                _this.id = id;
            }
        }
        else {
            _this.exceptions = exception.exceptions;
            _this.properties = exception.properties;
            _this.measurements = exception.measurements;
            if (exception.severityLevel) {
                _this.severityLevel = exception.severityLevel;
            }
            if (exception.id) {
                _this.id = exception.id;
            }
            if (exception.problemGroup) {
                _this.problemGroup = exception.problemGroup;
            }
            // bool/int types, use isNullOrUndefined
            _this.ver = 2; // TODO: handle the CS"4.0" ==> breeze 2 conversion in a better way
            if (!isNullOrUndefined(exception.isManual)) {
                _this.isManual = exception.isManual;
            }
        }
        return _this;
    }
    Exception.CreateAutoException = function (message, url, lineNumber, columnNumber, error, evt, stack, errorSrc) {
        var errorType = _getErrorType(error || evt || message);
        return {
            message: _formatMessage(message, errorType),
            url: url,
            lineNumber: lineNumber,
            columnNumber: columnNumber,
            error: _formatErrorCode(error || evt || message),
            evt: _formatErrorCode(evt || message),
            typeName: errorType,
            stackDetails: _getStackFromErrorObj(stack || error || evt),
            errorSrc: errorSrc
        };
    };
    Exception.CreateFromInterface = function (logger, exception, properties, measurements) {
        var exceptions = exception.exceptions
            && arrMap(exception.exceptions, function (ex) { return _ExceptionDetails.CreateFromInterface(logger, ex); });
        var exceptionData = new Exception(logger, __assignFn({}, exception, { exceptions: exceptions }), properties, measurements);
        return exceptionData;
    };
    Exception.prototype.toInterface = function () {
        var _a = this, exceptions = _a.exceptions, properties = _a.properties, measurements = _a.measurements, severityLevel = _a.severityLevel, ver = _a.ver, problemGroup = _a.problemGroup, id = _a.id, isManual = _a.isManual;
        var exceptionDetailsInterface = exceptions instanceof Array
            && arrMap(exceptions, function (exception) { return exception.toInterface(); })
            || undefined;
        return {
            ver: "4.0",
            exceptions: exceptionDetailsInterface,
            severityLevel: severityLevel,
            properties: properties,
            measurements: measurements,
            problemGroup: problemGroup,
            id: id,
            isManual: isManual
        };
    };
    /**
     * Creates a simple exception with 1 stack frame. Useful for manual constracting of exception.
     */
    Exception.CreateSimpleException = function (message, typeName, assembly, fileName, details, line) {
        return {
            exceptions: [
                {
                    hasFullStack: true,
                    message: message,
                    stack: details,
                    typeName: typeName
                }
            ]
        };
    };
    Exception.envelopeType = "Microsoft.ApplicationInsights.{0}.Exception";
    Exception.dataType = "ExceptionData";
    Exception.formatError = _formatErrorCode;
    return Exception;
}(ExceptionData));
export { Exception };
var _ExceptionDetails = /** @class */ (function (_super) {
    __extendsFn(_ExceptionDetails, _super);
    function _ExceptionDetails(logger, exception, properties) {
        var _this = _super.call(this) || this;
        _this.aiDataContract = {
            id: 0 /* Default */,
            outerId: 0 /* Default */,
            typeName: 1 /* Required */,
            message: 1 /* Required */,
            hasFullStack: 0 /* Default */,
            stack: 0 /* Default */,
            parsedStack: 2 /* Array */
        };
        if (!_isExceptionDetailsInternal(exception)) {
            var error = exception;
            var evt = error && error.evt;
            if (!isError(error)) {
                error = error[strError] || evt || error;
            }
            _this.typeName = dataSanitizeString(logger, _getErrorType(error)) || strNotSpecified;
            _this.message = dataSanitizeMessage(logger, _formatMessage(exception || error, _this.typeName)) || strNotSpecified;
            var stack = exception[strStackDetails] || _getStackFromErrorObj(exception);
            _this.parsedStack = _parseStack(stack);
            _this[strStack] = dataSanitizeException(logger, _formatStackTrace(stack));
            _this.hasFullStack = isArray(_this.parsedStack) && _this.parsedStack.length > 0;
            if (properties) {
                properties.typeName = properties.typeName || _this.typeName;
            }
        }
        else {
            _this.typeName = exception.typeName;
            _this.message = exception.message;
            _this[strStack] = exception[strStack];
            _this.parsedStack = exception.parsedStack;
            _this.hasFullStack = exception.hasFullStack;
        }
        return _this;
    }
    _ExceptionDetails.prototype.toInterface = function () {
        var parsedStack = this.parsedStack instanceof Array
            && arrMap(this.parsedStack, function (frame) { return frame.toInterface(); });
        var exceptionDetailsInterface = {
            id: this.id,
            outerId: this.outerId,
            typeName: this.typeName,
            message: this.message,
            hasFullStack: this.hasFullStack,
            stack: this[strStack],
            parsedStack: parsedStack || undefined
        };
        return exceptionDetailsInterface;
    };
    _ExceptionDetails.CreateFromInterface = function (logger, exception) {
        var parsedStack = (exception.parsedStack instanceof Array
            && arrMap(exception.parsedStack, function (frame) { return _StackFrame.CreateFromInterface(frame); }))
            || exception.parsedStack;
        var exceptionDetails = new _ExceptionDetails(logger, __assignFn({}, exception, { parsedStack: parsedStack }));
        return exceptionDetails;
    };
    return _ExceptionDetails;
}(ExceptionDetails));
export { _ExceptionDetails };
var _StackFrame = /** @class */ (function (_super) {
    __extendsFn(_StackFrame, _super);
    function _StackFrame(sourceFrame, level) {
        var _this = _super.call(this) || this;
        _this.sizeInBytes = 0;
        _this.aiDataContract = {
            level: 1 /* Required */,
            method: 1 /* Required */,
            assembly: 0 /* Default */,
            fileName: 0 /* Default */,
            line: 0 /* Default */
        };
        // Not converting this to isString() as typescript uses this logic to "understand" the different
        // types for the 2 different code paths
        if (typeof sourceFrame === "string") {
            var frame = sourceFrame;
            _this.level = level;
            _this.method = NoMethod;
            _this.assembly = strTrim(frame);
            _this.fileName = "";
            _this.line = 0;
            var matches = frame.match(_StackFrame.regex);
            if (matches && matches.length >= 5) {
                _this.method = strTrim(matches[2]) || _this.method;
                _this.fileName = strTrim(matches[4]);
                _this.line = parseInt(matches[5]) || 0;
            }
        }
        else {
            _this.level = sourceFrame.level;
            _this.method = sourceFrame.method;
            _this.assembly = sourceFrame.assembly;
            _this.fileName = sourceFrame.fileName;
            _this.line = sourceFrame.line;
            _this.sizeInBytes = 0;
        }
        _this.sizeInBytes += _this.method.length;
        _this.sizeInBytes += _this.fileName.length;
        _this.sizeInBytes += _this.assembly.length;
        // todo: these might need to be removed depending on how the back-end settles on their size calculation
        _this.sizeInBytes += _StackFrame.baseSize;
        _this.sizeInBytes += _this.level.toString().length;
        _this.sizeInBytes += _this.line.toString().length;
        return _this;
    }
    _StackFrame.CreateFromInterface = function (frame) {
        return new _StackFrame(frame, null /* level is available in frame interface */);
    };
    _StackFrame.prototype.toInterface = function () {
        return {
            level: this.level,
            method: this.method,
            assembly: this.assembly,
            fileName: this.fileName,
            line: this.line
        };
    };
    // regex to match stack frames from ie/chrome/ff
    // methodName=$2, fileName=$4, lineNo=$5, column=$6
    _StackFrame.regex = /^([\s]+at)?[\s]{0,50}([^\@\()]+?)[\s]{0,50}(\@|\()([^\(\n]+):([0-9]+):([0-9]+)(\)?)$/;
    _StackFrame.baseSize = 58; // '{"method":"","level":,"assembly":"","fileName":"","line":}'.length
    return _StackFrame;
}(StackFrame));
export { _StackFrame };//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/ee8c7def80afc00dd6e593ef12f37756d8f504ea/node_modules/@microsoft/applicationinsights-common/dist-esm/Telemetry/Exception.js.map