/*
 * Application Insights JavaScript SDK - Core, 2.6.4
 * Copyright (c) Microsoft and contributors. All rights reserved.
 */


"use strict";
import { objCreateFn, strShimUndefined } from "@microsoft/applicationinsights-shims";
import { _gblCookieMgr } from "./CookieMgr";
import { getWindow, getDocument, getPerformance, isIE } from "./EnvUtils";
import { arrForEach, arrIndexOf, arrMap, arrReduce, attachEvent, dateNow, detachEvent, hasOwnProperty, isArray, isBoolean, isDate, isError, isFunction, isNullOrUndefined, isNumber, isObject, isString, isTypeof, isUndefined, objDefineAccessors, objKeys, strTrim, toISOString } from "./HelperFuncs";
import { randomValue, random32, mwcRandomSeed, mwcRandom32 } from "./RandomHelper";
var _cookieMgrs = null;
var _canUseCookies; // legacy supported config
// Added to help with minfication
export var Undefined = strShimUndefined;
/**
 * Trys to add an event handler for the specified event to the window, body and document
 * @param eventName {string} - The name of the event
 * @param callback {any} - The callback function that needs to be executed for the given event
 * @return {boolean} - true if the handler was successfully added
 */
export function addEventHandler(eventName, callback) {
    var result = false;
    var w = getWindow();
    if (w) {
        result = attachEvent(w, eventName, callback);
        result = attachEvent(w["body"], eventName, callback) || result;
    }
    var doc = getDocument();
    if (doc) {
        result = EventHelper.Attach(doc, eventName, callback) || result;
    }
    return result;
}
export function newGuid() {
    function randomHexDigit() {
        return randomValue(15); // Get a random value from 0..15
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(GuidRegex, function (c) {
        var r = (randomHexDigit() | 0), v = (c === 'x' ? r : r & 0x3 | 0x8);
        return v.toString(16);
    });
}
/**
 * Return the current value of the Performance Api now() function (if available) and fallback to dateNow() if it is unavailable (IE9 or less)
 * https://caniuse.com/#search=performance.now
 */
export function perfNow() {
    var perf = getPerformance();
    if (perf && perf.now) {
        return perf.now();
    }
    return dateNow();
}
/**
 * Generate random base64 id string.
 * The default length is 22 which is 132-bits so almost the same as a GUID but as base64 (the previous default was 5)
 * @param maxLength - Optional value to specify the length of the id to be generated, defaults to 22
 */
export function newId(maxLength) {
    if (maxLength === void 0) { maxLength = 22; }
    var base64chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    // Start with an initial random number, consuming the value in reverse byte order
    var number = random32() >>> 0; // Make sure it's a +ve number
    var chars = 0;
    var result = "";
    while (result.length < maxLength) {
        chars++;
        result += base64chars.charAt(number & 0x3F);
        number >>>= 6; // Zero fill with right shift
        if (chars === 5) {
            // 5 base64 characters === 30 bits so we don't have enough bits for another base64 char
            // So add on another 30 bits and make sure it's +ve
            number = (((random32() << 2) & 0xFFFFFFFF) | (number & 0x03)) >>> 0;
            chars = 0; // We need to reset the number every 5 chars (30 bits)
        }
    }
    return result;
}
/**
 * The strEndsWith() method determines whether a string ends with the characters of a specified string, returning true or false as appropriate.
 * @param value - The value to check whether it ends with the search value.
 * @param search - The characters to be searched for at the end of the value.
 * @returns true if the given search value is found at the end of the string, otherwise false.
 */
export function strEndsWith(value, search) {
    if (value && search) {
        var len = value.length;
        var start = len - search.length;
        return value.substring(start >= 0 ? start : 0, len) === search;
    }
    return false;
}
/**
 * generate W3C trace id
 */
export function generateW3CId() {
    var hexValues = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f"];
    // rfc4122 version 4 UUID without dashes and with lowercase letters
    var oct = "", tmp;
    for (var a = 0; a < 4; a++) {
        tmp = random32();
        oct +=
            hexValues[tmp & 0xF] +
                hexValues[tmp >> 4 & 0xF] +
                hexValues[tmp >> 8 & 0xF] +
                hexValues[tmp >> 12 & 0xF] +
                hexValues[tmp >> 16 & 0xF] +
                hexValues[tmp >> 20 & 0xF] +
                hexValues[tmp >> 24 & 0xF] +
                hexValues[tmp >> 28 & 0xF];
    }
    // "Set the two most significant bits (bits 6 and 7) of the clock_seq_hi_and_reserved to zero and one, respectively"
    var clockSequenceHi = hexValues[8 + (random32() & 0x03) | 0];
    return oct.substr(0, 8) + oct.substr(9, 4) + "4" + oct.substr(13, 3) + clockSequenceHi + oct.substr(16, 3) + oct.substr(19, 12);
}
/**
 * Provides a collection of utility functions, included for backward compatibility with previous releases.
 * @deprecated Marking this instance as deprecated in favor of direct usage of the helper functions
 * as direct usage provides better tree-shaking and minification by avoiding the inclusion of the unused items
 * in your resulting code.
 */
export var CoreUtils = {
    _canUseCookies: undefined,
    isTypeof: isTypeof,
    isUndefined: isUndefined,
    isNullOrUndefined: isNullOrUndefined,
    hasOwnProperty: hasOwnProperty,
    isFunction: isFunction,
    isObject: isObject,
    isDate: isDate,
    isArray: isArray,
    isError: isError,
    isString: isString,
    isNumber: isNumber,
    isBoolean: isBoolean,
    toISOString: toISOString,
    arrForEach: arrForEach,
    arrIndexOf: arrIndexOf,
    arrMap: arrMap,
    arrReduce: arrReduce,
    strTrim: strTrim,
    objCreate: objCreateFn,
    objKeys: objKeys,
    objDefineAccessors: objDefineAccessors,
    addEventHandler: addEventHandler,
    dateNow: dateNow,
    isIE: isIE,
    disableCookies: disableCookies,
    newGuid: newGuid,
    perfNow: perfNow,
    newId: newId,
    randomValue: randomValue,
    random32: random32,
    mwcRandomSeed: mwcRandomSeed,
    mwcRandom32: mwcRandom32,
    generateW3CId: generateW3CId
};
var GuidRegex = /[xy]/g;
export var EventHelper = {
    Attach: attachEvent,
    AttachEvent: attachEvent,
    Detach: detachEvent,
    DetachEvent: detachEvent
};
/**
 * Helper to support backward compatibility for users that use the legacy cookie handling functions and the use the internal
 * CoreUtils._canUseCookies global flag to enable/disable cookies usage.
 * Note: This has the following deliberate side-effects
 * - Creates the global (legacy) cookie manager if it does not already exist
 * - Attempts to add "listeners" to the CoreUtils._canUseCookies property to support the legacy usage
 * @param config
 * @param logger
 * @returns
 */
export function _legacyCookieMgr(config, logger) {
    var cookieMgr = _gblCookieMgr(config, logger);
    var legacyCanUseCookies = CoreUtils._canUseCookies;
    if (_cookieMgrs === null) {
        _cookieMgrs = [];
        _canUseCookies = legacyCanUseCookies;
        // Dynamically create get/set property accessors for backward compatibility for enabling / disabling cookies
        // this WILL NOT work for ES3 browsers (< IE8)
        objDefineAccessors(CoreUtils, "_canUseCookies", function () {
            return _canUseCookies;
        }, function (value) {
            _canUseCookies = value;
            arrForEach(_cookieMgrs, function (mgr) {
                mgr.setEnabled(value);
            });
        });
    }
    if (arrIndexOf(_cookieMgrs, cookieMgr) === -1) {
        _cookieMgrs.push(cookieMgr);
    }
    if (isBoolean(legacyCanUseCookies)) {
        cookieMgr.setEnabled(legacyCanUseCookies);
    }
    if (isBoolean(_canUseCookies)) {
        cookieMgr.setEnabled(_canUseCookies);
    }
    return cookieMgr;
}
/**
 * @deprecated - Use the core.getCookieMgr().disable()
 * Force the SDK not to store and read any data from cookies.
 */
export function disableCookies() {
    _legacyCookieMgr().setEnabled(false);
}
/**
 * @deprecated - Use the core.getCookieMgr().isEnabled()
 * Helper method to tell if document.cookie object is available and whether it can be used.
 */
export function canUseCookies(logger) {
    return _legacyCookieMgr(null, logger).isEnabled();
}
/**
 * @deprecated - Use the core.getCookieMgr().get()
 * helper method to access userId and sessionId cookie
 */
export function getCookie(logger, name) {
    return _legacyCookieMgr(null, logger).get(name);
}
/**
 * @deprecated - Use the core.getCookieMgr().set()
 * helper method to set userId and sessionId cookie
 */
export function setCookie(logger, name, value, domain) {
    _legacyCookieMgr(null, logger).set(name, value, null, domain);
}
/**
 * @deprecated - Use the core.getCookieMgr().del()
 * Deletes a cookie by setting it's expiration time in the past.
 * @param name - The name of the cookie to delete.
 */
export function deleteCookie(logger, name) {
    return _legacyCookieMgr(null, logger).del(name);
}//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/ee8c7def80afc00dd6e593ef12f37756d8f504ea/node_modules/@microsoft/applicationinsights-core-js/dist-esm/JavaScriptSDK/CoreUtils.js.map