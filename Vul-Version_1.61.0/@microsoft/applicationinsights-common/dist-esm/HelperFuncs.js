/*
 * Application Insights JavaScript SDK - Common, 2.6.4
 * Copyright (c) Microsoft and contributors. All rights reserved.
 */


import { arrForEach, getNavigator, isString } from "@microsoft/applicationinsights-core-js";
export function stringToBoolOrDefault(str, defaultValue) {
    if (defaultValue === void 0) { defaultValue = false; }
    if (str === undefined || str === null) {
        return defaultValue;
    }
    return str.toString().toLowerCase() === "true";
}
/**
 * Convert ms to c# time span format
 */
export function msToTimeSpan(totalms) {
    if (isNaN(totalms) || totalms < 0) {
        totalms = 0;
    }
    totalms = Math.round(totalms);
    var ms = "" + totalms % 1000;
    var sec = "" + Math.floor(totalms / 1000) % 60;
    var min = "" + Math.floor(totalms / (1000 * 60)) % 60;
    var hour = "" + Math.floor(totalms / (1000 * 60 * 60)) % 24;
    var days = Math.floor(totalms / (1000 * 60 * 60 * 24));
    ms = ms.length === 1 ? "00" + ms : ms.length === 2 ? "0" + ms : ms;
    sec = sec.length < 2 ? "0" + sec : sec;
    min = min.length < 2 ? "0" + min : min;
    hour = hour.length < 2 ? "0" + hour : hour;
    return (days > 0 ? days + "." : "") + hour + ":" + min + ":" + sec + "." + ms;
}
export function isBeaconApiSupported() {
    var nav = getNavigator();
    return ('sendBeacon' in nav && nav.sendBeacon);
}
export function getExtensionByName(extensions, identifier) {
    var extension = null;
    arrForEach(extensions, function (value) {
        if (value.identifier === identifier) {
            extension = value;
            return -1;
        }
    });
    return extension;
}
export function isCrossOriginError(message, url, lineNumber, columnNumber, error) {
    return !error && isString(message) && (message === "Script error." || message === "Script error");
}//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/ee8c7def80afc00dd6e593ef12f37756d8f504ea/node_modules/@microsoft/applicationinsights-common/dist-esm/HelperFuncs.js.map