/*
 * Application Insights JavaScript SDK - Properties Plugin, 2.6.4
 * Copyright (c) Microsoft and contributors. All rights reserved.
 */


var Version = "2.6.4";
var Internal = /** @class */ (function () {
    /**
     * Constructs a new instance of the internal telemetry data class.
     */
    function Internal(config) {
        this.sdkVersion = (config.sdkExtension && config.sdkExtension() ? config.sdkExtension() + "_" : "") + "javascript:" + Version;
    }
    return Internal;
}());
export { Internal };