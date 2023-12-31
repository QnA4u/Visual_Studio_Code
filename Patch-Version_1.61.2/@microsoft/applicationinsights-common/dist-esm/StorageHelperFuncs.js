/*
 * Application Insights JavaScript SDK - Common, 2.6.4
 * Copyright (c) Microsoft and contributors. All rights reserved.
 */


import { dumpObj, getExceptionName, getGlobal, getGlobalInst, isNullOrUndefined, LoggingSeverity, objForEachKey, _InternalMessageId } from "@microsoft/applicationinsights-core-js";
import { StorageType } from "./Enums";
var _canUseLocalStorage = undefined;
var _canUseSessionStorage = undefined;
/**
 * Gets the localStorage object if available
 * @return {Storage} - Returns the storage object if available else returns null
 */
function _getLocalStorageObject() {
    if (utlCanUseLocalStorage()) {
        return _getVerifiedStorageObject(StorageType.LocalStorage);
    }
    return null;
}
/**
 * Tests storage object (localStorage or sessionStorage) to verify that it is usable
 * More details here: https://mathiasbynens.be/notes/localstorage-pattern
 * @param storageType Type of storage
 * @return {Storage} Returns storage object verified that it is usable
 */
function _getVerifiedStorageObject(storageType) {
    try {
        if (isNullOrUndefined(getGlobal())) {
            return null;
        }
        var uid = new Date;
        var storage = getGlobalInst(storageType === StorageType.LocalStorage ? "localStorage" : "sessionStorage");
        storage.setItem(uid.toString(), uid.toString());
        var fail = storage.getItem(uid.toString()) !== uid.toString();
        storage.removeItem(uid.toString());
        if (!fail) {
            return storage;
        }
    }
    catch (exception) {
        // eslint-disable-next-line no-empty
    }
    return null;
}
/**
 * Gets the sessionStorage object if available
 * @return {Storage} - Returns the storage object if available else returns null
 */
function _getSessionStorageObject() {
    if (utlCanUseSessionStorage()) {
        return _getVerifiedStorageObject(StorageType.SessionStorage);
    }
    return null;
}
export function utlDisableStorage() {
    _canUseLocalStorage = false;
    _canUseSessionStorage = false;
}
export function utlCanUseLocalStorage() {
    if (_canUseLocalStorage === undefined) {
        _canUseLocalStorage = !!_getVerifiedStorageObject(StorageType.LocalStorage);
    }
    return _canUseLocalStorage;
}
export function utlGetLocalStorage(logger, name) {
    var storage = _getLocalStorageObject();
    if (storage !== null) {
        try {
            return storage.getItem(name);
        }
        catch (e) {
            _canUseLocalStorage = false;
            logger.throwInternal(LoggingSeverity.WARNING, _InternalMessageId.BrowserCannotReadLocalStorage, "Browser failed read of local storage. " + getExceptionName(e), { exception: dumpObj(e) });
        }
    }
    return null;
}
export function utlSetLocalStorage(logger, name, data) {
    var storage = _getLocalStorageObject();
    if (storage !== null) {
        try {
            storage.setItem(name, data);
            return true;
        }
        catch (e) {
            _canUseLocalStorage = false;
            logger.throwInternal(LoggingSeverity.WARNING, _InternalMessageId.BrowserCannotWriteLocalStorage, "Browser failed write to local storage. " + getExceptionName(e), { exception: dumpObj(e) });
        }
    }
    return false;
}
export function utlRemoveStorage(logger, name) {
    var storage = _getLocalStorageObject();
    if (storage !== null) {
        try {
            storage.removeItem(name);
            return true;
        }
        catch (e) {
            _canUseLocalStorage = false;
            logger.throwInternal(LoggingSeverity.WARNING, _InternalMessageId.BrowserFailedRemovalFromLocalStorage, "Browser failed removal of local storage item. " + getExceptionName(e), { exception: dumpObj(e) });
        }
    }
    return false;
}
export function utlCanUseSessionStorage() {
    if (_canUseSessionStorage === undefined) {
        _canUseSessionStorage = !!_getVerifiedStorageObject(StorageType.SessionStorage);
    }
    return _canUseSessionStorage;
}
export function utlGetSessionStorageKeys() {
    var keys = [];
    if (utlCanUseSessionStorage()) {
        objForEachKey(getGlobalInst("sessionStorage"), function (key) {
            keys.push(key);
        });
    }
    return keys;
}
export function utlGetSessionStorage(logger, name) {
    var storage = _getSessionStorageObject();
    if (storage !== null) {
        try {
            return storage.getItem(name);
        }
        catch (e) {
            _canUseSessionStorage = false;
            logger.throwInternal(LoggingSeverity.WARNING, _InternalMessageId.BrowserCannotReadSessionStorage, "Browser failed read of session storage. " + getExceptionName(e), { exception: dumpObj(e) });
        }
    }
    return null;
}
export function utlSetSessionStorage(logger, name, data) {
    var storage = _getSessionStorageObject();
    if (storage !== null) {
        try {
            storage.setItem(name, data);
            return true;
        }
        catch (e) {
            _canUseSessionStorage = false;
            logger.throwInternal(LoggingSeverity.WARNING, _InternalMessageId.BrowserCannotWriteSessionStorage, "Browser failed write to session storage. " + getExceptionName(e), { exception: dumpObj(e) });
        }
    }
    return false;
}
export function utlRemoveSessionStorage(logger, name) {
    var storage = _getSessionStorageObject();
    if (storage !== null) {
        try {
            storage.removeItem(name);
            return true;
        }
        catch (e) {
            _canUseSessionStorage = false;
            logger.throwInternal(LoggingSeverity.WARNING, _InternalMessageId.BrowserFailedRemovalFromSessionStorage, "Browser failed removal of session storage item. " + getExceptionName(e), { exception: dumpObj(e) });
        }
    }
    return false;
}//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/fe719cd3e5825bf14e14182fddeb88ee8daf044f/node_modules/@microsoft/applicationinsights-common/dist-esm/StorageHelperFuncs.js.map