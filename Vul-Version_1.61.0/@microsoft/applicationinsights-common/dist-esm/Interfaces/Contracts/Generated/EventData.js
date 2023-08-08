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
export { EventData };