/*
 * Application Insights JavaScript SDK - Common, 2.6.4
 * Copyright (c) Microsoft and contributors. All rights reserved.
 */


import { __extendsFn } from "@microsoft/applicationinsights-shims";
import { PageViewPerfData } from '../Interfaces/Contracts/Generated/PageViewPerfData';
import { dataSanitizeMeasurements, dataSanitizeProperties, dataSanitizeString, dataSanitizeUrl } from './Common/DataSanitizer';
import { strNotSpecified } from '../Constants';
var PageViewPerformance = /** @class */ (function (_super) {
    __extendsFn(PageViewPerformance, _super);
    /**
     * Constructs a new instance of the PageEventTelemetry object
     */
    function PageViewPerformance(logger, name, url, unused, properties, measurements, cs4BaseData) {
        var _this = _super.call(this) || this;
        _this.aiDataContract = {
            ver: 1 /* Required */,
            name: 0 /* Default */,
            url: 0 /* Default */,
            duration: 0 /* Default */,
            perfTotal: 0 /* Default */,
            networkConnect: 0 /* Default */,
            sentRequest: 0 /* Default */,
            receivedResponse: 0 /* Default */,
            domProcessing: 0 /* Default */,
            properties: 0 /* Default */,
            measurements: 0 /* Default */
        };
        _this.url = dataSanitizeUrl(logger, url);
        _this.name = dataSanitizeString(logger, name) || strNotSpecified;
        _this.properties = dataSanitizeProperties(logger, properties);
        _this.measurements = dataSanitizeMeasurements(logger, measurements);
        if (cs4BaseData) {
            _this.domProcessing = cs4BaseData.domProcessing;
            _this.duration = cs4BaseData.duration;
            _this.networkConnect = cs4BaseData.networkConnect;
            _this.perfTotal = cs4BaseData.perfTotal;
            _this.receivedResponse = cs4BaseData.receivedResponse;
            _this.sentRequest = cs4BaseData.sentRequest;
        }
        return _this;
    }
    PageViewPerformance.envelopeType = "Microsoft.ApplicationInsights.{0}.PageviewPerformance";
    PageViewPerformance.dataType = "PageviewPerformanceData";
    return PageViewPerformance;
}(PageViewPerfData));
export { PageViewPerformance };//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/ee8c7def80afc00dd6e593ef12f37756d8f504ea/node_modules/@microsoft/applicationinsights-common/dist-esm/Telemetry/PageViewPerformance.js.map