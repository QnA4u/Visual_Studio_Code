"use strict";
var Logging = (function () {
    function Logging() {
    }
    Logging.info = function (message) {
        var optionalParams = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            optionalParams[_i - 1] = arguments[_i];
        }
        if (Logging.enableDebug) {
            console.info(Logging.TAG + message, optionalParams);
        }
    };
    Logging.warn = function (message) {
        var optionalParams = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            optionalParams[_i - 1] = arguments[_i];
        }
        if (!Logging.disableWarnings) {
            console.warn(Logging.TAG + message, optionalParams);
        }
    };
    Logging.enableDebug = false;
    Logging.disableWarnings = false;
    Logging.TAG = "ApplicationInsights:";
    return Logging;
}());
module.exports = Logging;//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/fe719cd3e5825bf14e14182fddeb88ee8daf044f/node_modules/applicationinsights/out/Library/Logging.js.map