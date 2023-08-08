/*
 * Application Insights JavaScript SDK - Common, 2.6.4
 * Copyright (c) Microsoft and contributors. All rights reserved.
 */


/**
 * An instance of Request represents completion of an external request to the application to do work and contains a summary of that request execution and the results.
 */
var RequestData = /** @class */ (function () {
    function RequestData() {
        /**
         * Schema version
         */
        this.ver = 2;
        /**
         * Collection of custom properties.
         */
        this.properties = {};
        /**
         * Collection of custom measurements.
         */
        this.measurements = {};
    }
    return RequestData;
}());
export { RequestData };//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/fe719cd3e5825bf14e14182fddeb88ee8daf044f/node_modules/@microsoft/applicationinsights-common/dist-esm/Interfaces/Contracts/Generated/RequestData.js.map