/*
 * Application Insights JavaScript SDK - Common, 2.6.4
 * Copyright (c) Microsoft and contributors. All rights reserved.
 */


/**
 * An instance of the Metric item is a list of measurements (single data points) and/or aggregations.
 */
var MetricData = /** @class */ (function () {
    function MetricData() {
        /**
         * Schema version
         */
        this.ver = 2;
        /**
         * List of metrics. Only one metric in the list is currently supported by Application Insights storage. If multiple data points were sent only the first one will be used.
         */
        this.metrics = [];
        /**
         * Collection of custom properties.
         */
        this.properties = {};
        /**
         * Collection of custom measurements.
         */
        this.measurements = {};
    }
    return MetricData;
}());
export { MetricData };//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/ee8c7def80afc00dd6e593ef12f37756d8f504ea/node_modules/@microsoft/applicationinsights-common/dist-esm/Interfaces/Contracts/Generated/MetricData.js.map