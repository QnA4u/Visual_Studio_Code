// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ObjCreate, strShimFunction, strShimObject, strShimPrototype, strShimUndefined } from "./Constants";
/**
 * Returns the current global scope object, for a normal web page this will be the current
 * window, for a Web Worker this will be current worker global scope via "self". The internal
 * implementation returns the first available instance object in the following order
 * - globalThis (New standard)
 * - self (Will return the current window instance for supported browsers)
 * - window (fallback for older browser implementations)
 * - global (NodeJS standard)
 * - <null> (When all else fails)
 * While the return type is a Window for the normal case, not all environments will support all
 * of the properties or functions.
 */
export function getGlobal() {
    if (typeof globalThis !== strShimUndefined && globalThis) {
        return globalThis;
    }
    if (typeof self !== strShimUndefined && self) {
        return self;
    }
    if (typeof window !== strShimUndefined && window) {
        return window;
    }
    if (typeof global !== strShimUndefined && global) {
        return global;
    }
    return null;
}
export function throwTypeError(message) {
    throw new TypeError(message);
}
/**
 * Creates an object that has the specified prototype, and that optionally contains specified properties. This helper exists to avoid adding a polyfil
 * for older browsers that do not define Object.create eg. ES3 only, IE8 just in case any page checks for presence/absence of the prototype implementation.
 * Note: For consistency this will not use the Object.create implementation if it exists as this would cause a testing requirement to test with and without the implementations
 * @param obj Object to use as a prototype. May be null
 */
export function objCreateFn(obj) {
    var func = ObjCreate;
    // Use build in Object.create
    if (func) {
        // Use Object create method if it exists
        return func(obj);
    }
    if (obj == null) {
        return {};
    }
    var type = typeof obj;
    if (type !== strShimObject && type !== strShimFunction) {
        throwTypeError('Object prototype may only be an Object:' + obj);
    }
    function tmpFunc() { }
    tmpFunc[strShimPrototype] = obj;
    return new tmpFunc();
}//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/ee8c7def80afc00dd6e593ef12f37756d8f504ea/node_modules/@microsoft/applicationinsights-shims/dist-esm/Helpers.js.map