/*
 * Application Insights JavaScript SDK - Common, 2.6.4
 * Copyright (c) Microsoft and contributors. All rights reserved.
 */


/**
 * Instances of Message represent printf-like trace statements that are text-searched. Log4Net, NLog and other text-based log file entries are translated into intances of this type. The message does not have measurements.
 */
var MessageData = /** @class */ (function () {
    function MessageData() {
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
    return MessageData;
}());
export { MessageData };//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/ee8c7def80afc00dd6e593ef12f37756d8f504ea/node_modules/@microsoft/applicationinsights-common/dist-esm/Interfaces/Contracts/Generated/MessageData.js.map