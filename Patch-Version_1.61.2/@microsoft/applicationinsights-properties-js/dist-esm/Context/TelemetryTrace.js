/*
 * Application Insights JavaScript SDK - Properties Plugin, 2.6.4
 * Copyright (c) Microsoft and contributors. All rights reserved.
 */


import { dataSanitizeString } from '@microsoft/applicationinsights-common';
import { generateW3CId, getLocation } from '@microsoft/applicationinsights-core-js';
var TelemetryTrace = /** @class */ (function () {
    function TelemetryTrace(id, parentId, name, logger) {
        var _self = this;
        _self.traceID = id || generateW3CId();
        _self.parentID = parentId;
        _self.name = name;
        var location = getLocation();
        if (!name && location && location.pathname) {
            _self.name = location.pathname;
        }
        _self.name = dataSanitizeString(logger, _self.name);
    }
    return TelemetryTrace;
}());
export { TelemetryTrace };//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/fe719cd3e5825bf14e14182fddeb88ee8daf044f/node_modules/@microsoft/applicationinsights-properties-js/dist-esm/Context/TelemetryTrace.js.map