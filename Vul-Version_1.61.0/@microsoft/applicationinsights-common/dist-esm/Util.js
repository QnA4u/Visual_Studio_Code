/*
 * Application Insights JavaScript SDK - Common, 2.6.4
 * Copyright (c) Microsoft and contributors. All rights reserved.
 */


import { getPerformance, getExceptionName as coreGetExceptionName, dumpObj, isNullOrUndefined, strTrim, random32, isArray, isError, isDate, newId, generateW3CId, toISOString, arrForEach, getIEVersion, attachEvent, dateNow, uaDisallowsSameSiteNone, disableCookies as coreDisableCookies, canUseCookies as coreCanUseCookies, getCookie as coreGetCookie, setCookie as coreSetCookie, deleteCookie as coreDeleteCookie } from "@microsoft/applicationinsights-core-js";
import { RequestHeaders } from "./RequestResponseHeaders";
import { dataSanitizeString } from "./Telemetry/Common/DataSanitizer";
import { createDomEvent } from './DomHelperFuncs';
import { stringToBoolOrDefault, msToTimeSpan, isBeaconApiSupported, isCrossOriginError, getExtensionByName } from "./HelperFuncs";
import { strNotSpecified } from "./Constants";
import { utlCanUseLocalStorage, utlCanUseSessionStorage, utlDisableStorage, utlGetSessionStorage, utlGetSessionStorageKeys, utlGetLocalStorage, utlRemoveSessionStorage, utlRemoveStorage, utlSetSessionStorage, utlSetLocalStorage } from "./StorageHelperFuncs";
import { urlGetAbsoluteUrl, urlGetCompleteUrl, urlGetPathName, urlParseFullHost, urlParseHost, urlParseUrl } from "./UrlHelperFuncs";
// listing only non-geo specific locations
var _internalEndpoints = [
    "https://dc.services.visualstudio.com/v2/track",
    "https://breeze.aimon.applicationinsights.io/v2/track",
    "https://dc-int.services.visualstudio.com/v2/track"
];
export function isInternalApplicationInsightsEndpoint(endpointUrl) {
    return _internalEndpoints.indexOf(endpointUrl.toLowerCase()) !== -1;
}
export var Util = {
    NotSpecified: strNotSpecified,
    createDomEvent: createDomEvent,
    disableStorage: utlDisableStorage,
    isInternalApplicationInsightsEndpoint: isInternalApplicationInsightsEndpoint,
    canUseLocalStorage: utlCanUseLocalStorage,
    getStorage: utlGetLocalStorage,
    setStorage: utlSetLocalStorage,
    removeStorage: utlRemoveStorage,
    canUseSessionStorage: utlCanUseSessionStorage,
    getSessionStorageKeys: utlGetSessionStorageKeys,
    getSessionStorage: utlGetSessionStorage,
    setSessionStorage: utlSetSessionStorage,
    removeSessionStorage: utlRemoveSessionStorage,
    disableCookies: coreDisableCookies,
    canUseCookies: coreCanUseCookies,
    disallowsSameSiteNone: uaDisallowsSameSiteNone,
    setCookie: coreSetCookie,
    stringToBoolOrDefault: stringToBoolOrDefault,
    getCookie: coreGetCookie,
    deleteCookie: coreDeleteCookie,
    trim: strTrim,
    newId: newId,
    random32: function () {
        return random32(true);
    },
    generateW3CId: generateW3CId,
    isArray: isArray,
    isError: isError,
    isDate: isDate,
    toISOStringForIE8: toISOString,
    getIEVersion: getIEVersion,
    msToTimeSpan: msToTimeSpan,
    isCrossOriginError: isCrossOriginError,
    dump: dumpObj,
    getExceptionName: coreGetExceptionName,
    addEventHandler: attachEvent,
    IsBeaconApiSupported: isBeaconApiSupported,
    getExtension: getExtensionByName
};
;
export var UrlHelper = {
    parseUrl: urlParseUrl,
    getAbsoluteUrl: urlGetAbsoluteUrl,
    getPathName: urlGetPathName,
    getCompleteUrl: urlGetCompleteUrl,
    parseHost: urlParseHost,
    parseFullHost: urlParseFullHost
};
export var CorrelationIdHelper = {
    correlationIdPrefix: "cid-v1:",
    /**
     * Checks if a request url is not on a excluded domain list and if it is safe to add correlation headers.
     * Headers are always included if the current domain matches the request domain. If they do not match (CORS),
     * they are regex-ed across correlationHeaderDomains and correlationHeaderExcludedDomains to determine if headers are included.
     * Some environments don't give information on currentHost via window.location.host (e.g. Cordova). In these cases, the user must
     * manually supply domains to include correlation headers on. Else, no headers will be included at all.
     */
    canIncludeCorrelationHeader: function (config, requestUrl, currentHost) {
        if (!requestUrl || (config && config.disableCorrelationHeaders)) {
            return false;
        }
        if (config && config.correlationHeaderExcludePatterns) {
            for (var i = 0; i < config.correlationHeaderExcludePatterns.length; i++) {
                if (config.correlationHeaderExcludePatterns[i].test(requestUrl)) {
                    return false;
                }
            }
        }
        var requestHost = urlParseUrl(requestUrl).host.toLowerCase();
        if (requestHost && (requestHost.indexOf(":443") !== -1 || requestHost.indexOf(":80") !== -1)) {
            // [Bug #1260] IE can include the port even for http and https URLs so if present 
            // try and parse it to remove if it matches the default protocol port
            requestHost = (urlParseFullHost(requestUrl, true) || "").toLowerCase();
        }
        if ((!config || !config.enableCorsCorrelation) && (requestHost && requestHost !== currentHost)) {
            return false;
        }
        var includedDomains = config && config.correlationHeaderDomains;
        if (includedDomains) {
            var matchExists_1;
            arrForEach(includedDomains, function (domain) {
                var regex = new RegExp(domain.toLowerCase().replace(/\\/g, "\\\\").replace(/\./g, "\\.").replace(/\*/g, ".*"));
                matchExists_1 = matchExists_1 || regex.test(requestHost);
            });
            if (!matchExists_1) {
                return false;
            }
        }
        var excludedDomains = config && config.correlationHeaderExcludedDomains;
        if (!excludedDomains || excludedDomains.length === 0) {
            return true;
        }
        for (var i = 0; i < excludedDomains.length; i++) {
            var regex = new RegExp(excludedDomains[i].toLowerCase().replace(/\\/g, "\\\\").replace(/\./g, "\\.").replace(/\*/g, ".*"));
            if (regex.test(requestHost)) {
                return false;
            }
        }
        // if we don't know anything about the requestHost, require the user to use included/excludedDomains.
        // Previously we always returned false for a falsy requestHost
        return requestHost && requestHost.length > 0;
    },
    /**
     * Combines target appId and target role name from response header.
     */
    getCorrelationContext: function (responseHeader) {
        if (responseHeader) {
            var correlationId = CorrelationIdHelper.getCorrelationContextValue(responseHeader, RequestHeaders.requestContextTargetKey);
            if (correlationId && correlationId !== CorrelationIdHelper.correlationIdPrefix) {
                return correlationId;
            }
        }
    },
    /**
     * Gets key from correlation response header
     */
    getCorrelationContextValue: function (responseHeader, key) {
        if (responseHeader) {
            var keyValues = responseHeader.split(",");
            for (var i = 0; i < keyValues.length; ++i) {
                var keyValue = keyValues[i].split("=");
                if (keyValue.length === 2 && keyValue[0] === key) {
                    return keyValue[1];
                }
            }
        }
    }
};
export function AjaxHelperParseDependencyPath(logger, absoluteUrl, method, commandName) {
    var target, name = commandName, data = commandName;
    if (absoluteUrl && absoluteUrl.length > 0) {
        var parsedUrl = urlParseUrl(absoluteUrl);
        target = parsedUrl.host;
        if (!name) {
            if (parsedUrl.pathname != null) {
                var pathName = (parsedUrl.pathname.length === 0) ? "/" : parsedUrl.pathname;
                if (pathName.charAt(0) !== '/') {
                    pathName = "/" + pathName;
                }
                data = parsedUrl.pathname;
                name = dataSanitizeString(logger, method ? method + " " + pathName : pathName);
            }
            else {
                name = dataSanitizeString(logger, absoluteUrl);
            }
        }
    }
    else {
        target = commandName;
        name = commandName;
    }
    return {
        target: target,
        name: name,
        data: data
    };
}
export function dateTimeUtilsNow() {
    // returns the window or webworker performance object
    var perf = getPerformance();
    if (perf && perf.now && perf.timing) {
        var now = perf.now() + perf.timing.navigationStart;
        // Known issue with IE where this calculation can be negative, so if it is then ignore and fallback
        if (now > 0) {
            return now;
        }
    }
    return dateNow();
}
export function dateTimeUtilsDuration(start, end) {
    var result = null;
    if (start !== 0 && end !== 0 && !isNullOrUndefined(start) && !isNullOrUndefined(end)) {
        result = end - start;
    }
    return result;
}
/**
 * A utility class that helps getting time related parameters
 */
export var DateTimeUtils = {
    Now: dateTimeUtilsNow,
    GetDuration: dateTimeUtilsDuration
};//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/ee8c7def80afc00dd6e593ef12f37756d8f504ea/node_modules/@microsoft/applicationinsights-common/dist-esm/Util.js.map