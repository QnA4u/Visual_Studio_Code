/*
 * Application Insights JavaScript SDK - Common, 2.6.4
 * Copyright (c) Microsoft and contributors. All rights reserved.
 */


import { __extendsFn } from "@microsoft/applicationinsights-shims";
import { MessageData } from '../Interfaces/Contracts/Generated/MessageData';
import { dataSanitizeMessage, dataSanitizeProperties, dataSanitizeMeasurements } from './Common/DataSanitizer';
import { strNotSpecified } from '../Constants';
var Trace = /** @class */ (function (_super) {
    __extendsFn(Trace, _super);
    /**
     * Constructs a new instance of the TraceTelemetry object
     */
    function Trace(logger, message, severityLevel, properties, measurements) {
        var _this = _super.call(this) || this;
        _this.aiDataContract = {
            ver: 1 /* Required */,
            message: 1 /* Required */,
            severityLevel: 0 /* Default */,
            properties: 0 /* Default */
        };
        message = message || strNotSpecified;
        _this.message = dataSanitizeMessage(logger, message);
        _this.properties = dataSanitizeProperties(logger, properties);
        _this.measurements = dataSanitizeMeasurements(logger, measurements);
        if (severityLevel) {
            _this.severityLevel = severityLevel;
        }
        return _this;
    }
    Trace.envelopeType = "Microsoft.ApplicationInsights.{0}.Message";
    Trace.dataType = "MessageData";
    return Trace;
}(MessageData));
export { Trace };//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/ee8c7def80afc00dd6e593ef12f37756d8f504ea/node_modules/@microsoft/applicationinsights-common/dist-esm/Telemetry/Trace.js.map