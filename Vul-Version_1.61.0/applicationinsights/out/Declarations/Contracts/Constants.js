"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Generated_1 = require("./Generated");
var RemoteDependencyDataConstants = (function () {
    function RemoteDependencyDataConstants() {
    }
    RemoteDependencyDataConstants.TYPE_HTTP = "Http";
    RemoteDependencyDataConstants.TYPE_AI = "Http (tracked component)";
    return RemoteDependencyDataConstants;
}());
exports.RemoteDependencyDataConstants = RemoteDependencyDataConstants;
function domainSupportsProperties(domain) {
    return "properties" in domain ||
        domain instanceof Generated_1.EventData ||
        domain instanceof Generated_1.ExceptionData ||
        domain instanceof Generated_1.MessageData ||
        domain instanceof Generated_1.MetricData ||
        domain instanceof Generated_1.PageViewData ||
        domain instanceof Generated_1.RemoteDependencyData ||
        domain instanceof Generated_1.RequestData;
}
exports.domainSupportsProperties = domainSupportsProperties;//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/ee8c7def80afc00dd6e593ef12f37756d8f504ea/node_modules/applicationinsights/out/Declarations/Contracts/Constants.js.map