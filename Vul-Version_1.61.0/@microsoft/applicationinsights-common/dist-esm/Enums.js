/*
 * Application Insights JavaScript SDK - Common, 2.6.4
 * Copyright (c) Microsoft and contributors. All rights reserved.
 */


/**
 * Type of storage to differentiate between local storage and session storage
 */
export var StorageType;
(function (StorageType) {
    StorageType[StorageType["LocalStorage"] = 0] = "LocalStorage";
    StorageType[StorageType["SessionStorage"] = 1] = "SessionStorage";
})(StorageType || (StorageType = {}));
;
export var DistributedTracingModes;
(function (DistributedTracingModes) {
    /**
     * (Default) Send Application Insights correlation headers
     */
    DistributedTracingModes[DistributedTracingModes["AI"] = 0] = "AI";
    /**
     * Send both W3C Trace Context headers and back-compatibility Application Insights headers
     */
    DistributedTracingModes[DistributedTracingModes["AI_AND_W3C"] = 1] = "AI_AND_W3C";
    /**
     * Send W3C Trace Context headers
     */
    DistributedTracingModes[DistributedTracingModes["W3C"] = 2] = "W3C";
})(DistributedTracingModes || (DistributedTracingModes = {}));//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/ee8c7def80afc00dd6e593ef12f37756d8f504ea/node_modules/@microsoft/applicationinsights-common/dist-esm/Enums.js.map