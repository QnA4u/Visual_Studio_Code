/*
 * Application Insights JavaScript SDK - Common, 2.6.4
 * Copyright (c) Microsoft and contributors. All rights reserved.
 */


import { __extendsFn } from "@microsoft/applicationinsights-shims";
import { DataPoint as AIDataPoint } from '../../Interfaces/Contracts/Generated/DataPoint';
var DataPoint = /** @class */ (function (_super) {
    __extendsFn(DataPoint, _super);
    function DataPoint() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /**
         * The data contract for serializing this object.
         */
        _this.aiDataContract = {
            name: 1 /* Required */,
            kind: 0 /* Default */,
            value: 1 /* Required */,
            count: 0 /* Default */,
            min: 0 /* Default */,
            max: 0 /* Default */,
            stdDev: 0 /* Default */
        };
        return _this;
    }
    return DataPoint;
}(AIDataPoint));
export { DataPoint };