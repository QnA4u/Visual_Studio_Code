/*
 * Application Insights JavaScript SDK - Properties Plugin, 2.6.4
 * Copyright (c) Microsoft and contributors. All rights reserved.
 */


var Device = /** @class */ (function () {
    /**
     * Constructs a new instance of the Device class
     */
    function Device() {
        // don't attempt to fingerprint browsers
        this.id = "browser";
        // Device type is a dimension in our data platform
        // Setting it to 'Browser' allows to separate client and server dependencies/exceptions
        this.deviceClass = "Browser";
    }
    return Device;
}());
export { Device };//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/fe719cd3e5825bf14e14182fddeb88ee8daf044f/node_modules/@microsoft/applicationinsights-properties-js/dist-esm/Context/Device.js.map