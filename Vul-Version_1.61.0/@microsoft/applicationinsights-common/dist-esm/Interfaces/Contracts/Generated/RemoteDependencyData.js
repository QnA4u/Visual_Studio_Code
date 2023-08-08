/*
 * Application Insights JavaScript SDK - Common, 2.6.4
 * Copyright (c) Microsoft and contributors. All rights reserved.
 */


/**
 * An instance of Remote Dependency represents an interaction of the monitored component with a remote component/service like SQL or an HTTP endpoint.
 */
var RemoteDependencyData = /** @class */ (function () {
    function RemoteDependencyData() {
        /**
         * Schema version
         */
        this.ver = 2;
        /**
         * Indication of successful or unsuccessful call.
         */
        this.success = true;
        /**
         * Collection of custom properties.
         */
        this.properties = {};
        /**
         * Collection of custom measurements.
         */
        this.measurements = {};
    }
    return RemoteDependencyData;
}());
export { RemoteDependencyData };