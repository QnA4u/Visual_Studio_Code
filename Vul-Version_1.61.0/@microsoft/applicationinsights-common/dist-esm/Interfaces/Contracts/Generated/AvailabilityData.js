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
export { AvailabilityData };