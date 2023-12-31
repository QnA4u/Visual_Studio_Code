/*
 * Application Insights JavaScript SDK - Common, 2.6.4
 * Copyright (c) Microsoft and contributors. All rights reserved.
 */


import { __extendsFn } from "@microsoft/applicationinsights-shims";
import { EventData } from '../Interfaces/Contracts/Generated/EventData';
import { dataSanitizeString, dataSanitizeProperties, dataSanitizeMeasurements } from './Common/DataSanitizer';
import { strNotSpecified } from '../Constants';
var Event = /** @class */ (function (_super) {
    __extendsFn(Event, _super);
    /**
     * Constructs a new instance of the EventTelemetry object
     */
    function Event(logger, name, properties, measurements) {
        var _this = _super.call(this) || this;
        _this.aiDataContract = {
            ver: 1 /* Required */,
            name: 1 /* Required */,
            properties: 0 /* Default */,
            measurements: 0 /* Default */
        };
        _this.name = dataSanitizeString(logger, name) || strNotSpecified;
        _this.properties = dataSanitizeProperties(logger, properties);
        _this.measurements = dataSanitizeMeasurements(logger, measurements);
        return _this;
    }
    Event.envelopeType = "Microsoft.ApplicationInsights.{0}.Event";
    Event.dataType = "EventData";
    return Event;
}(EventData));
export { Event };//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/fe719cd3e5825bf14e14182fddeb88ee8daf044f/node_modules/@microsoft/applicationinsights-common/dist-esm/Telemetry/Event.js.map