/*
 * Application Insights JavaScript SDK - Common, 2.6.4
 * Copyright (c) Microsoft and contributors. All rights reserved.
 */


import { DEFAULT_BREEZE_ENDPOINT } from "./Constants";
import { arrReduce, objKeys } from "@microsoft/applicationinsights-core-js";
var _FIELDS_SEPARATOR = ";";
var _FIELD_KEY_VALUE_SEPARATOR = "=";
export function parseConnectionString(connectionString) {
    if (!connectionString) {
        return {};
    }
    var kvPairs = connectionString.split(_FIELDS_SEPARATOR);
    var result = arrReduce(kvPairs, function (fields, kv) {
        var kvParts = kv.split(_FIELD_KEY_VALUE_SEPARATOR);
        if (kvParts.length === 2) {
            var key = kvParts[0].toLowerCase();
            var value = kvParts[1];
            fields[key] = value;
        }
        return fields;
    }, {});
    if (objKeys(result).length > 0) {
        // this is a valid connection string, so parse the results
        if (result.endpointsuffix) {
            // use endpoint suffix where overrides are not provided
            var locationPrefix = result.location ? result.location + "." : "";
            result.ingestionendpoint = result.ingestionendpoint || ("https://" + locationPrefix + "dc." + result.endpointsuffix);
        }
        // apply the default endpoints
        result.ingestionendpoint = result.ingestionendpoint || DEFAULT_BREEZE_ENDPOINT;
    }
    return result;
}
export var ConnectionStringParser = {
    parse: parseConnectionString
};//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/fe719cd3e5825bf14e14182fddeb88ee8daf044f/node_modules/@microsoft/applicationinsights-common/dist-esm/ConnectionStringParser.js.map