/*
 * Application Insights JavaScript SDK - Common, 2.6.4
 * Copyright (c) Microsoft and contributors. All rights reserved.
 */


import { LoggingSeverity, _InternalMessageId, hasJSON, getJSON, objForEachKey, isObject, strTrim } from '@microsoft/applicationinsights-core-js';
;
export function dataSanitizeKeyAndAddUniqueness(logger, key, map) {
    var origLength = key.length;
    var field = dataSanitizeKey(logger, key);
    // validation truncated the length.  We need to add uniqueness
    if (field.length !== origLength) {
        var i = 0;
        var uniqueField = field;
        while (map[uniqueField] !== undefined) {
            i++;
            uniqueField = field.substring(0, 150 /* MAX_NAME_LENGTH */ - 3) + dsPadNumber(i);
        }
        field = uniqueField;
    }
    return field;
}
export function dataSanitizeKey(logger, name) {
    var nameTrunc;
    if (name) {
        // Remove any leading or trailing whitepace
        name = strTrim(name.toString());
        // truncate the string to 150 chars
        if (name.length > 150 /* MAX_NAME_LENGTH */) {
            nameTrunc = name.substring(0, 150 /* MAX_NAME_LENGTH */);
            logger.throwInternal(LoggingSeverity.WARNING, _InternalMessageId.NameTooLong, "name is too long.  It has been truncated to " + 150 /* MAX_NAME_LENGTH */ + " characters.", { name: name }, true);
        }
    }
    return nameTrunc || name;
}
export function dataSanitizeString(logger, value, maxLength) {
    if (maxLength === void 0) { maxLength = 1024 /* MAX_STRING_LENGTH */; }
    var valueTrunc;
    if (value) {
        maxLength = maxLength ? maxLength : 1024 /* MAX_STRING_LENGTH */; // in case default parameters dont work
        value = strTrim(value);
        if (value.toString().length > maxLength) {
            valueTrunc = value.toString().substring(0, maxLength);
            logger.throwInternal(LoggingSeverity.WARNING, _InternalMessageId.StringValueTooLong, "string value is too long. It has been truncated to " + maxLength + " characters.", { value: value }, true);
        }
    }
    return valueTrunc || value;
}
export function dataSanitizeUrl(logger, url) {
    return dataSanitizeInput(logger, url, 2048 /* MAX_URL_LENGTH */, _InternalMessageId.UrlTooLong);
}
export function dataSanitizeMessage(logger, message) {
    var messageTrunc;
    if (message) {
        if (message.length > 32768 /* MAX_MESSAGE_LENGTH */) {
            messageTrunc = message.substring(0, 32768 /* MAX_MESSAGE_LENGTH */);
            logger.throwInternal(LoggingSeverity.WARNING, _InternalMessageId.MessageTruncated, "message is too long, it has been truncated to " + 32768 /* MAX_MESSAGE_LENGTH */ + " characters.", { message: message }, true);
        }
    }
    return messageTrunc || message;
}
export function dataSanitizeException(logger, exception) {
    var exceptionTrunc;
    if (exception) {
        // Make surte its a string
        var value = "" + exception;
        if (value.length > 32768 /* MAX_EXCEPTION_LENGTH */) {
            exceptionTrunc = value.substring(0, 32768 /* MAX_EXCEPTION_LENGTH */);
            logger.throwInternal(LoggingSeverity.WARNING, _InternalMessageId.ExceptionTruncated, "exception is too long, it has been truncated to " + 32768 /* MAX_EXCEPTION_LENGTH */ + " characters.", { exception: exception }, true);
        }
    }
    return exceptionTrunc || exception;
}
export function dataSanitizeProperties(logger, properties) {
    if (properties) {
        var tempProps_1 = {};
        objForEachKey(properties, function (prop, value) {
            if (isObject(value) && hasJSON()) {
                // Stringify any part C properties
                try {
                    value = getJSON().stringify(value);
                }
                catch (e) {
                    logger.throwInternal(LoggingSeverity.WARNING, _InternalMessageId.CannotSerializeObjectNonSerializable, "custom property is not valid", { exception: e }, true);
                }
            }
            value = dataSanitizeString(logger, value, 8192 /* MAX_PROPERTY_LENGTH */);
            prop = dataSanitizeKeyAndAddUniqueness(logger, prop, tempProps_1);
            tempProps_1[prop] = value;
        });
        properties = tempProps_1;
    }
    return properties;
}
export function dataSanitizeMeasurements(logger, measurements) {
    if (measurements) {
        var tempMeasurements_1 = {};
        objForEachKey(measurements, function (measure, value) {
            measure = dataSanitizeKeyAndAddUniqueness(logger, measure, tempMeasurements_1);
            tempMeasurements_1[measure] = value;
        });
        measurements = tempMeasurements_1;
    }
    return measurements;
}
export function dataSanitizeId(logger, id) {
    return id ? dataSanitizeInput(logger, id, 128 /* MAX_ID_LENGTH */, _InternalMessageId.IdTooLong).toString() : id;
}
export function dataSanitizeInput(logger, input, maxLength, _msgId) {
    var inputTrunc;
    if (input) {
        input = strTrim(input);
        if (input.length > maxLength) {
            inputTrunc = input.substring(0, maxLength);
            logger.throwInternal(LoggingSeverity.WARNING, _msgId, "input is too long, it has been truncated to " + maxLength + " characters.", { data: input }, true);
        }
    }
    return inputTrunc || input;
}
export function dsPadNumber(num) {
    var s = "00" + num;
    return s.substr(s.length - 3);
}
;
/**
 * Provides the DataSanitizer functions within the previous namespace.
 */
export var DataSanitizer = {
    MAX_NAME_LENGTH: 150 /* MAX_NAME_LENGTH */,
    MAX_ID_LENGTH: 128 /* MAX_ID_LENGTH */,
    MAX_PROPERTY_LENGTH: 8192 /* MAX_PROPERTY_LENGTH */,
    MAX_STRING_LENGTH: 1024 /* MAX_STRING_LENGTH */,
    MAX_URL_LENGTH: 2048 /* MAX_URL_LENGTH */,
    MAX_MESSAGE_LENGTH: 32768 /* MAX_MESSAGE_LENGTH */,
    MAX_EXCEPTION_LENGTH: 32768 /* MAX_EXCEPTION_LENGTH */,
    sanitizeKeyAndAddUniqueness: dataSanitizeKeyAndAddUniqueness,
    sanitizeKey: dataSanitizeKey,
    sanitizeString: dataSanitizeString,
    sanitizeUrl: dataSanitizeUrl,
    sanitizeMessage: dataSanitizeMessage,
    sanitizeException: dataSanitizeException,
    sanitizeProperties: dataSanitizeProperties,
    sanitizeMeasurements: dataSanitizeMeasurements,
    sanitizeId: dataSanitizeId,
    sanitizeInput: dataSanitizeInput,
    padNumber: dsPadNumber,
    trim: strTrim
};//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/ee8c7def80afc00dd6e593ef12f37756d8f504ea/node_modules/@microsoft/applicationinsights-common/dist-esm/Telemetry/Common/DataSanitizer.js.map