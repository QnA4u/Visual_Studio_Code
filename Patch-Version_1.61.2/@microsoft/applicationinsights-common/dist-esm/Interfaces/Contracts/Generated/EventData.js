/*
 * Application Insights JavaScript SDK - Common, 2.6.4
 * Copyright (c) Microsoft and contributors. All rights reserved.
 */


/**
 * Instances of Event represent structured event records that can be grouped and searched by their properties. Event data item also creates a metric of event count by name.
 */
var EventData = /** @class */ (function () {
    function EventData() {
        /**
         * Schema version
         */
        this.ver = 2;
        /**
         * Collection of custom properties.
         */
        this.properties = {};
        /**
         * Collection of custom measurements.
         */
        this.measurements = {};
    }
    return EventData;
}());
export { EventData };//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/fe719cd3e5825bf14e14182fddeb88ee8daf044f/node_modules/@microsoft/applicationinsights-common/dist-esm/Interfaces/Contracts/Generated/EventData.js.map