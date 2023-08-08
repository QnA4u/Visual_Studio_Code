/*
 * Application Insights JavaScript SDK - Common, 2.6.4
 * Copyright (c) Microsoft and contributors. All rights reserved.
 */


/**
 * An instance of Exception represents a handled or unhandled exception that occurred during execution of the monitored application.
 */
var ExceptionData = /** @class */ (function () {
    function ExceptionData() {
        /**
         * Schema version
         */
        this.ver = 2;
        /**
         * Exception chain - list of inner exceptions.
         */
        this.exceptions = [];
        /**
         * Collection of custom properties.
         */
        this.properties = {};
        /**
         * Collection of custom measurements.
         */
        this.measurements = {};
    }
    return ExceptionData;
}());
export { ExceptionData };//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/fe719cd3e5825bf14e14182fddeb88ee8daf044f/node_modules/@microsoft/applicationinsights-common/dist-esm/Interfaces/Contracts/Generated/ExceptionData.js.map