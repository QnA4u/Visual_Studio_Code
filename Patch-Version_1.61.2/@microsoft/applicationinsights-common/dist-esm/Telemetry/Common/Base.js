/*
 * Application Insights JavaScript SDK - Common, 2.6.4
 * Copyright (c) Microsoft and contributors. All rights reserved.
 */


import { __extendsFn } from "@microsoft/applicationinsights-shims";
import { Base as AIBase } from '../../Interfaces/Contracts/Generated/Base';
var Base = /** @class */ (function (_super) {
    __extendsFn(Base, _super);
    function Base() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /**
         * The data contract for serializing this object.
         */
        _this.aiDataContract = {};
        return _this;
    }
    return Base;
}(AIBase));
export { Base };//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/fe719cd3e5825bf14e14182fddeb88ee8daf044f/node_modules/@microsoft/applicationinsights-common/dist-esm/Telemetry/Common/Base.js.map