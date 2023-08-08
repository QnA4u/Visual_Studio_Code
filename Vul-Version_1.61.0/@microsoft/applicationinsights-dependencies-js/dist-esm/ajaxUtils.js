/*
 * Application Insights JavaScript SDK - Dependencies Plugin, 2.6.4
 * Copyright (c) Microsoft and contributors. All rights reserved.
 */


import { isNullOrUndefined } from '@microsoft/applicationinsights-core-js';
export { EventHelper } from '@microsoft/applicationinsights-core-js';
var stringUtils = /** @class */ (function () {
    function stringUtils() {
    }
    stringUtils.GetLength = function (strObject) {
        var res = 0;
        if (!isNullOrUndefined(strObject)) {
            var stringified = "";
            try {
                stringified = strObject.toString();
            }
            catch (ex) {
                // some troubles with complex object
            }
            res = stringified.length;
            res = isNaN(res) ? 0 : res;
        }
        return res;
    };
    return stringUtils;
}());
export { stringUtils };//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/ee8c7def80afc00dd6e593ef12f37756d8f504ea/node_modules/@microsoft/applicationinsights-dependencies-js/dist-esm/ajaxUtils.js.map