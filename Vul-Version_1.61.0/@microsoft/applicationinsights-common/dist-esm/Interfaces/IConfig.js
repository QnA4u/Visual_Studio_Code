/*
 * Application Insights JavaScript SDK - Common, 2.6.4
 * Copyright (c) Microsoft and contributors. All rights reserved.
 */


import { isNullOrUndefined } from '@microsoft/applicationinsights-core-js';
var ConfigurationManager = /** @class */ (function () {
    function ConfigurationManager() {
    }
    ConfigurationManager.getConfig = function (config, field, identifier, defaultValue) {
        if (defaultValue === void 0) { defaultValue = false; }
        var configValue;
        if (identifier && config.extensionConfig && config.extensionConfig[identifier] && !isNullOrUndefined(config.extensionConfig[identifier][field])) {
            configValue = config.extensionConfig[identifier][field];
        }
        else {
            configValue = config[field];
        }
        return !isNullOrUndefined(configValue) ? configValue : defaultValue;
    };
    return ConfigurationManager;
}());
export { ConfigurationManager };//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/ee8c7def80afc00dd6e593ef12f37756d8f504ea/node_modules/@microsoft/applicationinsights-common/dist-esm/Interfaces/IConfig.js.map