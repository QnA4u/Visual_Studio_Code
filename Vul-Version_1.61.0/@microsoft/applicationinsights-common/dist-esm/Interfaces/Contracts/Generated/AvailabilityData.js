/*
 * Application Insights JavaScript SDK - Common, 2.6.4
 * Copyright (c) Microsoft and contributors. All rights reserved.
 */
"use strict";
/**
 * Instances of AvailabilityData represent the result of executing an availability test.
 */
var AvailabilityData = /** @class */ (function () {
    function AvailabilityData() {
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
    return AvailabilityData;
}());
export { AvailabilityData };//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/ee8c7def80afc00dd6e593ef12f37756d8f504ea/node_modules/@microsoft/applicationinsights-common/dist-esm/Interfaces/Contracts/Generated/AvailabilityData.js.map