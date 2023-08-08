"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
// THIS FILE WAS AUTOGENERATED
var Domain = require("./Domain");
"use strict";
/**
 * An instance of the Metric item is a list of measurements (single data points) and/or aggregations.
 */
var MetricData = (function (_super) {
    __extends(MetricData, _super);
    function MetricData() {
        var _this = _super.call(this) || this;
        _this.ver = 2;
        _this.metrics = [];
        _this.properties = {};
        return _this;
    }
    return MetricData;
}(Domain));
module.exports = MetricData;//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/ee8c7def80afc00dd6e593ef12f37756d8f504ea/node_modules/applicationinsights/out/Declarations/Contracts/Generated/MetricData.js.map