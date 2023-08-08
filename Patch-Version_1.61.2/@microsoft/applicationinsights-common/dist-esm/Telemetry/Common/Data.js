/*
 * Application Insights JavaScript SDK - Common, 2.6.4
 * Copyright (c) Microsoft and contributors. All rights reserved.
 */


import { __extendsFn } from "@microsoft/applicationinsights-shims";
import { Data as AIData } from '../../Interfaces/Contracts/Generated/Data';
var Data = /** @class */ (function (_super) {
    __extendsFn(Data, _super);
    /**
     * Constructs a new instance of telemetry data.
     */
    function Data(baseType, data) {
        var _this = _super.call(this) || this;
        /**
         * The data contract for serializing this object.
         */
        _this.aiDataContract = {
            baseType: 1 /* Required */,
            baseData: 1 /* Required */
        };
        _this.baseType = baseType;
        _this.baseData = data;
        return _this;
    }
    return Data;
}(AIData));
export { Data };