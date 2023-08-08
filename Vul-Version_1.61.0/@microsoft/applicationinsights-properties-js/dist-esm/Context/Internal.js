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
export { Internal };//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/ee8c7def80afc00dd6e593ef12f37756d8f504ea/node_modules/@microsoft/applicationinsights-properties-js/dist-esm/Context/Internal.js.map