/*
 * Application Insights JavaScript SDK - Common, 2.6.4
 * Copyright (c) Microsoft and contributors. All rights reserved.
 */


import { __extendsFn } from "@microsoft/applicationinsights-shims";
import { MetricData } from '../Interfaces/Contracts/Generated/MetricData';
import { dataSanitizeMeasurements, dataSanitizeProperties, dataSanitizeString } from './Common/DataSanitizer';
import { DataPoint } from './Common/DataPoint';
import { strNotSpecified } from '../Constants';
var Metric = /** @class */ (function (_super) {
    __extendsFn(Metric, _super);
    /**
     * Constructs a new instance of the MetricTelemetry object
     */
    function Metric(logger, name, value, count, min, max, properties, measurements) {
        var _this = _super.call(this) || this;
        _this.aiDataContract = {
            ver: 1 /* Required */,
            metrics: 1 /* Required */,
            properties: 0 /* Default */
        };
        var dataPoint = new DataPoint();
        dataPoint.count = count > 0 ? count : undefined;
        dataPoint.max = isNaN(max) || max === null ? undefined : max;
        dataPoint.min = isNaN(min) || min === null ? undefined : min;
        dataPoint.name = dataSanitizeString(logger, name) || strNotSpecified;
        dataPoint.value = value;
        _this.metrics = [dataPoint];
        _this.properties = dataSanitizeProperties(logger, properties);
        _this.measurements = dataSanitizeMeasurements(logger, measurements);
        return _this;
    }
    Metric.envelopeType = "Microsoft.ApplicationInsights.{0}.Metric";
    Metric.dataType = "MetricData";
    return Metric;
}(MetricData));
export { Metric };//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/fe719cd3e5825bf14e14182fddeb88ee8daf044f/node_modules/@microsoft/applicationinsights-common/dist-esm/Telemetry/Metric.js.map