/*
 * Application Insights JavaScript SDK - Channel, 2.6.4
 * Copyright (c) Microsoft and contributors. All rights reserved.
 */
import { LoggingSeverity, _InternalMessageId, getJSON, objForEachKey, isFunction, isObject, isArray } from '@microsoft/applicationinsights-core-js';
import dynamicProto from '@microsoft/dynamicproto-js';
var Serializer = /** @class */ (function () {
    function Serializer(logger) {
        dynamicProto(Serializer, this, function (_self) {
            /**
             * Serializes the current object to a JSON string.
             */
            _self.serialize = function (input) {
                var output = _serializeObject(input, "root");
                try {
                    return getJSON().stringify(output);
                }
                catch (e) {
                    // if serialization fails return an empty string
                    logger.throwInternal(LoggingSeverity.CRITICAL, _InternalMessageId.CannotSerializeObject, (e && isFunction(e.toString)) ? e.toString() : "Error serializing object", null, true);
                }
            };
            function _serializeObject(source, name) {
                var circularReferenceCheck = "__aiCircularRefCheck";
                var output = {};
                if (!source) {
                    logger.throwInternal(LoggingSeverity.CRITICAL, _InternalMessageId.CannotSerializeObject, "cannot serialize object because it is null or undefined", { name: name }, true);
                    return output;
                }
                if (source[circularReferenceCheck]) {
                    logger.throwInternal(LoggingSeverity.WARNING, _InternalMessageId.CircularReferenceDetected, "Circular reference detected while serializing object", { name: name }, true);
                    return output;
                }
                if (!source.aiDataContract) {
                    // special case for measurements/properties/tags
                    if (name === "measurements") {
                        output = _serializeStringMap(source, "number", name);
                    }
                    else if (name === "properties") {
                        output = _serializeStringMap(source, "string", name);
                    }
                    else if (name === "tags") {
                        output = _serializeStringMap(source, "string", name);
                    }
                    else if (isArray(source)) {
                        output = _serializeArray(source, name);
                    }
                    else {
                        logger.throwInternal(LoggingSeverity.WARNING, _InternalMessageId.CannotSerializeObjectNonSerializable, "Attempting to serialize an object which does not implement ISerializable", { name: name }, true);
                        try {
                            // verify that the object can be stringified
                            getJSON().stringify(source);
                            output = source;
                        }
                        catch (e) {
                            // if serialization fails return an empty string
                            logger.throwInternal(LoggingSeverity.CRITICAL, _InternalMessageId.CannotSerializeObject, (e && isFunction(e.toString)) ? e.toString() : "Error serializing object", null, true);
                        }
                    }
                    return output;
                }
                source[circularReferenceCheck] = true;
                objForEachKey(source.aiDataContract, function (field, contract) {
                    var isRequired = (isFunction(contract)) ? (contract() & 1 /* Required */) : (contract & 1 /* Required */);
                    var isHidden = (isFunction(contract)) ? (contract() & 4 /* Hidden */) : (contract & 4 /* Hidden */);
                    var isArray = contract & 2 /* Array */;
                    var isPresent = source[field] !== undefined;
                    var isObj = isObject(source[field]) && source[field] !== null;
                    if (isRequired && !isPresent && !isArray) {
                        logger.throwInternal(LoggingSeverity.CRITICAL, _InternalMessageId.MissingRequiredFieldSpecification, "Missing required field specification. The field is required but not present on source", { field: field, name: name });
                        // If not in debug mode, continue and hope the error is permissible
                    }
                    else if (!isHidden) {
                        var value = void 0;
                        if (isObj) {
                            if (isArray) {
                                // special case; recurse on each object in the source array
                                value = _serializeArray(source[field], field);
                            }
                            else {
                                // recurse on the source object in this field
                                value = _serializeObject(source[field], field);
                            }
                        }
                        else {
                            // assign the source field to the output even if undefined or required
                            value = source[field];
                        }
                        // only emit this field if the value is defined
                        if (value !== undefined) {
                            output[field] = value;
                        }
                    }
                });
                delete source[circularReferenceCheck];
                return output;
            }
            function _serializeArray(sources, name) {
                var output;
                if (!!sources) {
                    if (!isArray(sources)) {
                        logger.throwInternal(LoggingSeverity.CRITICAL, _InternalMessageId.ItemNotInArray, "This field was specified as an array in the contract but the item is not an array.\r\n", { name: name }, true);
                    }
                    else {
                        output = [];
                        for (var i = 0; i < sources.length; i++) {
                            var source = sources[i];
                            var item = _serializeObject(source, name + "[" + i + "]");
                            output.push(item);
                        }
                    }
                }
                return output;
            }
            function _serializeStringMap(map, expectedType, name) {
                var output;
                if (map) {
                    output = {};
                    objForEachKey(map, function (field, value) {
                        if (expectedType === "string") {
                            if (value === undefined) {
                                output[field] = "undefined";
                            }
                            else if (value === null) {
                                output[field] = "null";
                            }
                            else if (!value.toString) {
                                output[field] = "invalid field: toString() is not defined.";
                            }
                            else {
                                output[field] = value.toString();
                            }
                        }
                        else if (expectedType === "number") {
                            if (value === undefined) {
                                output[field] = "undefined";
                            }
                            else if (value === null) {
                                output[field] = "null";
                            }
                            else {
                                var num = parseFloat(value);
                                if (isNaN(num)) {
                                    output[field] = "NaN";
                                }
                                else {
                                    output[field] = num;
                                }
                            }
                        }
                        else {
                            output[field] = "invalid field: " + name + " is of unknown type.";
                            logger.throwInternal(LoggingSeverity.CRITICAL, output[field], null, true);
                        }
                    });
                }
                return output;
            }
        });
    }
// Removed Stub for Serializer.prototype.serialize.
    return Serializer;
}());
export { Serializer };//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/fe719cd3e5825bf14e14182fddeb88ee8daf044f/node_modules/@microsoft/applicationinsights-channel-js/dist-esm/Serializer.js.map