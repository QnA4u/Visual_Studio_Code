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
export { DataPoint };//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/fe719cd3e5825bf14e14182fddeb88ee8daf044f/node_modules/@microsoft/applicationinsights-common/dist-esm/Interfaces/Contracts/Generated/DataPoint.js.map