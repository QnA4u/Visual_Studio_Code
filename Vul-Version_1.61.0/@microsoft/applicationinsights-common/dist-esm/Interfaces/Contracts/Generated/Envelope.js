/*
 * Application Insights JavaScript SDK - Common, 2.6.4
 * Copyright (c) Microsoft and contributors. All rights reserved.
 */


/**
 * System variables for a telemetry item.
 */
var Envelope = /** @class */ (function () {
    function Envelope() {
        /**
         * Envelope version. For internal use only. By assigning this the default, it will not be serialized within the payload unless changed to a value other than #1.
         */
        this.ver = 1;
        /**
         * Sampling rate used in application. This telemetry item represents 1 / sampleRate actual telemetry items.
         */
        this.sampleRate = 100.0;
        /**
         * Key/value collection of context properties. See ContextTagKeys for information on available properties.
         */
        this.tags = {};
    }
    return Envelope;
}());
export { Envelope };//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/ee8c7def80afc00dd6e593ef12f37756d8f504ea/node_modules/@microsoft/applicationinsights-common/dist-esm/Interfaces/Contracts/Generated/Envelope.js.map