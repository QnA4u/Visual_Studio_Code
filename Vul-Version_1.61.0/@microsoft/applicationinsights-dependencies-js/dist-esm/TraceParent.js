/*
 * Application Insights JavaScript SDK - Dependencies Plugin, 2.6.4
 * Copyright (c) Microsoft and contributors. All rights reserved.
 */
import { generateW3CId } from '@microsoft/applicationinsights-core-js';
var Traceparent = /** @class */ (function () {
    function Traceparent(traceId, spanId) {
        var self = this;
        self.traceFlag = Traceparent.DEFAULT_TRACE_FLAG;
        self.version = Traceparent.DEFAULT_VERSION;
        if (traceId && Traceparent.isValidTraceId(traceId)) {
            self.traceId = traceId;
        }
        else {
            self.traceId = generateW3CId();
        }
        if (spanId && Traceparent.isValidSpanId(spanId)) {
            self.spanId = spanId;
        }
        else {
            self.spanId = generateW3CId().substr(0, 16);
        }
    }
    Traceparent.isValidTraceId = function (id) {
        return id.match(/^[0-9a-f]{32}$/) && id !== "00000000000000000000000000000000";
    };
    Traceparent.isValidSpanId = function (id) {
        return id.match(/^[0-9a-f]{16}$/) && id !== "0000000000000000";
    };
    Traceparent.prototype.toString = function () {
        var self = this;
        return self.version + "-" + self.traceId + "-" + self.spanId + "-" + self.traceFlag;
    };
    Traceparent.DEFAULT_TRACE_FLAG = "01";
    Traceparent.DEFAULT_VERSION = "00";
    return Traceparent;
}());
export { Traceparent };//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/ee8c7def80afc00dd6e593ef12f37756d8f504ea/node_modules/@microsoft/applicationinsights-dependencies-js/dist-esm/TraceParent.js.map