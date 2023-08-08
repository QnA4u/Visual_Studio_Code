/*
 * Application Insights JavaScript SDK - Common, 2.6.4
 * Copyright (c) Microsoft and contributors. All rights reserved.
 */


import { DataPointType } from './DataPointType';
/**
 * Metric data single measurement.
 */
var DataPoint = /** @class */ (function () {
    function DataPoint() {
        /**
         * Metric type. Single measurement or the aggregated value.
         */
        this.kind = DataPointType.Measurement;
    }
    return DataPoint;
}());
export { DataPoint };