/*
 * Application Insights JavaScript SDK - Common, 2.6.4
 * Copyright (c) Microsoft and contributors. All rights reserved.
 */


import { __extendsFn } from "@microsoft/applicationinsights-shims";
import { PageViewData } from '../Interfaces/Contracts/Generated/PageViewData';
import { dataSanitizeId, dataSanitizeMeasurements, dataSanitizeProperties, dataSanitizeString, dataSanitizeUrl } from './Common/DataSanitizer';
import { msToTimeSpan } from '../HelperFuncs';
import { strNotSpecified } from '../Constants';
var PageView = /** @class */ (function (_super) {
    __extendsFn(PageView, _super);
    /**
     * Constructs a new instance of the PageEventTelemetry object
     */
    function PageView(logger, name, url, durationMs, properties, measurements, id) {
        var _this = _super.call(this) || this;
        _this.aiDataContract = {
            ver: 1 /* Required */,
            name: 0 /* Default */,
            url: 0 /* Default */,
            duration: 0 /* Default */,
            properties: 0 /* Default */,
            measurements: 0 /* Default */,
            id: 0 /* Default */
        };
        _this.id = dataSanitizeId(logger, id);
        _this.url = dataSanitizeUrl(logger, url);
        _this.name = dataSanitizeString(logger, name) || strNotSpecified;
        if (!isNaN(durationMs)) {
            _this.duration = msToTimeSpan(durationMs);
        }
        _this.properties = dataSanitizeProperties(logger, properties);
        _this.measurements = dataSanitizeMeasurements(logger, measurements);
        return _this;
    }
    PageView.envelopeType = "Microsoft.ApplicationInsights.{0}.Pageview";
    PageView.dataType = "PageviewData";
    return PageView;
}(PageViewData));
export { PageView };//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/fe719cd3e5825bf14e14182fddeb88ee8daf044f/node_modules/@microsoft/applicationinsights-common/dist-esm/Telemetry/PageView.js.map