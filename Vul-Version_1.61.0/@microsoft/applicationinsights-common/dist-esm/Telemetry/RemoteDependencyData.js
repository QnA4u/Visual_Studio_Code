/*
 * Application Insights JavaScript SDK - Common, 2.6.4
 * Copyright (c) Microsoft and contributors. All rights reserved.
 */


import { __extendsFn } from "@microsoft/applicationinsights-shims";
import { dataSanitizeMeasurements, dataSanitizeProperties, dataSanitizeString, dataSanitizeUrl } from './Common/DataSanitizer';
import { AjaxHelperParseDependencyPath } from '../Util';
import { RemoteDependencyData as GeneratedRemoteDependencyData } from '../Interfaces/Contracts/Generated/RemoteDependencyData';
import { msToTimeSpan } from '../HelperFuncs';
var RemoteDependencyData = /** @class */ (function (_super) {
    __extendsFn(RemoteDependencyData, _super);
    /**
     * Constructs a new instance of the RemoteDependencyData object
     */
    function RemoteDependencyData(logger, id, absoluteUrl, commandName, value, success, resultCode, method, requestAPI, correlationContext, properties, measurements) {
        if (requestAPI === void 0) { requestAPI = "Ajax"; }
        var _this = _super.call(this) || this;
        _this.aiDataContract = {
            id: 1 /* Required */,
            ver: 1 /* Required */,
            name: 0 /* Default */,
            resultCode: 0 /* Default */,
            duration: 0 /* Default */,
            success: 0 /* Default */,
            data: 0 /* Default */,
            target: 0 /* Default */,
            type: 0 /* Default */,
            properties: 0 /* Default */,
            measurements: 0 /* Default */,
            kind: 0 /* Default */,
            value: 0 /* Default */,
            count: 0 /* Default */,
            min: 0 /* Default */,
            max: 0 /* Default */,
            stdDev: 0 /* Default */,
            dependencyKind: 0 /* Default */,
            dependencySource: 0 /* Default */,
            commandName: 0 /* Default */,
            dependencyTypeName: 0 /* Default */
        };
        _this.id = id;
        _this.duration = msToTimeSpan(value);
        _this.success = success;
        _this.resultCode = resultCode + "";
        _this.type = dataSanitizeString(logger, requestAPI);
        var dependencyFields = AjaxHelperParseDependencyPath(logger, absoluteUrl, method, commandName);
        _this.data = dataSanitizeUrl(logger, commandName) || dependencyFields.data; // get a value from hosturl if commandName not available
        _this.target = dataSanitizeString(logger, dependencyFields.target);
        if (correlationContext) {
            _this.target = _this.target + " | " + correlationContext;
        }
        _this.name = dataSanitizeString(logger, dependencyFields.name);
        _this.properties = dataSanitizeProperties(logger, properties);
        _this.measurements = dataSanitizeMeasurements(logger, measurements);
        return _this;
    }
    RemoteDependencyData.envelopeType = "Microsoft.ApplicationInsights.{0}.RemoteDependency";
    RemoteDependencyData.dataType = "RemoteDependencyData";
    return RemoteDependencyData;
}(GeneratedRemoteDependencyData));
export { RemoteDependencyData };//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/ee8c7def80afc00dd6e593ef12f37756d8f504ea/node_modules/@microsoft/applicationinsights-common/dist-esm/Telemetry/RemoteDependencyData.js.map