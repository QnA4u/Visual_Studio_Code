/*!
 * Application Insights JavaScript SDK - Channel, 2.6.4
 * Copyright (c) Microsoft and contributors. All rights reserved.
 */
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory((global.Microsoft = global.Microsoft || {}, global.Microsoft.ApplicationInsights = global.Microsoft.ApplicationInsights || {})));
}(this, (function (exports) { 'use strict';

    var strShimFunction = "function";
    var strShimObject = "object";
    var strShimUndefined = "undefined";
    var strShimPrototype = "prototype";
    var strShimHasOwnProperty = "hasOwnProperty";
    var ObjClass = Object;
    var ObjProto = ObjClass[strShimPrototype];
    var ObjAssign = ObjClass["assign"];
    var ObjCreate = ObjClass["create"];
    var ObjDefineProperty = ObjClass["defineProperty"];
    var ObjHasOwnProperty = ObjProto[strShimHasOwnProperty];

    function getGlobal() {
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
    function throwTypeError(message) {
        throw new TypeError(message);
    }
    function objCreateFn(obj) {
        var func = ObjCreate;
        if (func) {
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
    }

    (getGlobal() || {})["Symbol"];
    (getGlobal() || {})["Reflect"];
    var __objAssignFnImpl = function (t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) {
                if (ObjProto[strShimHasOwnProperty].call(s, p)) {
                    t[p] = s[p];
                }
            }
        }
        return t;
    };
    var __assignFn = ObjAssign || __objAssignFnImpl;
    var extendStaticsFn = function (d, b) {
        extendStaticsFn = ObjClass["setPrototypeOf"] ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) {
                for (var p in b) {
                    if (b[strShimHasOwnProperty](p)) {
                        d[p] = b[p];
                    }
                }
            };
        return extendStaticsFn(d, b);
    };
    function __extendsFn(d, b) {
        if (typeof b !== strShimFunction && b !== null) {
            throwTypeError("Class extends value " + String(b) + " is not a constructor or null");
        }
        extendStaticsFn(d, b);
        function __() { this.constructor = d; }
        d[strShimPrototype] = b === null ? objCreateFn(b) : (__[strShimPrototype] = b[strShimPrototype], new __());
    }

    /*!
     * Microsoft Dynamic Proto Utility, 1.1.4
     * Copyright (c) Microsoft and contributors. All rights reserved.
     */
    var Constructor = 'constructor';
    var Prototype = 'prototype';
    var strFunction = 'function';
    var DynInstFuncTable = '_dynInstFuncs';
    var DynProxyTag = '_isDynProxy';
    var DynClassName = '_dynClass';
    var DynClassNamePrefix = '_dynCls$';
    var DynInstChkTag = '_dynInstChk';
    var DynAllowInstChkTag = DynInstChkTag;
    var DynProtoDefaultOptions = '_dfOpts';
    var UnknownValue = '_unknown_';
    var str__Proto = "__proto__";
    var strUseBaseInst = 'useBaseInst';
    var strSetInstFuncs = 'setInstFuncs';
    var Obj = Object;
    var _objGetPrototypeOf = Obj["getPrototypeOf"];
    var _dynamicNames = 0;
    function _hasOwnProperty(obj, prop) {
        return obj && Obj[Prototype].hasOwnProperty.call(obj, prop);
    }
    function _isObjectOrArrayPrototype(target) {
        return target && (target === Obj[Prototype] || target === Array[Prototype]);
    }
    function _isObjectArrayOrFunctionPrototype(target) {
        return _isObjectOrArrayPrototype(target) || target === Function[Prototype];
    }
    function _getObjProto(target) {
        if (target) {
            if (_objGetPrototypeOf) {
                return _objGetPrototypeOf(target);
            }
            var newProto = target[str__Proto] || target[Prototype] || (target[Constructor] ? target[Constructor][Prototype] : null);
            if (newProto) {
                return newProto;
            }
        }
        return null;
    }
    function _forEachProp(target, func) {
        var props = [];
        var getOwnProps = Obj["getOwnPropertyNames"];
        if (getOwnProps) {
            props = getOwnProps(target);
        }
        else {
            for (var name_1 in target) {
                if (typeof name_1 === "string" && _hasOwnProperty(target, name_1)) {
                    props.push(name_1);
                }
            }
        }
        if (props && props.length > 0) {
            for (var lp = 0; lp < props.length; lp++) {
                func(props[lp]);
            }
        }
    }
    function _isDynamicCandidate(target, funcName, skipOwn) {
        return (funcName !== Constructor && typeof target[funcName] === strFunction && (skipOwn || _hasOwnProperty(target, funcName)));
    }
    function _throwTypeError(message) {
        throw new TypeError("DynamicProto: " + message);
    }
    function _getInstanceFuncs(thisTarget) {
        var instFuncs = {};
        _forEachProp(thisTarget, function (name) {
            if (!instFuncs[name] && _isDynamicCandidate(thisTarget, name, false)) {
                instFuncs[name] = thisTarget[name];
            }
        });
        return instFuncs;
    }
    function _hasVisited(values, value) {
        for (var lp = values.length - 1; lp >= 0; lp--) {
            if (values[lp] === value) {
                return true;
            }
        }
        return false;
    }
    function _getBaseFuncs(classProto, thisTarget, instFuncs, useBaseInst) {
        function _instFuncProxy(target, funcHost, funcName) {
            var theFunc = funcHost[funcName];
            if (theFunc[DynProxyTag] && useBaseInst) {
                var instFuncTable = target[DynInstFuncTable] || {};
                if (instFuncTable[DynAllowInstChkTag] !== false) {
                    theFunc = (instFuncTable[funcHost[DynClassName]] || {})[funcName] || theFunc;
                }
            }
            return function () {
                return theFunc.apply(target, arguments);
            };
        }
        var baseFuncs = {};
        _forEachProp(instFuncs, function (name) {
            baseFuncs[name] = _instFuncProxy(thisTarget, instFuncs, name);
        });
        var baseProto = _getObjProto(classProto);
        var visited = [];
        while (baseProto && !_isObjectArrayOrFunctionPrototype(baseProto) && !_hasVisited(visited, baseProto)) {
            _forEachProp(baseProto, function (name) {
                if (!baseFuncs[name] && _isDynamicCandidate(baseProto, name, !_objGetPrototypeOf)) {
                    baseFuncs[name] = _instFuncProxy(thisTarget, baseProto, name);
                }
            });
            visited.push(baseProto);
            baseProto = _getObjProto(baseProto);
        }
        return baseFuncs;
    }
    function _getInstFunc(target, funcName, proto, currentDynProtoProxy) {
        var instFunc = null;
        if (target && _hasOwnProperty(proto, DynClassName)) {
            var instFuncTable = target[DynInstFuncTable] || {};
            instFunc = (instFuncTable[proto[DynClassName]] || {})[funcName];
            if (!instFunc) {
                _throwTypeError("Missing [" + funcName + "] " + strFunction);
            }
            if (!instFunc[DynInstChkTag] && instFuncTable[DynAllowInstChkTag] !== false) {
                var canAddInst = !_hasOwnProperty(target, funcName);
                var objProto = _getObjProto(target);
                var visited = [];
                while (canAddInst && objProto && !_isObjectArrayOrFunctionPrototype(objProto) && !_hasVisited(visited, objProto)) {
                    var protoFunc = objProto[funcName];
                    if (protoFunc) {
                        canAddInst = (protoFunc === currentDynProtoProxy);
                        break;
                    }
                    visited.push(objProto);
                    objProto = _getObjProto(objProto);
                }
                try {
                    if (canAddInst) {
                        target[funcName] = instFunc;
                    }
                    instFunc[DynInstChkTag] = 1;
                }
                catch (e) {
                    instFuncTable[DynAllowInstChkTag] = false;
                }
            }
        }
        return instFunc;
    }
    function _getProtoFunc(funcName, proto, currentDynProtoProxy) {
        var protoFunc = proto[funcName];
        if (protoFunc === currentDynProtoProxy) {
            protoFunc = _getObjProto(proto)[funcName];
        }
        if (typeof protoFunc !== strFunction) {
            _throwTypeError("[" + funcName + "] is not a " + strFunction);
        }
        return protoFunc;
    }
    function _populatePrototype(proto, className, target, baseInstFuncs, setInstanceFunc) {
        function _createDynamicPrototype(proto, funcName) {
            var dynProtoProxy = function () {
                var instFunc = _getInstFunc(this, funcName, proto, dynProtoProxy) || _getProtoFunc(funcName, proto, dynProtoProxy);
                return instFunc.apply(this, arguments);
            };
            dynProtoProxy[DynProxyTag] = 1;
            return dynProtoProxy;
        }
        if (!_isObjectOrArrayPrototype(proto)) {
            var instFuncTable = target[DynInstFuncTable] = target[DynInstFuncTable] || {};
            var instFuncs_1 = instFuncTable[className] = (instFuncTable[className] || {});
            if (instFuncTable[DynAllowInstChkTag] !== false) {
                instFuncTable[DynAllowInstChkTag] = !!setInstanceFunc;
            }
            _forEachProp(target, function (name) {
                if (_isDynamicCandidate(target, name, false) && target[name] !== baseInstFuncs[name]) {
                    instFuncs_1[name] = target[name];
                    delete target[name];
                    if (!_hasOwnProperty(proto, name) || (proto[name] && !proto[name][DynProxyTag])) {
                        proto[name] = _createDynamicPrototype(proto, name);
                    }
                }
            });
        }
    }
    function _checkPrototype(classProto, thisTarget) {
        if (_objGetPrototypeOf) {
            var visited = [];
            var thisProto = _getObjProto(thisTarget);
            while (thisProto && !_isObjectArrayOrFunctionPrototype(thisProto) && !_hasVisited(visited, thisProto)) {
                if (thisProto === classProto) {
                    return true;
                }
                visited.push(thisProto);
                thisProto = _getObjProto(thisProto);
            }
        }
        return false;
    }
    function _getObjName(target, unknownValue) {
        if (_hasOwnProperty(target, Prototype)) {
            return target.name || unknownValue || UnknownValue;
        }
        return (((target || {})[Constructor]) || {}).name || unknownValue || UnknownValue;
    }
    function dynamicProto(theClass, target, delegateFunc, options) {
        if (!_hasOwnProperty(theClass, Prototype)) {
            _throwTypeError("theClass is an invalid class definition.");
        }
        var classProto = theClass[Prototype];
        if (!_checkPrototype(classProto, target)) {
            _throwTypeError("[" + _getObjName(theClass) + "] is not in class hierarchy of [" + _getObjName(target) + "]");
        }
        var className = null;
        if (_hasOwnProperty(classProto, DynClassName)) {
            className = classProto[DynClassName];
        }
        else {
            className = DynClassNamePrefix + _getObjName(theClass, "_") + "$" + _dynamicNames;
            _dynamicNames++;
            classProto[DynClassName] = className;
        }
        var perfOptions = dynamicProto[DynProtoDefaultOptions];
        var useBaseInst = !!perfOptions[strUseBaseInst];
        if (useBaseInst && options && options[strUseBaseInst] !== undefined) {
            useBaseInst = !!options[strUseBaseInst];
        }
        var instFuncs = _getInstanceFuncs(target);
        var baseFuncs = _getBaseFuncs(classProto, target, instFuncs, useBaseInst);
        delegateFunc(target, baseFuncs);
        var setInstanceFunc = !!_objGetPrototypeOf && !!perfOptions[strSetInstFuncs];
        if (setInstanceFunc && options) {
            setInstanceFunc = !!options[strSetInstFuncs];
        }
        _populatePrototype(classProto, className, target, instFuncs, setInstanceFunc !== false);
    }
    var perfDefaults = {
        setInstFuncs: true,
        useBaseInst: true
    };
    dynamicProto[DynProtoDefaultOptions] = perfDefaults;

    var LoggingSeverity;
    (function (LoggingSeverity) {
        LoggingSeverity[LoggingSeverity["CRITICAL"] = 1] = "CRITICAL";
        LoggingSeverity[LoggingSeverity["WARNING"] = 2] = "WARNING";
    })(LoggingSeverity || (LoggingSeverity = {}));
    var _InternalMessageId = {
        BrowserDoesNotSupportLocalStorage: 0,
        BrowserCannotReadLocalStorage: 1,
        BrowserCannotReadSessionStorage: 2,
        BrowserCannotWriteLocalStorage: 3,
        BrowserCannotWriteSessionStorage: 4,
        BrowserFailedRemovalFromLocalStorage: 5,
        BrowserFailedRemovalFromSessionStorage: 6,
        CannotSendEmptyTelemetry: 7,
        ClientPerformanceMathError: 8,
        ErrorParsingAISessionCookie: 9,
        ErrorPVCalc: 10,
        ExceptionWhileLoggingError: 11,
        FailedAddingTelemetryToBuffer: 12,
        FailedMonitorAjaxAbort: 13,
        FailedMonitorAjaxDur: 14,
        FailedMonitorAjaxOpen: 15,
        FailedMonitorAjaxRSC: 16,
        FailedMonitorAjaxSend: 17,
        FailedMonitorAjaxGetCorrelationHeader: 18,
        FailedToAddHandlerForOnBeforeUnload: 19,
        FailedToSendQueuedTelemetry: 20,
        FailedToReportDataLoss: 21,
        FlushFailed: 22,
        MessageLimitPerPVExceeded: 23,
        MissingRequiredFieldSpecification: 24,
        NavigationTimingNotSupported: 25,
        OnError: 26,
        SessionRenewalDateIsZero: 27,
        SenderNotInitialized: 28,
        StartTrackEventFailed: 29,
        StopTrackEventFailed: 30,
        StartTrackFailed: 31,
        StopTrackFailed: 32,
        TelemetrySampledAndNotSent: 33,
        TrackEventFailed: 34,
        TrackExceptionFailed: 35,
        TrackMetricFailed: 36,
        TrackPVFailed: 37,
        TrackPVFailedCalc: 38,
        TrackTraceFailed: 39,
        TransmissionFailed: 40,
        FailedToSetStorageBuffer: 41,
        FailedToRestoreStorageBuffer: 42,
        InvalidBackendResponse: 43,
        FailedToFixDepricatedValues: 44,
        InvalidDurationValue: 45,
        TelemetryEnvelopeInvalid: 46,
        CreateEnvelopeError: 47,
        CannotSerializeObject: 48,
        CannotSerializeObjectNonSerializable: 49,
        CircularReferenceDetected: 50,
        ClearAuthContextFailed: 51,
        ExceptionTruncated: 52,
        IllegalCharsInName: 53,
        ItemNotInArray: 54,
        MaxAjaxPerPVExceeded: 55,
        MessageTruncated: 56,
        NameTooLong: 57,
        SampleRateOutOfRange: 58,
        SetAuthContextFailed: 59,
        SetAuthContextFailedAccountName: 60,
        StringValueTooLong: 61,
        StartCalledMoreThanOnce: 62,
        StopCalledWithoutStart: 63,
        TelemetryInitializerFailed: 64,
        TrackArgumentsNotSpecified: 65,
        UrlTooLong: 66,
        SessionStorageBufferFull: 67,
        CannotAccessCookie: 68,
        IdTooLong: 69,
        InvalidEvent: 70,
        FailedMonitorAjaxSetRequestHeader: 71,
        SendBrowserInfoOnUserInit: 72,
        PluginException: 73,
        NotificationException: 74,
        SnippetScriptLoadFailure: 99,
        InvalidInstrumentationKey: 100,
        CannotParseAiBlobValue: 101,
        InvalidContentBlob: 102,
        TrackPageActionEventFailed: 103
    };

    var strOnPrefix = "on";
    var strAttachEvent = "attachEvent";
    var strAddEventHelper = "addEventListener";
    var strDetachEvent = "detachEvent";
    var strRemoveEventListener = "removeEventListener";
    var _objDefineProperty = ObjDefineProperty;
    function objToString(obj) {
        return ObjProto.toString.call(obj);
    }
    function isUndefined(value) {
        return value === undefined || typeof value === strShimUndefined;
    }
    function isNullOrUndefined(value) {
        return (value === null || isUndefined(value));
    }
    function isObject(value) {
        return typeof value === strShimObject;
    }
    function isFunction(value) {
        return typeof value === strShimFunction;
    }
    function attachEvent(obj, eventNameWithoutOn, handlerRef, useCapture) {
        if (useCapture === void 0) { useCapture = false; }
        var result = false;
        if (!isNullOrUndefined(obj)) {
            try {
                if (!isNullOrUndefined(obj[strAddEventHelper])) {
                    obj[strAddEventHelper](eventNameWithoutOn, handlerRef, useCapture);
                    result = true;
                }
                else if (!isNullOrUndefined(obj[strAttachEvent])) {
                    obj[strAttachEvent](strOnPrefix + eventNameWithoutOn, handlerRef);
                    result = true;
                }
            }
            catch (e) {
            }
        }
        return result;
    }
    function detachEvent(obj, eventNameWithoutOn, handlerRef, useCapture) {
        if (useCapture === void 0) { useCapture = false; }
        if (!isNullOrUndefined(obj)) {
            try {
                if (!isNullOrUndefined(obj[strRemoveEventListener])) {
                    obj[strRemoveEventListener](eventNameWithoutOn, handlerRef, useCapture);
                }
                else if (!isNullOrUndefined(obj[strDetachEvent])) {
                    obj[strDetachEvent](strOnPrefix + eventNameWithoutOn, handlerRef);
                }
            }
            catch (e) {
            }
        }
    }
    function objForEachKey(target, callbackfn) {
        if (target) {
            for (var prop in target) {
                if (ObjHasOwnProperty.call(target, prop)) {
                    callbackfn.call(target, prop, target[prop]);
                }
            }
        }
    }
    function strContains(value, search) {
        if (value && search) {
            return value.indexOf(search) !== -1;
        }
        return false;
    }
    function isDate(obj) {
        return objToString(obj) === "[object Date]";
    }
    function isArray(obj) {
        return objToString(obj) === "[object Array]";
    }
    function isError(obj) {
        return objToString(obj) === "[object Error]";
    }
    function isString(value) {
        return typeof value === "string";
    }
    function isNumber(value) {
        return typeof value === "number";
    }
    function toISOString(date) {
        if (isDate(date)) {
            var pad = function (num) {
                var r = String(num);
                if (r.length === 1) {
                    r = "0" + r;
                }
                return r;
            };
            return date.getUTCFullYear()
                + "-" + pad(date.getUTCMonth() + 1)
                + "-" + pad(date.getUTCDate())
                + "T" + pad(date.getUTCHours())
                + ":" + pad(date.getUTCMinutes())
                + ":" + pad(date.getUTCSeconds())
                + "." + String((date.getUTCMilliseconds() / 1000).toFixed(3)).slice(2, 5)
                + "Z";
        }
    }
    function arrForEach(arr, callbackfn, thisArg) {
        var len = arr.length;
        for (var idx = 0; idx < len; idx++) {
            if (idx in arr) {
                if (callbackfn.call(thisArg || arr, arr[idx], idx, arr) === -1) {
                    break;
                }
            }
        }
    }
    function arrIndexOf(arr, searchElement, fromIndex) {
        var len = arr.length;
        var from = fromIndex || 0;
        for (var lp = Math.max(from >= 0 ? from : len - Math.abs(from), 0); lp < len; lp++) {
            if (lp in arr && arr[lp] === searchElement) {
                return lp;
            }
        }
        return -1;
    }
    function arrMap(arr, callbackfn, thisArg) {
        var len = arr.length;
        var _this = thisArg || arr;
        var results = new Array(len);
        for (var lp = 0; lp < len; lp++) {
            if (lp in arr) {
                results[lp] = callbackfn.call(_this, arr[lp], arr);
            }
        }
        return results;
    }
    function strTrim(str) {
        if (typeof str !== "string") {
            return str;
        }
        return str.replace(/^\s+|\s+$/g, "");
    }
    var _objKeysHasDontEnumBug = !({ toString: null }).propertyIsEnumerable('toString');
    var _objKeysDontEnums = [
        'toString',
        'toLocaleString',
        'valueOf',
        'hasOwnProperty',
        'isPrototypeOf',
        'propertyIsEnumerable',
        'constructor'
    ];
    function objKeys(obj) {
        var objType = typeof obj;
        if (objType !== strShimFunction && (objType !== strShimObject || obj === null)) {
            throwTypeError('objKeys called on non-object');
        }
        var result = [];
        for (var prop in obj) {
            if (obj && ObjHasOwnProperty.call(obj, prop)) {
                result.push(prop);
            }
        }
        if (_objKeysHasDontEnumBug) {
            var dontEnumsLength = _objKeysDontEnums.length;
            for (var lp = 0; lp < dontEnumsLength; lp++) {
                if (obj && ObjHasOwnProperty.call(obj, _objKeysDontEnums[lp])) {
                    result.push(_objKeysDontEnums[lp]);
                }
            }
        }
        return result;
    }
    function objDefineAccessors(target, prop, getProp, setProp) {
        if (_objDefineProperty) {
            try {
                var descriptor = {
                    enumerable: true,
                    configurable: true
                };
                if (getProp) {
                    descriptor.get = getProp;
                }
                if (setProp) {
                    descriptor.set = setProp;
                }
                _objDefineProperty(target, prop, descriptor);
                return true;
            }
            catch (e) {
            }
        }
        return false;
    }
    function dateNow() {
        var dt = Date;
        if (dt.now) {
            return dt.now();
        }
        return new dt().getTime();
    }
    function getExceptionName(object) {
        if (isError(object)) {
            return object.name;
        }
        return "";
    }
    function setValue(target, field, value, valChk, srcChk) {
        var theValue = value;
        if (target) {
            theValue = target[field];
            if (theValue !== value && (!srcChk || srcChk(theValue)) && (!valChk || valChk(value))) {
                theValue = value;
                target[field] = theValue;
            }
        }
        return theValue;
    }
    function isTruthy(value) {
        return !!value;
    }
    function throwError(message) {
        throw new Error(message);
    }
    function createClassFromInterface(defaults) {
        return /** @class */ (function () {
            function class_1() {
                var _this = this;
                if (defaults) {
                    objForEachKey(defaults, function (field, value) {
                        _this[field] = value;
                    });
                }
            }
            return class_1;
        }());
    }
    function optimizeObject(theObject) {
        if (theObject) {
            theObject = ObjClass(ObjAssign ? ObjAssign({}, theObject) : theObject);
        }
        return theObject;
    }

    var strWindow = "window";
    var strDocument = "document";
    var strNavigator = "navigator";
    var strConsole = "console";
    var strJSON = "JSON";
    var strMsie = "msie";
    var strTrident = "trident/";
    function getGlobalInst(name) {
        var gbl = getGlobal();
        if (gbl && gbl[name]) {
            return gbl[name];
        }
        if (name === strWindow && hasWindow()) {
            return window;
        }
        return null;
    }
    function hasWindow() {
        return Boolean(typeof window === strShimObject && window);
    }
    function getWindow() {
        if (hasWindow()) {
            return window;
        }
        return getGlobalInst(strWindow);
    }
    function hasDocument() {
        return Boolean(typeof document === strShimObject && document);
    }
    function getDocument() {
        if (hasDocument()) {
            return document;
        }
        return getGlobalInst(strDocument);
    }
    function hasNavigator() {
        return Boolean(typeof navigator === strShimObject && navigator);
    }
    function getNavigator() {
        if (hasNavigator()) {
            return navigator;
        }
        return getGlobalInst(strNavigator);
    }
    function getConsole() {
        if (typeof console !== strShimUndefined) {
            return console;
        }
        return getGlobalInst(strConsole);
    }
    function hasJSON() {
        return Boolean((typeof JSON === strShimObject && JSON) || getGlobalInst(strJSON) !== null);
    }
    function getJSON() {
        if (hasJSON()) {
            return JSON || getGlobalInst(strJSON);
        }
        return null;
    }
    function getIEVersion(userAgentStr) {
        if (userAgentStr === void 0) { userAgentStr = null; }
        if (!userAgentStr) {
            var navigator_1 = getNavigator() || {};
            userAgentStr = navigator_1 ? (navigator_1.userAgent || "").toLowerCase() : "";
        }
        var ua = (userAgentStr || "").toLowerCase();
        if (strContains(ua, strMsie)) {
            return parseInt(ua.split(strMsie)[1]);
        }
        else if (strContains(ua, strTrident)) {
            var tridentVer = parseInt(ua.split(strTrident)[1]);
            if (tridentVer) {
                return tridentVer + 4;
            }
        }
        return null;
    }
    function dumpObj(object) {
        var objectTypeDump = Object[strShimPrototype].toString.call(object);
        var propertyValueDump = "";
        if (objectTypeDump === "[object Error]") {
            propertyValueDump = "{ stack: '" + object.stack + "', message: '" + object.message + "', name: '" + object.name + "'";
        }
        else if (hasJSON()) {
            propertyValueDump = getJSON().stringify(object);
        }
        return objectTypeDump + propertyValueDump;
    }

    var AiNonUserActionablePrefix = "AI (Internal): ";
    var AiUserActionablePrefix = "AI: ";
    var AIInternalMessagePrefix = "AITR_";
    function _sanitizeDiagnosticText(text) {
        if (text) {
            return "\"" + text.replace(/\"/g, "") + "\"";
        }
        return "";
    }
    var _InternalLogMessage = /** @class */ (function () {
        function _InternalLogMessage(msgId, msg, isUserAct, properties) {
            if (isUserAct === void 0) { isUserAct = false; }
            var _self = this;
            _self.messageId = msgId;
            _self.message =
                (isUserAct ? AiUserActionablePrefix : AiNonUserActionablePrefix) +
                    msgId;
            var strProps = "";
            if (hasJSON()) {
                strProps = getJSON().stringify(properties);
            }
            var diagnosticText = (msg ? " message:" + _sanitizeDiagnosticText(msg) : "") +
                (properties ? " props:" + _sanitizeDiagnosticText(strProps) : "");
            _self.message += diagnosticText;
        }
        _InternalLogMessage.dataType = "MessageData";
        return _InternalLogMessage;
    }());
    function safeGetLogger(core, config) {
        return (core || {}).logger || new DiagnosticLogger(config);
    }
    var DiagnosticLogger = /** @class */ (function () {
        function DiagnosticLogger(config) {
            this.identifier = 'DiagnosticLogger';
            this.queue = [];
            var _messageCount = 0;
            var _messageLogged = {};
            dynamicProto(DiagnosticLogger, this, function (_self) {
                if (isNullOrUndefined(config)) {
                    config = {};
                }
                _self.consoleLoggingLevel = function () { return _getConfigValue('loggingLevelConsole', 0); };
                _self.telemetryLoggingLevel = function () { return _getConfigValue('loggingLevelTelemetry', 1); };
                _self.maxInternalMessageLimit = function () { return _getConfigValue('maxMessageLimit', 25); };
                _self.enableDebugExceptions = function () { return _getConfigValue('enableDebugExceptions', false); };
                _self.throwInternal = function (severity, msgId, msg, properties, isUserAct) {
                    if (isUserAct === void 0) { isUserAct = false; }
                    var message = new _InternalLogMessage(msgId, msg, isUserAct, properties);
                    if (_self.enableDebugExceptions()) {
                        throw message;
                    }
                    else {
                        if (!isUndefined(message.message)) {
                            var logLevel = _self.consoleLoggingLevel();
                            if (isUserAct) {
                                var messageKey = +message.messageId;
                                if (!_messageLogged[messageKey] && logLevel >= LoggingSeverity.WARNING) {
                                    _self.warnToConsole(message.message);
                                    _messageLogged[messageKey] = true;
                                }
                            }
                            else {
                                if (logLevel >= LoggingSeverity.WARNING) {
                                    _self.warnToConsole(message.message);
                                }
                            }
                            _self.logInternalMessage(severity, message);
                        }
                    }
                };
                _self.warnToConsole = function (message) {
                    var theConsole = getConsole();
                    if (!!theConsole) {
                        var logFunc = 'log';
                        if (theConsole.warn) {
                            logFunc = 'warn';
                        }
                        if (isFunction(theConsole[logFunc])) {
                            theConsole[logFunc](message);
                        }
                    }
                };
                _self.resetInternalMessageCount = function () {
                    _messageCount = 0;
                    _messageLogged = {};
                };
                _self.logInternalMessage = function (severity, message) {
                    if (_areInternalMessagesThrottled()) {
                        return;
                    }
                    var logMessage = true;
                    var messageKey = AIInternalMessagePrefix + message.messageId;
                    if (_messageLogged[messageKey]) {
                        logMessage = false;
                    }
                    else {
                        _messageLogged[messageKey] = true;
                    }
                    if (logMessage) {
                        if (severity <= _self.telemetryLoggingLevel()) {
                            _self.queue.push(message);
                            _messageCount++;
                        }
                        if (_messageCount === _self.maxInternalMessageLimit()) {
                            var throttleLimitMessage = "Internal events throttle limit per PageView reached for this app.";
                            var throttleMessage = new _InternalLogMessage(_InternalMessageId.MessageLimitPerPVExceeded, throttleLimitMessage, false);
                            _self.queue.push(throttleMessage);
                            _self.warnToConsole(throttleLimitMessage);
                        }
                    }
                };
                function _getConfigValue(name, defValue) {
                    var value = config[name];
                    if (!isNullOrUndefined(value)) {
                        return value;
                    }
                    return defValue;
                }
                function _areInternalMessagesThrottled() {
                    return _messageCount >= _self.maxInternalMessageLimit();
                }
            });
        }
        return DiagnosticLogger;
    }());

    var strExecutionContextKey = "ctx";
    var PerfEvent = /** @class */ (function () {
        function PerfEvent(name, payloadDetails, isAsync) {
            var _self = this;
            var accessorDefined = false;
            _self.start = dateNow();
            _self.name = name;
            _self.isAsync = isAsync;
            _self.isChildEvt = function () { return false; };
            if (isFunction(payloadDetails)) {
                var theDetails_1;
                accessorDefined = objDefineAccessors(_self, 'payload', function () {
                    if (!theDetails_1 && isFunction(payloadDetails)) {
                        theDetails_1 = payloadDetails();
                        payloadDetails = null;
                    }
                    return theDetails_1;
                });
            }
            _self.getCtx = function (key) {
                if (key) {
                    if (key === PerfEvent.ParentContextKey || key === PerfEvent.ChildrenContextKey) {
                        return _self[key];
                    }
                    return (_self[strExecutionContextKey] || {})[key];
                }
                return null;
            };
            _self.setCtx = function (key, value) {
                if (key) {
                    if (key === PerfEvent.ParentContextKey) {
                        if (!_self[key]) {
                            _self.isChildEvt = function () { return true; };
                        }
                        _self[key] = value;
                    }
                    else if (key === PerfEvent.ChildrenContextKey) {
                        _self[key] = value;
                    }
                    else {
                        var ctx = _self[strExecutionContextKey] = _self[strExecutionContextKey] || {};
                        ctx[key] = value;
                    }
                }
            };
            _self.complete = function () {
                var childTime = 0;
                var childEvts = _self.getCtx(PerfEvent.ChildrenContextKey);
                if (isArray(childEvts)) {
                    for (var lp = 0; lp < childEvts.length; lp++) {
                        var childEvt = childEvts[lp];
                        if (childEvt) {
                            childTime += childEvt.time;
                        }
                    }
                }
                _self.time = dateNow() - _self.start;
                _self.exTime = _self.time - childTime;
                _self.complete = function () { };
                if (!accessorDefined && isFunction(payloadDetails)) {
                    _self.payload = payloadDetails();
                }
            };
        }
        PerfEvent.ParentContextKey = "parent";
        PerfEvent.ChildrenContextKey = "childEvts";
        return PerfEvent;
    }());
    var doPerfActiveKey = "CoreUtils.doPerf";
    function doPerf(mgrSource, getSource, func, details, isAsync) {
        if (mgrSource) {
            var perfMgr = mgrSource;
            if (isFunction(perfMgr["getPerfMgr"])) {
                perfMgr = perfMgr["getPerfMgr"]();
            }
            if (perfMgr) {
                var perfEvt = void 0;
                var currentActive = perfMgr.getCtx(doPerfActiveKey);
                try {
                    perfEvt = perfMgr.create(getSource(), details, isAsync);
                    if (perfEvt) {
                        if (currentActive && perfEvt.setCtx) {
                            perfEvt.setCtx(PerfEvent.ParentContextKey, currentActive);
                            if (currentActive.getCtx && currentActive.setCtx) {
                                var children = currentActive.getCtx(PerfEvent.ChildrenContextKey);
                                if (!children) {
                                    children = [];
                                    currentActive.setCtx(PerfEvent.ChildrenContextKey, children);
                                }
                                children.push(perfEvt);
                            }
                        }
                        perfMgr.setCtx(doPerfActiveKey, perfEvt);
                        return func(perfEvt);
                    }
                }
                catch (ex) {
                    if (perfEvt && perfEvt.setCtx) {
                        perfEvt.setCtx("exception", ex);
                    }
                }
                finally {
                    if (perfEvt) {
                        perfMgr.fire(perfEvt);
                    }
                    perfMgr.setCtx(doPerfActiveKey, currentActive);
                }
            }
        }
        return func();
    }

    var TelemetryPluginChain = /** @class */ (function () {
        function TelemetryPluginChain(plugin, defItemCtx) {
            var _self = this;
            var _nextProxy = null;
            var _hasProcessTelemetry = isFunction(plugin.processTelemetry);
            var _hasSetNext = isFunction(plugin.setNextPlugin);
            _self._hasRun = false;
            _self.getPlugin = function () {
                return plugin;
            };
            _self.getNext = function () {
                return _nextProxy;
            };
            _self.setNext = function (nextPlugin) {
                _nextProxy = nextPlugin;
            };
            _self.processTelemetry = function (env, itemCtx) {
                if (!itemCtx) {
                    itemCtx = defItemCtx;
                }
                var identifier = plugin ? plugin.identifier : "TelemetryPluginChain";
                doPerf(itemCtx ? itemCtx.core() : null, function () { return identifier + ":processTelemetry"; }, function () {
                    if (plugin && _hasProcessTelemetry) {
                        _self._hasRun = true;
                        try {
                            itemCtx.setNext(_nextProxy);
                            if (_hasSetNext) {
                                plugin.setNextPlugin(_nextProxy);
                            }
                            _nextProxy && (_nextProxy._hasRun = false);
                            plugin.processTelemetry(env, itemCtx);
                        }
                        catch (error) {
                            var hasRun = _nextProxy && _nextProxy._hasRun;
                            if (!_nextProxy || !hasRun) {
                                itemCtx.diagLog().throwInternal(LoggingSeverity.CRITICAL, _InternalMessageId.PluginException, "Plugin [" + plugin.identifier + "] failed during processTelemetry - " + error);
                            }
                            if (_nextProxy && !hasRun) {
                                _nextProxy.processTelemetry(env, itemCtx);
                            }
                        }
                    }
                    else if (_nextProxy) {
                        _self._hasRun = true;
                        _nextProxy.processTelemetry(env, itemCtx);
                    }
                }, function () { return ({ item: env }); }, !(env.sync));
            };
        }
        return TelemetryPluginChain;
    }());

    function _createProxyChain(plugins, itemCtx) {
        var proxies = [];
        if (plugins && plugins.length > 0) {
            var lastProxy = null;
            for (var idx = 0; idx < plugins.length; idx++) {
                var thePlugin = plugins[idx];
                if (thePlugin && isFunction(thePlugin.processTelemetry)) {
                    var newProxy = new TelemetryPluginChain(thePlugin, itemCtx);
                    proxies.push(newProxy);
                    if (lastProxy) {
                        lastProxy.setNext(newProxy);
                    }
                    lastProxy = newProxy;
                }
            }
        }
        return proxies.length > 0 ? proxies[0] : null;
    }
    function _copyProxyChain(proxy, itemCtx, startAt) {
        var plugins = [];
        var add = startAt ? false : true;
        if (proxy) {
            while (proxy) {
                var thePlugin = proxy.getPlugin();
                if (add || thePlugin === startAt) {
                    add = true;
                    plugins.push(thePlugin);
                }
                proxy = proxy.getNext();
            }
        }
        if (!add) {
            plugins.push(startAt);
        }
        return _createProxyChain(plugins, itemCtx);
    }
    function _copyPluginChain(srcPlugins, itemCtx, startAt) {
        var plugins = srcPlugins;
        var add = false;
        if (startAt && srcPlugins) {
            plugins = [];
            arrForEach(srcPlugins, function (thePlugin) {
                if (add || thePlugin === startAt) {
                    add = true;
                    plugins.push(thePlugin);
                }
            });
        }
        if (startAt && !add) {
            if (!plugins) {
                plugins = [];
            }
            plugins.push(startAt);
        }
        return _createProxyChain(plugins, itemCtx);
    }
    var ProcessTelemetryContext = /** @class */ (function () {
        function ProcessTelemetryContext(plugins, config, core, startAt) {
            var _self = this;
            var _nextProxy = null;
            if (startAt !== null) {
                if (plugins && isFunction(plugins.getPlugin)) {
                    _nextProxy = _copyProxyChain(plugins, _self, startAt || plugins.getPlugin());
                }
                else {
                    if (startAt) {
                        _nextProxy = _copyPluginChain(plugins, _self, startAt);
                    }
                    else if (isUndefined(startAt)) {
                        _nextProxy = _createProxyChain(plugins, _self);
                    }
                }
            }
            _self.core = function () {
                return core;
            };
            _self.diagLog = function () {
                return safeGetLogger(core, config);
            };
            _self.getCfg = function () {
                return config;
            };
            _self.getExtCfg = function (identifier, defaultValue) {
                if (defaultValue === void 0) { defaultValue = {}; }
                var theConfig;
                if (config) {
                    var extConfig = config.extensionConfig;
                    if (extConfig && identifier) {
                        theConfig = extConfig[identifier];
                    }
                }
                return (theConfig ? theConfig : defaultValue);
            };
            _self.getConfig = function (identifier, field, defaultValue) {
                if (defaultValue === void 0) { defaultValue = false; }
                var theValue;
                var extConfig = _self.getExtCfg(identifier, null);
                if (extConfig && !isNullOrUndefined(extConfig[field])) {
                    theValue = extConfig[field];
                }
                else if (config && !isNullOrUndefined(config[field])) {
                    theValue = config[field];
                }
                return !isNullOrUndefined(theValue) ? theValue : defaultValue;
            };
            _self.hasNext = function () {
                return _nextProxy != null;
            };
            _self.getNext = function () {
                return _nextProxy;
            };
            _self.setNext = function (nextPlugin) {
                _nextProxy = nextPlugin;
            };
            _self.processNext = function (env) {
                var nextPlugin = _nextProxy;
                if (nextPlugin) {
                    _nextProxy = nextPlugin.getNext();
                    nextPlugin.processTelemetry(env, _self);
                }
            };
            _self.createNew = function (plugins, startAt) {
                if (plugins === void 0) { plugins = null; }
                return new ProcessTelemetryContext(plugins || _nextProxy, config, core, startAt);
            };
        }
        return ProcessTelemetryContext;
    }());

    var strExtensionConfig = "extensionConfig";

    var strGetPlugin = "getPlugin";
    var BaseTelemetryPlugin = /** @class */ (function () {
        function BaseTelemetryPlugin() {
            var _self = this;
            var _isinitialized = false;
            var _rootCtx = null;
            var _nextPlugin = null;
            _self.core = null;
            _self.diagLog = function (itemCtx) {
                return _self._getTelCtx(itemCtx).diagLog();
            };
            _self.isInitialized = function () {
                return _isinitialized;
            };
            _self.setInitialized = function (isInitialized) {
                _isinitialized = isInitialized;
            };
            _self.setNextPlugin = function (next) {
                _nextPlugin = next;
            };
            _self.processNext = function (env, itemCtx) {
                if (itemCtx) {
                    itemCtx.processNext(env);
                }
                else if (_nextPlugin && isFunction(_nextPlugin.processTelemetry)) {
                    _nextPlugin.processTelemetry(env, null);
                }
            };
            _self._getTelCtx = function (currentCtx) {
                if (currentCtx === void 0) { currentCtx = null; }
                var itemCtx = currentCtx;
                if (!itemCtx) {
                    var rootCtx = _rootCtx || new ProcessTelemetryContext(null, {}, _self.core);
                    if (_nextPlugin && _nextPlugin[strGetPlugin]) {
                        itemCtx = rootCtx.createNew(null, _nextPlugin[strGetPlugin]);
                    }
                    else {
                        itemCtx = rootCtx.createNew(null, _nextPlugin);
                    }
                }
                return itemCtx;
            };
            _self._baseTelInit = function (config, core, extensions, pluginChain) {
                if (config) {
                    setValue(config, strExtensionConfig, [], null, isNullOrUndefined);
                }
                if (!pluginChain && core) {
                    pluginChain = core.getProcessTelContext().getNext();
                }
                var nextPlugin = _nextPlugin;
                if (_nextPlugin && _nextPlugin[strGetPlugin]) {
                    nextPlugin = _nextPlugin[strGetPlugin]();
                }
                _self.core = core;
                _rootCtx = new ProcessTelemetryContext(pluginChain, config, core, nextPlugin);
                _isinitialized = true;
            };
        }
        BaseTelemetryPlugin.prototype.initialize = function (config, core, extensions, pluginChain) {
            this._baseTelInit(config, core, extensions, pluginChain);
        };
        return BaseTelemetryPlugin;
    }());

    var EventHelper = {
        Attach: attachEvent,
        AttachEvent: attachEvent,
        Detach: detachEvent,
        DetachEvent: detachEvent
    };

    var RequestHeaders = {
        requestContextHeader: "Request-Context",
        requestContextTargetKey: "appId",
        requestContextAppIdFormat: "appId=cid-v1:",
        requestIdHeader: "Request-Id",
        traceParentHeader: "traceparent",
        traceStateHeader: "tracestate",
        sdkContextHeader: "Sdk-Context",
        sdkContextHeaderAppIdRequest: "appId",
        requestContextHeaderLowerCase: "request-context"
    };

    function dataSanitizeKeyAndAddUniqueness(logger, key, map) {
        var origLength = key.length;
        var field = dataSanitizeKey(logger, key);
        if (field.length !== origLength) {
            var i = 0;
            var uniqueField = field;
            while (map[uniqueField] !== undefined) {
                i++;
                uniqueField = field.substring(0, 150  - 3) + dsPadNumber(i);
            }
            field = uniqueField;
        }
        return field;
    }
    function dataSanitizeKey(logger, name) {
        var nameTrunc;
        if (name) {
            name = strTrim(name.toString());
            if (name.length > 150 ) {
                nameTrunc = name.substring(0, 150 );
                logger.throwInternal(LoggingSeverity.WARNING, _InternalMessageId.NameTooLong, "name is too long.  It has been truncated to " + 150  + " characters.", { name: name }, true);
            }
        }
        return nameTrunc || name;
    }
    function dataSanitizeString(logger, value, maxLength) {
        if (maxLength === void 0) { maxLength = 1024 ; }
        var valueTrunc;
        if (value) {
            maxLength = maxLength ? maxLength : 1024 ;
            value = strTrim(value);
            if (value.toString().length > maxLength) {
                valueTrunc = value.toString().substring(0, maxLength);
                logger.throwInternal(LoggingSeverity.WARNING, _InternalMessageId.StringValueTooLong, "string value is too long. It has been truncated to " + maxLength + " characters.", { value: value }, true);
            }
        }
        return valueTrunc || value;
    }
    function dataSanitizeUrl(logger, url) {
        return dataSanitizeInput(logger, url, 2048 , _InternalMessageId.UrlTooLong);
    }
    function dataSanitizeMessage(logger, message) {
        var messageTrunc;
        if (message) {
            if (message.length > 32768 ) {
                messageTrunc = message.substring(0, 32768 );
                logger.throwInternal(LoggingSeverity.WARNING, _InternalMessageId.MessageTruncated, "message is too long, it has been truncated to " + 32768  + " characters.", { message: message }, true);
            }
        }
        return messageTrunc || message;
    }
    function dataSanitizeException(logger, exception) {
        var exceptionTrunc;
        if (exception) {
            var value = "" + exception;
            if (value.length > 32768 ) {
                exceptionTrunc = value.substring(0, 32768 );
                logger.throwInternal(LoggingSeverity.WARNING, _InternalMessageId.ExceptionTruncated, "exception is too long, it has been truncated to " + 32768  + " characters.", { exception: exception }, true);
            }
        }
        return exceptionTrunc || exception;
    }
    function dataSanitizeProperties(logger, properties) {
        if (properties) {
            var tempProps_1 = {};
            objForEachKey(properties, function (prop, value) {
                if (isObject(value) && hasJSON()) {
                    try {
                        value = getJSON().stringify(value);
                    }
                    catch (e) {
                        logger.throwInternal(LoggingSeverity.WARNING, _InternalMessageId.CannotSerializeObjectNonSerializable, "custom property is not valid", { exception: e }, true);
                    }
                }
                value = dataSanitizeString(logger, value, 8192 );
                prop = dataSanitizeKeyAndAddUniqueness(logger, prop, tempProps_1);
                tempProps_1[prop] = value;
            });
            properties = tempProps_1;
        }
        return properties;
    }
    function dataSanitizeMeasurements(logger, measurements) {
        if (measurements) {
            var tempMeasurements_1 = {};
            objForEachKey(measurements, function (measure, value) {
                measure = dataSanitizeKeyAndAddUniqueness(logger, measure, tempMeasurements_1);
                tempMeasurements_1[measure] = value;
            });
            measurements = tempMeasurements_1;
        }
        return measurements;
    }
    function dataSanitizeId(logger, id) {
        return id ? dataSanitizeInput(logger, id, 128 , _InternalMessageId.IdTooLong).toString() : id;
    }
    function dataSanitizeInput(logger, input, maxLength, _msgId) {
        var inputTrunc;
        if (input) {
            input = strTrim(input);
            if (input.length > maxLength) {
                inputTrunc = input.substring(0, maxLength);
                logger.throwInternal(LoggingSeverity.WARNING, _msgId, "input is too long, it has been truncated to " + maxLength + " characters.", { data: input }, true);
            }
        }
        return inputTrunc || input;
    }
    function dsPadNumber(num) {
        var s = "00" + num;
        return s.substr(s.length - 3);
    }

    function msToTimeSpan(totalms) {
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
    function isBeaconApiSupported() {
        var nav = getNavigator();
        return ('sendBeacon' in nav && nav.sendBeacon);
    }

    var DisabledPropertyName = "Microsoft_ApplicationInsights_BypassAjaxInstrumentation";
    var SampleRate = "sampleRate";
    var ProcessLegacy = "ProcessLegacy";
    var HttpMethod = "http.method";
    var strNotSpecified = "not_specified";

    var StorageType;
    (function (StorageType) {
        StorageType[StorageType["LocalStorage"] = 0] = "LocalStorage";
        StorageType[StorageType["SessionStorage"] = 1] = "SessionStorage";
    })(StorageType || (StorageType = {}));
    var DistributedTracingModes;
    (function (DistributedTracingModes) {
        DistributedTracingModes[DistributedTracingModes["AI"] = 0] = "AI";
        DistributedTracingModes[DistributedTracingModes["AI_AND_W3C"] = 1] = "AI_AND_W3C";
        DistributedTracingModes[DistributedTracingModes["W3C"] = 2] = "W3C";
    })(DistributedTracingModes || (DistributedTracingModes = {}));

    var _canUseSessionStorage = undefined;
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
        }
        return null;
    }
    function _getSessionStorageObject() {
        if (utlCanUseSessionStorage()) {
            return _getVerifiedStorageObject(StorageType.SessionStorage);
        }
        return null;
    }
    function utlCanUseSessionStorage() {
        if (_canUseSessionStorage === undefined) {
            _canUseSessionStorage = !!_getVerifiedStorageObject(StorageType.SessionStorage);
        }
        return _canUseSessionStorage;
    }
    function utlGetSessionStorage(logger, name) {
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
    function utlSetSessionStorage(logger, name, data) {
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

    var _document = getDocument() || {};
    var _htmlAnchorIdx = 0;
    var _htmlAnchorElement = [null, null, null, null, null];
    function urlParseUrl(url) {
        var anchorIdx = _htmlAnchorIdx;
        var anchorCache = _htmlAnchorElement;
        var tempAnchor = anchorCache[anchorIdx];
        if (!_document.createElement) {
            tempAnchor = { host: urlParseHost(url, true) };
        }
        else if (!anchorCache[anchorIdx]) {
            tempAnchor = anchorCache[anchorIdx] = _document.createElement('a');
        }
        tempAnchor.href = url;
        anchorIdx++;
        if (anchorIdx >= anchorCache.length) {
            anchorIdx = 0;
        }
        _htmlAnchorIdx = anchorIdx;
        return tempAnchor;
    }
    function urlParseHost(url, inclPort) {
        var fullHost = urlParseFullHost(url, inclPort) || "";
        if (fullHost) {
            var match = fullHost.match(/(www[0-9]?\.)?(.[^/:]+)(\:[\d]+)?/i);
            if (match != null && match.length > 3 && isString(match[2]) && match[2].length > 0) {
                return match[2] + (match[3] || "");
            }
        }
        return fullHost;
    }
    function urlParseFullHost(url, inclPort) {
        var result = null;
        if (url) {
            var match = url.match(/(\w*):\/\/(.[^/:]+)(\:[\d]+)?/i);
            if (match != null && match.length > 2 && isString(match[2]) && match[2].length > 0) {
                result = match[2] || "";
                if (inclPort && match.length > 2) {
                    var protocol = (match[1] || "").toLowerCase();
                    var port = match[3] || "";
                    if (protocol === "http" && port === ":80") {
                        port = "";
                    }
                    else if (protocol === "https" && port === ":443") {
                        port = "";
                    }
                    result += port;
                }
            }
        }
        return result;
    }

    var _internalEndpoints = [
        "https://dc.services.visualstudio.com/v2/track",
        "https://breeze.aimon.applicationinsights.io/v2/track",
        "https://dc-int.services.visualstudio.com/v2/track"
    ];
    function isInternalApplicationInsightsEndpoint(endpointUrl) {
        return _internalEndpoints.indexOf(endpointUrl.toLowerCase()) !== -1;
    }
    function AjaxHelperParseDependencyPath(logger, absoluteUrl, method, commandName) {
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

    var Base = /** @class */ (function () {
        function Base() {
        }
        return Base;
    }());

    var Data$1 = /** @class */ (function (_super) {
        __extendsFn(Data, _super);
        function Data() {
            return _super.call(this) || this;
        }
        return Data;
    }(Base));

    var Envelope$1 = /** @class */ (function () {
        function Envelope() {
            this.ver = 1;
            this.sampleRate = 100.0;
            this.tags = {};
        }
        return Envelope;
    }());

    var Envelope = /** @class */ (function (_super) {
        __extendsFn(Envelope, _super);
        function Envelope(logger, data, name) {
            var _this = _super.call(this) || this;
            _this.name = dataSanitizeString(logger, name) || strNotSpecified;
            _this.data = data;
            _this.time = toISOString(new Date());
            _this.aiDataContract = {
                time: 1 ,
                iKey: 1 ,
                name: 1 ,
                sampleRate: function () {
                    return (_this.sampleRate === 100) ? 4  : 1 ;
                },
                tags: 1 ,
                data: 1
            };
            return _this;
        }
        return Envelope;
    }(Envelope$1));

    var EventData = /** @class */ (function () {
        function EventData() {
            this.ver = 2;
            this.properties = {};
            this.measurements = {};
        }
        return EventData;
    }());

    var Event = /** @class */ (function (_super) {
        __extendsFn(Event, _super);
        function Event(logger, name, properties, measurements) {
            var _this = _super.call(this) || this;
            _this.aiDataContract = {
                ver: 1 ,
                name: 1 ,
                properties: 0 ,
                measurements: 0
            };
            _this.name = dataSanitizeString(logger, name) || strNotSpecified;
            _this.properties = dataSanitizeProperties(logger, properties);
            _this.measurements = dataSanitizeMeasurements(logger, measurements);
            return _this;
        }
        Event.envelopeType = "Microsoft.ApplicationInsights.{0}.Event";
        Event.dataType = "EventData";
        return Event;
    }(EventData));

    var StackFrame = /** @class */ (function () {
        function StackFrame() {
        }
        return StackFrame;
    }());

    var ExceptionData = /** @class */ (function () {
        function ExceptionData() {
            this.ver = 2;
            this.exceptions = [];
            this.properties = {};
            this.measurements = {};
        }
        return ExceptionData;
    }());

    var ExceptionDetails = /** @class */ (function () {
        function ExceptionDetails() {
            this.hasFullStack = true;
            this.parsedStack = [];
        }
        return ExceptionDetails;
    }());

    var NoMethod = "<no_method>";
    var strError = "error";
    var strStack = "stack";
    var strStackDetails = "stackDetails";
    var strErrorSrc = "errorSrc";
    var strMessage = "message";
    var strDescription = "description";
    function _stringify(value, convertToString) {
        var result = value;
        if (result && !isString(result)) {
            if (JSON && JSON.stringify) {
                result = JSON.stringify(value);
                if (convertToString && (!result || result === "{}")) {
                    if (isFunction(value.toString)) {
                        result = value.toString();
                    }
                    else {
                        result = "" + value;
                    }
                }
            }
            else {
                result = "" + value + " - (Missing JSON.stringify)";
            }
        }
        return result || "";
    }
    function _formatMessage(theEvent, errorType) {
        var evtMessage = theEvent;
        if (theEvent) {
            evtMessage = theEvent[strMessage] || theEvent[strDescription] || "";
            if (evtMessage && !isString(evtMessage)) {
                evtMessage = _stringify(evtMessage, true);
            }
            if (theEvent["filename"]) {
                evtMessage = evtMessage + " @" + (theEvent["filename"] || "") + ":" + (theEvent["lineno"] || "?") + ":" + (theEvent["colno"] || "?");
            }
        }
        if (errorType && errorType !== "String" && errorType !== "Object" && errorType !== "Error" && (evtMessage || "").indexOf(errorType) === -1) {
            evtMessage = errorType + ": " + evtMessage;
        }
        return evtMessage || "";
    }
    function _isExceptionDetailsInternal(value) {
        if (isObject(value)) {
            return "hasFullStack" in value && "typeName" in value;
        }
        return false;
    }
    function _isExceptionInternal(value) {
        if (isObject(value)) {
            return ("ver" in value && "exceptions" in value && "properties" in value);
        }
        return false;
    }
    function _isStackDetails(details) {
        return details && details.src && isString(details.src) && details.obj && isArray(details.obj);
    }
    function _convertStackObj(errorStack) {
        var src = errorStack || "";
        if (!isString(src)) {
            if (isString(src[strStack])) {
                src = src[strStack];
            }
            else {
                src = "" + src;
            }
        }
        var items = src.split("\n");
        return {
            src: src,
            obj: items
        };
    }
    function _getOperaStack(errorMessage) {
        var stack = [];
        var lines = errorMessage.split("\n");
        for (var lp = 0; lp < lines.length; lp++) {
            var entry = lines[lp];
            if (lines[lp + 1]) {
                entry += "@" + lines[lp + 1];
                lp++;
            }
            stack.push(entry);
        }
        return {
            src: errorMessage,
            obj: stack
        };
    }
    function _getStackFromErrorObj(errorObj) {
        var details = null;
        if (errorObj) {
            try {
                if (errorObj[strStack]) {
                    details = _convertStackObj(errorObj[strStack]);
                }
                else if (errorObj[strError] && errorObj[strError][strStack]) {
                    details = _convertStackObj(errorObj[strError][strStack]);
                }
                else if (errorObj['exception'] && errorObj.exception[strStack]) {
                    details = _convertStackObj(errorObj.exception[strStack]);
                }
                else if (_isStackDetails(errorObj)) {
                    details = errorObj;
                }
                else if (_isStackDetails(errorObj[strStackDetails])) {
                    details = errorObj[strStackDetails];
                }
                else if (window['opera'] && errorObj[strMessage]) {
                    details = _getOperaStack(errorObj.message);
                }
                else if (isString(errorObj)) {
                    details = _convertStackObj(errorObj);
                }
                else {
                    var evtMessage = errorObj[strMessage] || errorObj[strDescription] || "";
                    if (isString(errorObj[strErrorSrc])) {
                        if (evtMessage) {
                            evtMessage += "\n";
                        }
                        evtMessage += " from " + errorObj[strErrorSrc];
                    }
                    if (evtMessage) {
                        details = _convertStackObj(evtMessage);
                    }
                }
            }
            catch (e) {
                details = _convertStackObj(e);
            }
        }
        return details || {
            src: "",
            obj: null
        };
    }
    function _formatStackTrace(stackDetails) {
        var stack = "";
        if (stackDetails) {
            if (stackDetails.obj) {
                arrForEach(stackDetails.obj, function (entry) {
                    stack += entry + "\n";
                });
            }
            else {
                stack = stackDetails.src || "";
            }
        }
        return stack;
    }
    function _parseStack(stack) {
        var parsedStack;
        var frames = stack.obj;
        if (frames && frames.length > 0) {
            parsedStack = [];
            var level_1 = 0;
            var totalSizeInBytes_1 = 0;
            arrForEach(frames, function (frame) {
                var theFrame = frame.toString();
                if (_StackFrame.regex.test(theFrame)) {
                    var parsedFrame = new _StackFrame(theFrame, level_1++);
                    totalSizeInBytes_1 += parsedFrame.sizeInBytes;
                    parsedStack.push(parsedFrame);
                }
            });
            var exceptionParsedStackThreshold = 32 * 1024;
            if (totalSizeInBytes_1 > exceptionParsedStackThreshold) {
                var left = 0;
                var right = parsedStack.length - 1;
                var size = 0;
                var acceptedLeft = left;
                var acceptedRight = right;
                while (left < right) {
                    var lSize = parsedStack[left].sizeInBytes;
                    var rSize = parsedStack[right].sizeInBytes;
                    size += lSize + rSize;
                    if (size > exceptionParsedStackThreshold) {
                        var howMany = acceptedRight - acceptedLeft + 1;
                        parsedStack.splice(acceptedLeft, howMany);
                        break;
                    }
                    acceptedLeft = left;
                    acceptedRight = right;
                    left++;
                    right--;
                }
            }
        }
        return parsedStack;
    }
    function _getErrorType(errorType) {
        var typeName = "";
        if (errorType) {
            typeName = errorType.typeName || errorType.name || "";
            if (!typeName) {
                try {
                    var funcNameRegex = /function (.{1,200})\(/;
                    var results = (funcNameRegex).exec((errorType).constructor.toString());
                    typeName = (results && results.length > 1) ? results[1] : "";
                }
                catch (e) {
                }
            }
        }
        return typeName;
    }
    function _formatErrorCode(errorObj) {
        if (errorObj) {
            try {
                if (!isString(errorObj)) {
                    var errorType = _getErrorType(errorObj);
                    var result = _stringify(errorObj, false);
                    if (!result || result === "{}") {
                        if (errorObj[strError]) {
                            errorObj = errorObj[strError];
                            errorType = _getErrorType(errorObj);
                        }
                        result = _stringify(errorObj, true);
                    }
                    if (result.indexOf(errorType) !== 0 && errorType !== "String") {
                        return errorType + ":" + result;
                    }
                    return result;
                }
            }
            catch (e) {
            }
        }
        return "" + (errorObj || "");
    }
    var Exception = /** @class */ (function (_super) {
        __extendsFn(Exception, _super);
        function Exception(logger, exception, properties, measurements, severityLevel, id) {
            var _this = _super.call(this) || this;
            _this.aiDataContract = {
                ver: 1 ,
                exceptions: 1 ,
                severityLevel: 0 ,
                properties: 0 ,
                measurements: 0
            };
            if (!_isExceptionInternal(exception)) {
                if (!properties) {
                    properties = {};
                }
                _this.exceptions = [new _ExceptionDetails(logger, exception, properties)];
                _this.properties = dataSanitizeProperties(logger, properties);
                _this.measurements = dataSanitizeMeasurements(logger, measurements);
                if (severityLevel) {
                    _this.severityLevel = severityLevel;
                }
                if (id) {
                    _this.id = id;
                }
            }
            else {
                _this.exceptions = exception.exceptions;
                _this.properties = exception.properties;
                _this.measurements = exception.measurements;
                if (exception.severityLevel) {
                    _this.severityLevel = exception.severityLevel;
                }
                if (exception.id) {
                    _this.id = exception.id;
                }
                if (exception.problemGroup) {
                    _this.problemGroup = exception.problemGroup;
                }
                _this.ver = 2;
                if (!isNullOrUndefined(exception.isManual)) {
                    _this.isManual = exception.isManual;
                }
            }
            return _this;
        }
        Exception.CreateAutoException = function (message, url, lineNumber, columnNumber, error, evt, stack, errorSrc) {
            var errorType = _getErrorType(error || evt || message);
            return {
                message: _formatMessage(message, errorType),
                url: url,
                lineNumber: lineNumber,
                columnNumber: columnNumber,
                error: _formatErrorCode(error || evt || message),
                evt: _formatErrorCode(evt || message),
                typeName: errorType,
                stackDetails: _getStackFromErrorObj(stack || error || evt),
                errorSrc: errorSrc
            };
        };
        Exception.CreateFromInterface = function (logger, exception, properties, measurements) {
            var exceptions = exception.exceptions
                && arrMap(exception.exceptions, function (ex) { return _ExceptionDetails.CreateFromInterface(logger, ex); });
            var exceptionData = new Exception(logger, __assignFn({}, exception, { exceptions: exceptions }), properties, measurements);
            return exceptionData;
        };
        Exception.prototype.toInterface = function () {
            var _a = this, exceptions = _a.exceptions, properties = _a.properties, measurements = _a.measurements, severityLevel = _a.severityLevel; _a.ver; var problemGroup = _a.problemGroup, id = _a.id, isManual = _a.isManual;
            var exceptionDetailsInterface = exceptions instanceof Array
                && arrMap(exceptions, function (exception) { return exception.toInterface(); })
                || undefined;
            return {
                ver: "4.0",
                exceptions: exceptionDetailsInterface,
                severityLevel: severityLevel,
                properties: properties,
                measurements: measurements,
                problemGroup: problemGroup,
                id: id,
                isManual: isManual
            };
        };
        Exception.CreateSimpleException = function (message, typeName, assembly, fileName, details, line) {
            return {
                exceptions: [
                    {
                        hasFullStack: true,
                        message: message,
                        stack: details,
                        typeName: typeName
                    }
                ]
            };
        };
        Exception.envelopeType = "Microsoft.ApplicationInsights.{0}.Exception";
        Exception.dataType = "ExceptionData";
        Exception.formatError = _formatErrorCode;
        return Exception;
    }(ExceptionData));
    var _ExceptionDetails = /** @class */ (function (_super) {
        __extendsFn(_ExceptionDetails, _super);
        function _ExceptionDetails(logger, exception, properties) {
            var _this = _super.call(this) || this;
            _this.aiDataContract = {
                id: 0 ,
                outerId: 0 ,
                typeName: 1 ,
                message: 1 ,
                hasFullStack: 0 ,
                stack: 0 ,
                parsedStack: 2
            };
            if (!_isExceptionDetailsInternal(exception)) {
                var error = exception;
                var evt = error && error.evt;
                if (!isError(error)) {
                    error = error[strError] || evt || error;
                }
                _this.typeName = dataSanitizeString(logger, _getErrorType(error)) || strNotSpecified;
                _this.message = dataSanitizeMessage(logger, _formatMessage(exception || error, _this.typeName)) || strNotSpecified;
                var stack = exception[strStackDetails] || _getStackFromErrorObj(exception);
                _this.parsedStack = _parseStack(stack);
                _this[strStack] = dataSanitizeException(logger, _formatStackTrace(stack));
                _this.hasFullStack = isArray(_this.parsedStack) && _this.parsedStack.length > 0;
                if (properties) {
                    properties.typeName = properties.typeName || _this.typeName;
                }
            }
            else {
                _this.typeName = exception.typeName;
                _this.message = exception.message;
                _this[strStack] = exception[strStack];
                _this.parsedStack = exception.parsedStack;
                _this.hasFullStack = exception.hasFullStack;
            }
            return _this;
        }
        _ExceptionDetails.prototype.toInterface = function () {
            var parsedStack = this.parsedStack instanceof Array
                && arrMap(this.parsedStack, function (frame) { return frame.toInterface(); });
            var exceptionDetailsInterface = {
                id: this.id,
                outerId: this.outerId,
                typeName: this.typeName,
                message: this.message,
                hasFullStack: this.hasFullStack,
                stack: this[strStack],
                parsedStack: parsedStack || undefined
            };
            return exceptionDetailsInterface;
        };
        _ExceptionDetails.CreateFromInterface = function (logger, exception) {
            var parsedStack = (exception.parsedStack instanceof Array
                && arrMap(exception.parsedStack, function (frame) { return _StackFrame.CreateFromInterface(frame); }))
                || exception.parsedStack;
            var exceptionDetails = new _ExceptionDetails(logger, __assignFn({}, exception, { parsedStack: parsedStack }));
            return exceptionDetails;
        };
        return _ExceptionDetails;
    }(ExceptionDetails));
    var _StackFrame = /** @class */ (function (_super) {
        __extendsFn(_StackFrame, _super);
        function _StackFrame(sourceFrame, level) {
            var _this = _super.call(this) || this;
            _this.sizeInBytes = 0;
            _this.aiDataContract = {
                level: 1 ,
                method: 1 ,
                assembly: 0 ,
                fileName: 0 ,
                line: 0
            };
            if (typeof sourceFrame === "string") {
                var frame = sourceFrame;
                _this.level = level;
                _this.method = NoMethod;
                _this.assembly = strTrim(frame);
                _this.fileName = "";
                _this.line = 0;
                var matches = frame.match(_StackFrame.regex);
                if (matches && matches.length >= 5) {
                    _this.method = strTrim(matches[2]) || _this.method;
                    _this.fileName = strTrim(matches[4]);
                    _this.line = parseInt(matches[5]) || 0;
                }
            }
            else {
                _this.level = sourceFrame.level;
                _this.method = sourceFrame.method;
                _this.assembly = sourceFrame.assembly;
                _this.fileName = sourceFrame.fileName;
                _this.line = sourceFrame.line;
                _this.sizeInBytes = 0;
            }
            _this.sizeInBytes += _this.method.length;
            _this.sizeInBytes += _this.fileName.length;
            _this.sizeInBytes += _this.assembly.length;
            _this.sizeInBytes += _StackFrame.baseSize;
            _this.sizeInBytes += _this.level.toString().length;
            _this.sizeInBytes += _this.line.toString().length;
            return _this;
        }
        _StackFrame.CreateFromInterface = function (frame) {
            return new _StackFrame(frame, null );
        };
        _StackFrame.prototype.toInterface = function () {
            return {
                level: this.level,
                method: this.method,
                assembly: this.assembly,
                fileName: this.fileName,
                line: this.line
            };
        };
        _StackFrame.regex = /^([\s]+at)?[\s]{0,50}([^\@\()]+?)[\s]{0,50}(\@|\()([^\(\n]+):([0-9]+):([0-9]+)(\)?)$/;
        _StackFrame.baseSize = 58;
        return _StackFrame;
    }(StackFrame));

    var MetricData = /** @class */ (function () {
        function MetricData() {
            this.ver = 2;
            this.metrics = [];
            this.properties = {};
            this.measurements = {};
        }
        return MetricData;
    }());

    var DataPointType;
    (function (DataPointType) {
        DataPointType[DataPointType["Measurement"] = 0] = "Measurement";
        DataPointType[DataPointType["Aggregation"] = 1] = "Aggregation";
    })(DataPointType || (DataPointType = {}));

    var DataPoint$1 = /** @class */ (function () {
        function DataPoint() {
            this.kind = DataPointType.Measurement;
        }
        return DataPoint;
    }());

    var DataPoint = /** @class */ (function (_super) {
        __extendsFn(DataPoint, _super);
        function DataPoint() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.aiDataContract = {
                name: 1 ,
                kind: 0 ,
                value: 1 ,
                count: 0 ,
                min: 0 ,
                max: 0 ,
                stdDev: 0
            };
            return _this;
        }
        return DataPoint;
    }(DataPoint$1));

    var Metric = /** @class */ (function (_super) {
        __extendsFn(Metric, _super);
        function Metric(logger, name, value, count, min, max, properties, measurements) {
            var _this = _super.call(this) || this;
            _this.aiDataContract = {
                ver: 1 ,
                metrics: 1 ,
                properties: 0
            };
            var dataPoint = new DataPoint();
            dataPoint.count = count > 0 ? count : undefined;
            dataPoint.max = isNaN(max) || max === null ? undefined : max;
            dataPoint.min = isNaN(min) || min === null ? undefined : min;
            dataPoint.name = dataSanitizeString(logger, name) || strNotSpecified;
            dataPoint.value = value;
            _this.metrics = [dataPoint];
            _this.properties = dataSanitizeProperties(logger, properties);
            _this.measurements = dataSanitizeMeasurements(logger, measurements);
            return _this;
        }
        Metric.envelopeType = "Microsoft.ApplicationInsights.{0}.Metric";
        Metric.dataType = "MetricData";
        return Metric;
    }(MetricData));

    var PageViewData = /** @class */ (function (_super) {
        __extendsFn(PageViewData, _super);
        function PageViewData() {
            var _this = _super.call(this) || this;
            _this.ver = 2;
            _this.properties = {};
            _this.measurements = {};
            return _this;
        }
        return PageViewData;
    }(EventData));

    var PageView = /** @class */ (function (_super) {
        __extendsFn(PageView, _super);
        function PageView(logger, name, url, durationMs, properties, measurements, id) {
            var _this = _super.call(this) || this;
            _this.aiDataContract = {
                ver: 1 ,
                name: 0 ,
                url: 0 ,
                duration: 0 ,
                properties: 0 ,
                measurements: 0 ,
                id: 0
            };
            _this.id = dataSanitizeId(logger, id);
            _this.url = dataSanitizeUrl(logger, url);
            _this.name = dataSanitizeString(logger, name) || strNotSpecified;
            if (!isNaN(durationMs)) {
                _this.duration = msToTimeSpan(durationMs);
            }
            _this.properties = dataSanitizeProperties(logger, properties);
            _this.measurements = dataSanitizeMeasurements(logger, measurements);
            return _this;
        }
        PageView.envelopeType = "Microsoft.ApplicationInsights.{0}.Pageview";
        PageView.dataType = "PageviewData";
        return PageView;
    }(PageViewData));

    var RemoteDependencyData$1 = /** @class */ (function () {
        function RemoteDependencyData() {
            this.ver = 2;
            this.success = true;
            this.properties = {};
            this.measurements = {};
        }
        return RemoteDependencyData;
    }());

    var RemoteDependencyData = /** @class */ (function (_super) {
        __extendsFn(RemoteDependencyData, _super);
        function RemoteDependencyData(logger, id, absoluteUrl, commandName, value, success, resultCode, method, requestAPI, correlationContext, properties, measurements) {
            if (requestAPI === void 0) { requestAPI = "Ajax"; }
            var _this = _super.call(this) || this;
            _this.aiDataContract = {
                id: 1 ,
                ver: 1 ,
                name: 0 ,
                resultCode: 0 ,
                duration: 0 ,
                success: 0 ,
                data: 0 ,
                target: 0 ,
                type: 0 ,
                properties: 0 ,
                measurements: 0 ,
                kind: 0 ,
                value: 0 ,
                count: 0 ,
                min: 0 ,
                max: 0 ,
                stdDev: 0 ,
                dependencyKind: 0 ,
                dependencySource: 0 ,
                commandName: 0 ,
                dependencyTypeName: 0
            };
            _this.id = id;
            _this.duration = msToTimeSpan(value);
            _this.success = success;
            _this.resultCode = resultCode + "";
            _this.type = dataSanitizeString(logger, requestAPI);
            var dependencyFields = AjaxHelperParseDependencyPath(logger, absoluteUrl, method, commandName);
            _this.data = dataSanitizeUrl(logger, commandName) || dependencyFields.data;
            _this.target = dataSanitizeString(logger, dependencyFields.target);
            if (correlationContext) {
                _this.target = _this.target + " | " + correlationContext;
            }
            _this.name = dataSanitizeString(logger, dependencyFields.name);
            _this.properties = dataSanitizeProperties(logger, properties);
            _this.measurements = dataSanitizeMeasurements(logger, measurements);
            return _this;
        }
        RemoteDependencyData.envelopeType = "Microsoft.ApplicationInsights.{0}.RemoteDependency";
        RemoteDependencyData.dataType = "RemoteDependencyData";
        return RemoteDependencyData;
    }(RemoteDependencyData$1));

    var MessageData = /** @class */ (function () {
        function MessageData() {
            this.ver = 2;
            this.properties = {};
            this.measurements = {};
        }
        return MessageData;
    }());

    var Trace = /** @class */ (function (_super) {
        __extendsFn(Trace, _super);
        function Trace(logger, message, severityLevel, properties, measurements) {
            var _this = _super.call(this) || this;
            _this.aiDataContract = {
                ver: 1 ,
                message: 1 ,
                severityLevel: 0 ,
                properties: 0
            };
            message = message || strNotSpecified;
            _this.message = dataSanitizeMessage(logger, message);
            _this.properties = dataSanitizeProperties(logger, properties);
            _this.measurements = dataSanitizeMeasurements(logger, measurements);
            if (severityLevel) {
                _this.severityLevel = severityLevel;
            }
            return _this;
        }
        Trace.envelopeType = "Microsoft.ApplicationInsights.{0}.Message";
        Trace.dataType = "MessageData";
        return Trace;
    }(MessageData));

    var PageViewPerfData = /** @class */ (function (_super) {
        __extendsFn(PageViewPerfData, _super);
        function PageViewPerfData() {
            var _this = _super.call(this) || this;
            _this.ver = 2;
            _this.properties = {};
            _this.measurements = {};
            return _this;
        }
        return PageViewPerfData;
    }(PageViewData));

    var PageViewPerformance = /** @class */ (function (_super) {
        __extendsFn(PageViewPerformance, _super);
        function PageViewPerformance(logger, name, url, unused, properties, measurements, cs4BaseData) {
            var _this = _super.call(this) || this;
            _this.aiDataContract = {
                ver: 1 ,
                name: 0 ,
                url: 0 ,
                duration: 0 ,
                perfTotal: 0 ,
                networkConnect: 0 ,
                sentRequest: 0 ,
                receivedResponse: 0 ,
                domProcessing: 0 ,
                properties: 0 ,
                measurements: 0
            };
            _this.url = dataSanitizeUrl(logger, url);
            _this.name = dataSanitizeString(logger, name) || strNotSpecified;
            _this.properties = dataSanitizeProperties(logger, properties);
            _this.measurements = dataSanitizeMeasurements(logger, measurements);
            if (cs4BaseData) {
                _this.domProcessing = cs4BaseData.domProcessing;
                _this.duration = cs4BaseData.duration;
                _this.networkConnect = cs4BaseData.networkConnect;
                _this.perfTotal = cs4BaseData.perfTotal;
                _this.receivedResponse = cs4BaseData.receivedResponse;
                _this.sentRequest = cs4BaseData.sentRequest;
            }
            return _this;
        }
        PageViewPerformance.envelopeType = "Microsoft.ApplicationInsights.{0}.PageviewPerformance";
        PageViewPerformance.dataType = "PageviewPerformanceData";
        return PageViewPerformance;
    }(PageViewPerfData));

    var Data = /** @class */ (function (_super) {
        __extendsFn(Data, _super);
        function Data(baseType, data) {
            var _this = _super.call(this) || this;
            _this.aiDataContract = {
                baseType: 1 ,
                baseData: 1
            };
            _this.baseType = baseType;
            _this.baseData = data;
            return _this;
        }
        return Data;
    }(Data$1));

    function _aiNameFunc(baseName) {
        var aiName = "ai." + baseName + ".";
        return function (name) {
            return aiName + name;
        };
    }
    var _aiApplication = _aiNameFunc("application");
    var _aiDevice = _aiNameFunc("device");
    var _aiLocation = _aiNameFunc("location");
    var _aiOperation = _aiNameFunc("operation");
    var _aiSession = _aiNameFunc("session");
    var _aiUser = _aiNameFunc("user");
    var _aiCloud = _aiNameFunc("cloud");
    var _aiInternal = _aiNameFunc("internal");
    var ContextTagKeys = /** @class */ (function (_super) {
        __extendsFn(ContextTagKeys, _super);
        function ContextTagKeys() {
            return _super.call(this) || this;
        }
        return ContextTagKeys;
    }(createClassFromInterface({
        applicationVersion: _aiApplication("ver"),
        applicationBuild: _aiApplication("build"),
        applicationTypeId: _aiApplication("typeId"),
        applicationId: _aiApplication("applicationId"),
        applicationLayer: _aiApplication("layer"),
        deviceId: _aiDevice("id"),
        deviceIp: _aiDevice("ip"),
        deviceLanguage: _aiDevice("language"),
        deviceLocale: _aiDevice("locale"),
        deviceModel: _aiDevice("model"),
        deviceFriendlyName: _aiDevice("friendlyName"),
        deviceNetwork: _aiDevice("network"),
        deviceNetworkName: _aiDevice("networkName"),
        deviceOEMName: _aiDevice("oemName"),
        deviceOS: _aiDevice("os"),
        deviceOSVersion: _aiDevice("osVersion"),
        deviceRoleInstance: _aiDevice("roleInstance"),
        deviceRoleName: _aiDevice("roleName"),
        deviceScreenResolution: _aiDevice("screenResolution"),
        deviceType: _aiDevice("type"),
        deviceMachineName: _aiDevice("machineName"),
        deviceVMName: _aiDevice("vmName"),
        deviceBrowser: _aiDevice("browser"),
        deviceBrowserVersion: _aiDevice("browserVersion"),
        locationIp: _aiLocation("ip"),
        locationCountry: _aiLocation("country"),
        locationProvince: _aiLocation("province"),
        locationCity: _aiLocation("city"),
        operationId: _aiOperation("id"),
        operationName: _aiOperation("name"),
        operationParentId: _aiOperation("parentId"),
        operationRootId: _aiOperation("rootId"),
        operationSyntheticSource: _aiOperation("syntheticSource"),
        operationCorrelationVector: _aiOperation("correlationVector"),
        sessionId: _aiSession("id"),
        sessionIsFirst: _aiSession("isFirst"),
        sessionIsNew: _aiSession("isNew"),
        userAccountAcquisitionDate: _aiUser("accountAcquisitionDate"),
        userAccountId: _aiUser("accountId"),
        userAgent: _aiUser("userAgent"),
        userId: _aiUser("id"),
        userStoreRegion: _aiUser("storeRegion"),
        userAuthUserId: _aiUser("authUserId"),
        userAnonymousUserAcquisitionDate: _aiUser("anonUserAcquisitionDate"),
        userAuthenticatedUserAcquisitionDate: _aiUser("authUserAcquisitionDate"),
        cloudName: _aiCloud("name"),
        cloudRole: _aiCloud("role"),
        cloudRoleVer: _aiCloud("roleVer"),
        cloudRoleInstance: _aiCloud("roleInstance"),
        cloudEnvironment: _aiCloud("environment"),
        cloudLocation: _aiCloud("location"),
        cloudDeploymentUnit: _aiCloud("deploymentUnit"),
        internalNodeName: _aiInternal("nodeName"),
        internalSdkVersion: _aiInternal("sdkVersion"),
        internalAgentVersion: _aiInternal("agentVersion"),
        internalSnippet: _aiInternal("snippet"),
        internalSdkSrc: _aiInternal("sdkSrc")
    })));

    var CtxTagKeys = new ContextTagKeys();

    var BreezeChannelIdentifier = "AppInsightsChannelPlugin";

    var ArraySendBuffer = /** @class */ (function () {
        function ArraySendBuffer(config) {
            var _buffer = [];
            dynamicProto(ArraySendBuffer, this, function (_self) {
                _self.enqueue = function (payload) {
                    _buffer.push(payload);
                };
                _self.count = function () {
                    return _buffer.length;
                };
                _self.clear = function () {
                    _buffer.length = 0;
                };
                _self.getItems = function () {
                    return _buffer.slice(0);
                };
                _self.batchPayloads = function (payload) {
                    if (payload && payload.length > 0) {
                        var batch = config.emitLineDelimitedJson() ?
                            payload.join("\n") :
                            "[" + payload.join(",") + "]";
                        return batch;
                    }
                    return null;
                };
                _self.markAsSent = function (payload) {
                    _self.clear();
                };
                _self.clearSent = function (payload) {
                };
            });
        }
        return ArraySendBuffer;
    }());
    var SessionStorageSendBuffer = /** @class */ (function () {
        function SessionStorageSendBuffer(logger, config) {
            var _bufferFullMessageSent = false;
            var _buffer;
            dynamicProto(SessionStorageSendBuffer, this, function (_self) {
                var bufferItems = _getBuffer(SessionStorageSendBuffer.BUFFER_KEY);
                var notDeliveredItems = _getBuffer(SessionStorageSendBuffer.SENT_BUFFER_KEY);
                _buffer = bufferItems.concat(notDeliveredItems);
                if (_buffer.length > SessionStorageSendBuffer.MAX_BUFFER_SIZE) {
                    _buffer.length = SessionStorageSendBuffer.MAX_BUFFER_SIZE;
                }
                _setBuffer(SessionStorageSendBuffer.SENT_BUFFER_KEY, []);
                _setBuffer(SessionStorageSendBuffer.BUFFER_KEY, _buffer);
                _self.enqueue = function (payload) {
                    if (_buffer.length >= SessionStorageSendBuffer.MAX_BUFFER_SIZE) {
                        if (!_bufferFullMessageSent) {
                            logger.throwInternal(LoggingSeverity.WARNING, _InternalMessageId.SessionStorageBufferFull, "Maximum buffer size reached: " + _buffer.length, true);
                            _bufferFullMessageSent = true;
                        }
                        return;
                    }
                    _buffer.push(payload);
                    _setBuffer(SessionStorageSendBuffer.BUFFER_KEY, _buffer);
                };
                _self.count = function () {
                    return _buffer.length;
                };
                _self.clear = function () {
                    _buffer = [];
                    _setBuffer(SessionStorageSendBuffer.BUFFER_KEY, []);
                    _setBuffer(SessionStorageSendBuffer.SENT_BUFFER_KEY, []);
                    _bufferFullMessageSent = false;
                };
                _self.getItems = function () {
                    return _buffer.slice(0);
                };
                _self.batchPayloads = function (payload) {
                    if (payload && payload.length > 0) {
                        var batch = config.emitLineDelimitedJson() ?
                            payload.join("\n") :
                            "[" + payload.join(",") + "]";
                        return batch;
                    }
                    return null;
                };
                _self.markAsSent = function (payload) {
                    _buffer = _removePayloadsFromBuffer(payload, _buffer);
                    _setBuffer(SessionStorageSendBuffer.BUFFER_KEY, _buffer);
                    var sentElements = _getBuffer(SessionStorageSendBuffer.SENT_BUFFER_KEY);
                    if (sentElements instanceof Array && payload instanceof Array) {
                        sentElements = sentElements.concat(payload);
                        if (sentElements.length > SessionStorageSendBuffer.MAX_BUFFER_SIZE) {
                            logger.throwInternal(LoggingSeverity.CRITICAL, _InternalMessageId.SessionStorageBufferFull, "Sent buffer reached its maximum size: " + sentElements.length, true);
                            sentElements.length = SessionStorageSendBuffer.MAX_BUFFER_SIZE;
                        }
                        _setBuffer(SessionStorageSendBuffer.SENT_BUFFER_KEY, sentElements);
                    }
                };
                _self.clearSent = function (payload) {
                    var sentElements = _getBuffer(SessionStorageSendBuffer.SENT_BUFFER_KEY);
                    sentElements = _removePayloadsFromBuffer(payload, sentElements);
                    _setBuffer(SessionStorageSendBuffer.SENT_BUFFER_KEY, sentElements);
                };
                function _removePayloadsFromBuffer(payloads, buffer) {
                    var remaining = [];
                    arrForEach(buffer, function (value) {
                        if (!isFunction(value) && arrIndexOf(payloads, value) === -1) {
                            remaining.push(value);
                        }
                    });
                    return remaining;
                }
                function _getBuffer(key) {
                    var prefixedKey = key;
                    try {
                        prefixedKey = config.namePrefix && config.namePrefix() ? config.namePrefix() + "_" + prefixedKey : prefixedKey;
                        var bufferJson = utlGetSessionStorage(logger, prefixedKey);
                        if (bufferJson) {
                            var buffer = getJSON().parse(bufferJson);
                            if (isString(buffer)) {
                                buffer = getJSON().parse(buffer);
                            }
                            if (buffer && isArray(buffer)) {
                                return buffer;
                            }
                        }
                    }
                    catch (e) {
                        logger.throwInternal(LoggingSeverity.CRITICAL, _InternalMessageId.FailedToRestoreStorageBuffer, " storage key: " + prefixedKey + ", " + getExceptionName(e), { exception: dumpObj(e) });
                    }
                    return [];
                }
                function _setBuffer(key, buffer) {
                    var prefixedKey = key;
                    try {
                        prefixedKey = config.namePrefix && config.namePrefix() ? config.namePrefix() + "_" + prefixedKey : prefixedKey;
                        var bufferJson = JSON.stringify(buffer);
                        utlSetSessionStorage(logger, prefixedKey, bufferJson);
                    }
                    catch (e) {
                        utlSetSessionStorage(logger, prefixedKey, JSON.stringify([]));
                        logger.throwInternal(LoggingSeverity.WARNING, _InternalMessageId.FailedToSetStorageBuffer, " storage key: " + prefixedKey + ", " + getExceptionName(e) + ". Buffer cleared", { exception: dumpObj(e) });
                    }
                }
            });
        }
        SessionStorageSendBuffer.BUFFER_KEY = "AI_buffer";
        SessionStorageSendBuffer.SENT_BUFFER_KEY = "AI_sentBuffer";
        SessionStorageSendBuffer.MAX_BUFFER_SIZE = 2000;
        return SessionStorageSendBuffer;
    }());

    var strBaseType = 'baseType';
    var strBaseData = 'baseData';
    var strProperties = 'properties';
    var strTrue = 'true';
    function _setValueIf(target, field, value) {
        return setValue(target, field, value, isTruthy);
    }
    var EnvelopeCreator = /** @class */ (function () {
        function EnvelopeCreator() {
        }
        EnvelopeCreator.extractPropsAndMeasurements = function (data, properties, measurements) {
            if (!isNullOrUndefined(data)) {
                objForEachKey(data, function (key, value) {
                    if (isNumber(value)) {
                        measurements[key] = value;
                    }
                    else if (isString(value)) {
                        properties[key] = value;
                    }
                    else if (hasJSON()) {
                        properties[key] = getJSON().stringify(value);
                    }
                });
            }
        };
        EnvelopeCreator.createEnvelope = function (logger, envelopeType, telemetryItem, data) {
            var envelope = new Envelope(logger, data, envelopeType);
            _setValueIf(envelope, 'sampleRate', telemetryItem[SampleRate]);
            if ((telemetryItem[strBaseData] || {}).startTime) {
                envelope.time = toISOString(telemetryItem[strBaseData].startTime);
            }
            envelope.iKey = telemetryItem.iKey;
            var iKeyNoDashes = telemetryItem.iKey.replace(/-/g, "");
            envelope.name = envelope.name.replace("{0}", iKeyNoDashes);
            EnvelopeCreator.extractPartAExtensions(telemetryItem, envelope);
            telemetryItem.tags = telemetryItem.tags || [];
            return optimizeObject(envelope);
        };
        EnvelopeCreator.extractPartAExtensions = function (item, env) {
            var envTags = env.tags = env.tags || {};
            var itmExt = item.ext = item.ext || {};
            var itmTags = item.tags = item.tags || [];
            var extUser = itmExt.user;
            if (extUser) {
                _setValueIf(envTags, CtxTagKeys.userAuthUserId, extUser.authId);
                _setValueIf(envTags, CtxTagKeys.userId, extUser.id || extUser.localId);
            }
            var extApp = itmExt.app;
            if (extApp) {
                _setValueIf(envTags, CtxTagKeys.sessionId, extApp.sesId);
            }
            var extDevice = itmExt.device;
            if (extDevice) {
                _setValueIf(envTags, CtxTagKeys.deviceId, extDevice.id || extDevice.localId);
                _setValueIf(envTags, CtxTagKeys.deviceType, extDevice.deviceClass);
                _setValueIf(envTags, CtxTagKeys.deviceIp, extDevice.ip);
                _setValueIf(envTags, CtxTagKeys.deviceModel, extDevice.model);
                _setValueIf(envTags, CtxTagKeys.deviceType, extDevice.deviceType);
            }
            var web = item.ext.web;
            if (web) {
                _setValueIf(envTags, CtxTagKeys.deviceLanguage, web.browserLang);
                _setValueIf(envTags, CtxTagKeys.deviceBrowserVersion, web.browserVer);
                _setValueIf(envTags, CtxTagKeys.deviceBrowser, web.browser);
                var envData = env.data = env.data || {};
                var envBaseData = envData[strBaseData] = envData[strBaseData] || {};
                var envProps = envBaseData[strProperties] = envBaseData[strProperties] || {};
                _setValueIf(envProps, 'domain', web.domain);
                _setValueIf(envProps, 'isManual', web.isManual ? strTrue : null);
                _setValueIf(envProps, 'screenRes', web.screenRes);
                _setValueIf(envProps, 'userConsent', web.userConsent ? strTrue : null);
            }
            var extOs = itmExt.os;
            if (extOs) {
                _setValueIf(envTags, CtxTagKeys.deviceOS, extOs.name);
            }
            var extTrace = itmExt.trace;
            if (extTrace) {
                _setValueIf(envTags, CtxTagKeys.operationParentId, extTrace.parentID);
                _setValueIf(envTags, CtxTagKeys.operationName, extTrace.name);
                _setValueIf(envTags, CtxTagKeys.operationId, extTrace.traceID);
            }
            var tgs = {};
            for (var i = itmTags.length - 1; i >= 0; i--) {
                var tg = itmTags[i];
                objForEachKey(tg, function (key, value) {
                    tgs[key] = value;
                });
                itmTags.splice(i, 1);
            }
            objForEachKey(itmTags, function (tg, value) {
                tgs[tg] = value;
            });
            var theTags = __assignFn({}, envTags, tgs);
            if (!theTags[CtxTagKeys.internalSdkVersion]) {
                theTags[CtxTagKeys.internalSdkVersion] = "javascript:" + EnvelopeCreator.Version;
            }
            env.tags = optimizeObject(theTags);
        };
        EnvelopeCreator.prototype.Init = function (logger, telemetryItem) {
            this._logger = logger;
            if (isNullOrUndefined(telemetryItem[strBaseData])) {
                this._logger.throwInternal(LoggingSeverity.CRITICAL, _InternalMessageId.TelemetryEnvelopeInvalid, "telemetryItem.baseData cannot be null.");
            }
        };
        EnvelopeCreator.Version = "2.6.4";
        return EnvelopeCreator;
    }());
    var DependencyEnvelopeCreator = /** @class */ (function (_super) {
        __extendsFn(DependencyEnvelopeCreator, _super);
        function DependencyEnvelopeCreator() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        DependencyEnvelopeCreator.prototype.Create = function (logger, telemetryItem) {
            _super.prototype.Init.call(this, logger, telemetryItem);
            var customMeasurements = telemetryItem[strBaseData].measurements || {};
            var customProperties = telemetryItem[strBaseData][strProperties] || {};
            EnvelopeCreator.extractPropsAndMeasurements(telemetryItem.data, customProperties, customMeasurements);
            var bd = telemetryItem[strBaseData];
            if (isNullOrUndefined(bd)) {
                logger.warnToConsole("Invalid input for dependency data");
                return null;
            }
            var method = bd[strProperties] && bd[strProperties][HttpMethod] ? bd[strProperties][HttpMethod] : "GET";
            var remoteDepData = new RemoteDependencyData(logger, bd.id, bd.target, bd.name, bd.duration, bd.success, bd.responseCode, method, bd.type, bd.correlationContext, customProperties, customMeasurements);
            var data = new Data(RemoteDependencyData.dataType, remoteDepData);
            return EnvelopeCreator.createEnvelope(logger, RemoteDependencyData.envelopeType, telemetryItem, data);
        };
        DependencyEnvelopeCreator.DependencyEnvelopeCreator = new DependencyEnvelopeCreator();
        return DependencyEnvelopeCreator;
    }(EnvelopeCreator));
    var EventEnvelopeCreator = /** @class */ (function (_super) {
        __extendsFn(EventEnvelopeCreator, _super);
        function EventEnvelopeCreator() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        EventEnvelopeCreator.prototype.Create = function (logger, telemetryItem) {
            _super.prototype.Init.call(this, logger, telemetryItem);
            var customProperties = {};
            var customMeasurements = {};
            if (telemetryItem[strBaseType] !== Event.dataType) {
                customProperties['baseTypeSource'] = telemetryItem[strBaseType];
            }
            if (telemetryItem[strBaseType] === Event.dataType) {
                customProperties = telemetryItem[strBaseData][strProperties] || {};
                customMeasurements = telemetryItem[strBaseData].measurements || {};
            }
            else {
                if (telemetryItem[strBaseData]) {
                    EnvelopeCreator.extractPropsAndMeasurements(telemetryItem[strBaseData], customProperties, customMeasurements);
                }
            }
            EnvelopeCreator.extractPropsAndMeasurements(telemetryItem.data, customProperties, customMeasurements);
            var eventName = telemetryItem[strBaseData].name;
            var eventData = new Event(logger, eventName, customProperties, customMeasurements);
            var data = new Data(Event.dataType, eventData);
            return EnvelopeCreator.createEnvelope(logger, Event.envelopeType, telemetryItem, data);
        };
        EventEnvelopeCreator.EventEnvelopeCreator = new EventEnvelopeCreator();
        return EventEnvelopeCreator;
    }(EnvelopeCreator));
    var ExceptionEnvelopeCreator = /** @class */ (function (_super) {
        __extendsFn(ExceptionEnvelopeCreator, _super);
        function ExceptionEnvelopeCreator() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        ExceptionEnvelopeCreator.prototype.Create = function (logger, telemetryItem) {
            _super.prototype.Init.call(this, logger, telemetryItem);
            var customMeasurements = telemetryItem[strBaseData].measurements || {};
            var customProperties = telemetryItem[strBaseData][strProperties] || {};
            EnvelopeCreator.extractPropsAndMeasurements(telemetryItem.data, customProperties, customMeasurements);
            var bd = telemetryItem[strBaseData];
            var exData = Exception.CreateFromInterface(logger, bd, customProperties, customMeasurements);
            var data = new Data(Exception.dataType, exData);
            return EnvelopeCreator.createEnvelope(logger, Exception.envelopeType, telemetryItem, data);
        };
        ExceptionEnvelopeCreator.ExceptionEnvelopeCreator = new ExceptionEnvelopeCreator();
        return ExceptionEnvelopeCreator;
    }(EnvelopeCreator));
    var MetricEnvelopeCreator = /** @class */ (function (_super) {
        __extendsFn(MetricEnvelopeCreator, _super);
        function MetricEnvelopeCreator() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        MetricEnvelopeCreator.prototype.Create = function (logger, telemetryItem) {
            _super.prototype.Init.call(this, logger, telemetryItem);
            var baseData = telemetryItem[strBaseData];
            var props = baseData[strProperties] || {};
            var measurements = baseData.measurements || {};
            EnvelopeCreator.extractPropsAndMeasurements(telemetryItem.data, props, measurements);
            var baseMetricData = new Metric(logger, baseData.name, baseData.average, baseData.sampleCount, baseData.min, baseData.max, props, measurements);
            var data = new Data(Metric.dataType, baseMetricData);
            return EnvelopeCreator.createEnvelope(logger, Metric.envelopeType, telemetryItem, data);
        };
        MetricEnvelopeCreator.MetricEnvelopeCreator = new MetricEnvelopeCreator();
        return MetricEnvelopeCreator;
    }(EnvelopeCreator));
    var PageViewEnvelopeCreator = /** @class */ (function (_super) {
        __extendsFn(PageViewEnvelopeCreator, _super);
        function PageViewEnvelopeCreator() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        PageViewEnvelopeCreator.prototype.Create = function (logger, telemetryItem) {
            _super.prototype.Init.call(this, logger, telemetryItem);
            var strDuration = "duration";
            var duration;
            var baseData = telemetryItem[strBaseData];
            if (!isNullOrUndefined(baseData) &&
                !isNullOrUndefined(baseData[strProperties]) &&
                !isNullOrUndefined(baseData[strProperties][strDuration])) {
                duration = baseData[strProperties][strDuration];
                delete baseData[strProperties][strDuration];
            }
            else if (!isNullOrUndefined(telemetryItem.data) &&
                !isNullOrUndefined(telemetryItem.data[strDuration])) {
                duration = telemetryItem.data[strDuration];
                delete telemetryItem.data[strDuration];
            }
            var bd = telemetryItem[strBaseData];
            var currentContextId;
            if (((telemetryItem.ext || {}).trace || {}).traceID) {
                currentContextId = telemetryItem.ext.trace.traceID;
            }
            var id = bd.id || currentContextId;
            var name = bd.name;
            var url = bd.uri;
            var properties = bd[strProperties] || {};
            var measurements = bd.measurements || {};
            if (!isNullOrUndefined(bd.refUri)) {
                properties["refUri"] = bd.refUri;
            }
            if (!isNullOrUndefined(bd.pageType)) {
                properties["pageType"] = bd.pageType;
            }
            if (!isNullOrUndefined(bd.isLoggedIn)) {
                properties["isLoggedIn"] = bd.isLoggedIn.toString();
            }
            if (!isNullOrUndefined(bd[strProperties])) {
                var pageTags = bd[strProperties];
                objForEachKey(pageTags, function (key, value) {
                    properties[key] = value;
                });
            }
            EnvelopeCreator.extractPropsAndMeasurements(telemetryItem.data, properties, measurements);
            var pageViewData = new PageView(logger, name, url, duration, properties, measurements, id);
            var data = new Data(PageView.dataType, pageViewData);
            return EnvelopeCreator.createEnvelope(logger, PageView.envelopeType, telemetryItem, data);
        };
        PageViewEnvelopeCreator.PageViewEnvelopeCreator = new PageViewEnvelopeCreator();
        return PageViewEnvelopeCreator;
    }(EnvelopeCreator));
    var PageViewPerformanceEnvelopeCreator = /** @class */ (function (_super) {
        __extendsFn(PageViewPerformanceEnvelopeCreator, _super);
        function PageViewPerformanceEnvelopeCreator() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        PageViewPerformanceEnvelopeCreator.prototype.Create = function (logger, telemetryItem) {
            _super.prototype.Init.call(this, logger, telemetryItem);
            var bd = telemetryItem[strBaseData];
            var name = bd.name;
            var url = bd.uri || bd.url;
            var properties = bd[strProperties] || {};
            var measurements = bd.measurements || {};
            EnvelopeCreator.extractPropsAndMeasurements(telemetryItem.data, properties, measurements);
            var baseData = new PageViewPerformance(logger, name, url, undefined, properties, measurements, bd);
            var data = new Data(PageViewPerformance.dataType, baseData);
            return EnvelopeCreator.createEnvelope(logger, PageViewPerformance.envelopeType, telemetryItem, data);
        };
        PageViewPerformanceEnvelopeCreator.PageViewPerformanceEnvelopeCreator = new PageViewPerformanceEnvelopeCreator();
        return PageViewPerformanceEnvelopeCreator;
    }(EnvelopeCreator));
    var TraceEnvelopeCreator = /** @class */ (function (_super) {
        __extendsFn(TraceEnvelopeCreator, _super);
        function TraceEnvelopeCreator() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        TraceEnvelopeCreator.prototype.Create = function (logger, telemetryItem) {
            _super.prototype.Init.call(this, logger, telemetryItem);
            var message = telemetryItem[strBaseData].message;
            var severityLevel = telemetryItem[strBaseData].severityLevel;
            var props = telemetryItem[strBaseData][strProperties] || {};
            var measurements = telemetryItem[strBaseData].measurements || {};
            EnvelopeCreator.extractPropsAndMeasurements(telemetryItem.data, props, measurements);
            var baseData = new Trace(logger, message, severityLevel, props, measurements);
            var data = new Data(Trace.dataType, baseData);
            return EnvelopeCreator.createEnvelope(logger, Trace.envelopeType, telemetryItem, data);
        };
        TraceEnvelopeCreator.TraceEnvelopeCreator = new TraceEnvelopeCreator();
        return TraceEnvelopeCreator;
    }(EnvelopeCreator));

    var Serializer = /** @class */ (function () {
        function Serializer(logger) {
            dynamicProto(Serializer, this, function (_self) {
                _self.serialize = function (input) {
                    var output = _serializeObject(input, "root");
                    try {
                        return getJSON().stringify(output);
                    }
                    catch (e) {
                        logger.throwInternal(LoggingSeverity.CRITICAL, _InternalMessageId.CannotSerializeObject, (e && isFunction(e.toString)) ? e.toString() : "Error serializing object", null, true);
                    }
                };
                function _serializeObject(source, name) {
                    var circularReferenceCheck = "__aiCircularRefCheck";
                    var output = {};
                    if (!source) {
                        logger.throwInternal(LoggingSeverity.CRITICAL, _InternalMessageId.CannotSerializeObject, "cannot serialize object because it is null or undefined", { name: name }, true);
                        return output;
                    }
                    if (source[circularReferenceCheck]) {
                        logger.throwInternal(LoggingSeverity.WARNING, _InternalMessageId.CircularReferenceDetected, "Circular reference detected while serializing object", { name: name }, true);
                        return output;
                    }
                    if (!source.aiDataContract) {
                        if (name === "measurements") {
                            output = _serializeStringMap(source, "number", name);
                        }
                        else if (name === "properties") {
                            output = _serializeStringMap(source, "string", name);
                        }
                        else if (name === "tags") {
                            output = _serializeStringMap(source, "string", name);
                        }
                        else if (isArray(source)) {
                            output = _serializeArray(source, name);
                        }
                        else {
                            logger.throwInternal(LoggingSeverity.WARNING, _InternalMessageId.CannotSerializeObjectNonSerializable, "Attempting to serialize an object which does not implement ISerializable", { name: name }, true);
                            try {
                                getJSON().stringify(source);
                                output = source;
                            }
                            catch (e) {
                                logger.throwInternal(LoggingSeverity.CRITICAL, _InternalMessageId.CannotSerializeObject, (e && isFunction(e.toString)) ? e.toString() : "Error serializing object", null, true);
                            }
                        }
                        return output;
                    }
                    source[circularReferenceCheck] = true;
                    objForEachKey(source.aiDataContract, function (field, contract) {
                        var isRequired = (isFunction(contract)) ? (contract() & 1 ) : (contract & 1 );
                        var isHidden = (isFunction(contract)) ? (contract() & 4 ) : (contract & 4 );
                        var isArray = contract & 2 ;
                        var isPresent = source[field] !== undefined;
                        var isObj = isObject(source[field]) && source[field] !== null;
                        if (isRequired && !isPresent && !isArray) {
                            logger.throwInternal(LoggingSeverity.CRITICAL, _InternalMessageId.MissingRequiredFieldSpecification, "Missing required field specification. The field is required but not present on source", { field: field, name: name });
                        }
                        else if (!isHidden) {
                            var value = void 0;
                            if (isObj) {
                                if (isArray) {
                                    value = _serializeArray(source[field], field);
                                }
                                else {
                                    value = _serializeObject(source[field], field);
                                }
                            }
                            else {
                                value = source[field];
                            }
                            if (value !== undefined) {
                                output[field] = value;
                            }
                        }
                    });
                    delete source[circularReferenceCheck];
                    return output;
                }
                function _serializeArray(sources, name) {
                    var output;
                    if (!!sources) {
                        if (!isArray(sources)) {
                            logger.throwInternal(LoggingSeverity.CRITICAL, _InternalMessageId.ItemNotInArray, "This field was specified as an array in the contract but the item is not an array.\r\n", { name: name }, true);
                        }
                        else {
                            output = [];
                            for (var i = 0; i < sources.length; i++) {
                                var source = sources[i];
                                var item = _serializeObject(source, name + "[" + i + "]");
                                output.push(item);
                            }
                        }
                    }
                    return output;
                }
                function _serializeStringMap(map, expectedType, name) {
                    var output;
                    if (map) {
                        output = {};
                        objForEachKey(map, function (field, value) {
                            if (expectedType === "string") {
                                if (value === undefined) {
                                    output[field] = "undefined";
                                }
                                else if (value === null) {
                                    output[field] = "null";
                                }
                                else if (!value.toString) {
                                    output[field] = "invalid field: toString() is not defined.";
                                }
                                else {
                                    output[field] = value.toString();
                                }
                            }
                            else if (expectedType === "number") {
                                if (value === undefined) {
                                    output[field] = "undefined";
                                }
                                else if (value === null) {
                                    output[field] = "null";
                                }
                                else {
                                    var num = parseFloat(value);
                                    if (isNaN(num)) {
                                        output[field] = "NaN";
                                    }
                                    else {
                                        output[field] = num;
                                    }
                                }
                            }
                            else {
                                output[field] = "invalid field: " + name + " is of unknown type.";
                                logger.throwInternal(LoggingSeverity.CRITICAL, output[field], null, true);
                            }
                        });
                    }
                    return output;
                }
            });
        }
        return Serializer;
    }());

    var OfflineListener = /** @class */ (function () {
        function OfflineListener() {
            var _window = getWindow();
            var _document = getDocument();
            var isListening = false;
            var _onlineStatus = true;
            dynamicProto(OfflineListener, this, function (_self) {
                try {
                    if (_window) {
                        if (EventHelper.Attach(_window, 'online', _setOnline)) {
                            EventHelper.Attach(_window, 'offline', _setOffline);
                            isListening = true;
                        }
                    }
                    if (_document) {
                        var target = _document.body || _document;
                        if (!isUndefined(target.ononline)) {
                            target.ononline = _setOnline;
                            target.onoffline = _setOffline;
                            isListening = true;
                        }
                    }
                    if (isListening) {
                        var _navigator = getNavigator();
                        if (_navigator && !isNullOrUndefined(_navigator.onLine)) {
                            _onlineStatus = _navigator.onLine;
                        }
                    }
                }
                catch (e) {
                    isListening = false;
                }
                _self.isListening = isListening;
                _self.isOnline = function () {
                    var result = true;
                    var _navigator = getNavigator();
                    if (isListening) {
                        result = _onlineStatus;
                    }
                    else if (_navigator && !isNullOrUndefined(_navigator.onLine)) {
                        result = _navigator.onLine;
                    }
                    return result;
                };
                _self.isOffline = function () {
                    return !_self.isOnline();
                };
                function _setOnline() {
                    _onlineStatus = true;
                }
                function _setOffline() {
                    _onlineStatus = false;
                }
            });
        }
        OfflineListener.Offline = new OfflineListener;
        return OfflineListener;
    }());
    var Offline = OfflineListener.Offline;

    var HashCodeScoreGenerator = /** @class */ (function () {
        function HashCodeScoreGenerator() {
        }
        HashCodeScoreGenerator.prototype.getHashCodeScore = function (key) {
            var score = this.getHashCode(key) / HashCodeScoreGenerator.INT_MAX_VALUE;
            return score * 100;
        };
        HashCodeScoreGenerator.prototype.getHashCode = function (input) {
            if (input === "") {
                return 0;
            }
            while (input.length < HashCodeScoreGenerator.MIN_INPUT_LENGTH) {
                input = input.concat(input);
            }
            var hash = 5381;
            for (var i = 0; i < input.length; ++i) {
                hash = ((hash << 5) + hash) + input.charCodeAt(i);
                hash = hash & hash;
            }
            return Math.abs(hash);
        };
        HashCodeScoreGenerator.INT_MAX_VALUE = 2147483647;
        HashCodeScoreGenerator.MIN_INPUT_LENGTH = 8;
        return HashCodeScoreGenerator;
    }());

    var SamplingScoreGenerator = /** @class */ (function () {
        function SamplingScoreGenerator() {
            this.hashCodeGeneragor = new HashCodeScoreGenerator();
            this.keys = new ContextTagKeys();
        }
        SamplingScoreGenerator.prototype.getSamplingScore = function (item) {
            var score = 0;
            if (item.tags && item.tags[this.keys.userId]) {
                score = this.hashCodeGeneragor.getHashCodeScore(item.tags[this.keys.userId]);
            }
            else if (item.ext && item.ext.user && item.ext.user.id) {
                score = this.hashCodeGeneragor.getHashCodeScore(item.ext.user.id);
            }
            else if (item.tags && item.tags[this.keys.operationId]) {
                score = this.hashCodeGeneragor.getHashCodeScore(item.tags[this.keys.operationId]);
            }
            else if (item.ext && item.ext.telemetryTrace && item.ext.telemetryTrace.traceID) {
                score = this.hashCodeGeneragor.getHashCodeScore(item.ext.telemetryTrace.traceID);
            }
            else {
                score = (Math.random() * 100);
            }
            return score;
        };
        return SamplingScoreGenerator;
    }());

    var Sample = /** @class */ (function () {
        function Sample(sampleRate, logger) {
            this.INT_MAX_VALUE = 2147483647;
            this._logger = logger || safeGetLogger(null);
            if (sampleRate > 100 || sampleRate < 0) {
                this._logger.throwInternal(LoggingSeverity.WARNING, _InternalMessageId.SampleRateOutOfRange, "Sampling rate is out of range (0..100). Sampling will be disabled, you may be sending too much data which may affect your AI service level.", { samplingRate: sampleRate }, true);
                sampleRate = 100;
            }
            this.sampleRate = sampleRate;
            this.samplingScoreGenerator = new SamplingScoreGenerator();
        }
        Sample.prototype.isSampledIn = function (envelope) {
            var samplingPercentage = this.sampleRate;
            var isSampledIn = false;
            if (samplingPercentage === null || samplingPercentage === undefined || samplingPercentage >= 100) {
                return true;
            }
            else if (envelope.baseType === Metric.dataType) {
                return true;
            }
            isSampledIn = this.samplingScoreGenerator.getSamplingScore(envelope) < samplingPercentage;
            return isSampledIn;
        };
        return Sample;
    }());

    function _getResponseText(xhr) {
        try {
            return xhr.responseText;
        }
        catch (e) {
        }
        return null;
    }
    var Sender = /** @class */ (function (_super) {
        __extendsFn(Sender, _super);
        function Sender() {
            var _this = _super.call(this) || this;
            _this.priority = 1001;
            _this.identifier = BreezeChannelIdentifier;
            _this._XMLHttpRequestSupported = false;
            var _consecutiveErrors;
            var _retryAt;
            var _lastSend;
            var _timeoutHandle;
            var _serializer;
            var _stamp_specific_redirects;
            var _headers = {};
            dynamicProto(Sender, _this, function (_self, _base) {
                function _notImplemented() {
                    throwError("Method not implemented.");
                }
                _self.pause = _notImplemented;
                _self.resume = _notImplemented;
                _self.flush = function () {
                    try {
                        _self.triggerSend(true, null, 1 );
                    }
                    catch (e) {
                        _self.diagLog().throwInternal(LoggingSeverity.CRITICAL, _InternalMessageId.FlushFailed, "flush failed, telemetry will not be collected: " + getExceptionName(e), { exception: dumpObj(e) });
                    }
                };
                _self.onunloadFlush = function () {
                    if ((_self._senderConfig.onunloadDisableBeacon() === false || _self._senderConfig.isBeaconApiDisabled() === false) && isBeaconApiSupported()) {
                        try {
                            _self.triggerSend(true, _beaconSender, 2 );
                        }
                        catch (e) {
                            _self.diagLog().throwInternal(LoggingSeverity.CRITICAL, _InternalMessageId.FailedToSendQueuedTelemetry, "failed to flush with beacon sender on page unload, telemetry will not be collected: " + getExceptionName(e), { exception: dumpObj(e) });
                        }
                    }
                    else {
                        _self.flush();
                    }
                };
                _self.teardown = _notImplemented;
                _self.addHeader = function (name, value) {
                    _headers[name] = value;
                };
                _self.initialize = function (config, core, extensions, pluginChain) {
                    _base.initialize(config, core, extensions, pluginChain);
                    var ctx = _self._getTelCtx();
                    var identifier = _self.identifier;
                    _serializer = new Serializer(core.logger);
                    _consecutiveErrors = 0;
                    _retryAt = null;
                    _lastSend = 0;
                    _self._sender = null;
                    _stamp_specific_redirects = 0;
                    var defaultConfig = Sender._getDefaultAppInsightsChannelConfig();
                    _self._senderConfig = Sender._getEmptyAppInsightsChannelConfig();
                    objForEachKey(defaultConfig, function (field, value) {
                        _self._senderConfig[field] = function () { return ctx.getConfig(identifier, field, value()); };
                    });
                    _self._buffer = (_self._senderConfig.enableSessionStorageBuffer() && utlCanUseSessionStorage())
                        ? new SessionStorageSendBuffer(_self.diagLog(), _self._senderConfig) : new ArraySendBuffer(_self._senderConfig);
                    _self._sample = new Sample(_self._senderConfig.samplingPercentage(), _self.diagLog());
                    if (!_validateInstrumentationKey(config)) {
                        _self.diagLog().throwInternal(LoggingSeverity.CRITICAL, _InternalMessageId.InvalidInstrumentationKey, "Invalid Instrumentation key " + config.instrumentationKey);
                    }
                    if (!isInternalApplicationInsightsEndpoint(_self._senderConfig.endpointUrl()) && _self._senderConfig.customHeaders() && _self._senderConfig.customHeaders().length > 0) {
                        arrForEach(_self._senderConfig.customHeaders(), function (customHeader) {
                            _this.addHeader(customHeader.header, customHeader.value);
                        });
                    }
                    if (!_self._senderConfig.isBeaconApiDisabled() && isBeaconApiSupported()) {
                        _self._sender = _beaconSender;
                    }
                    else {
                        var xhr = getGlobalInst("XMLHttpRequest");
                        if (xhr) {
                            var testXhr = new xhr();
                            if ("withCredentials" in testXhr) {
                                _self._sender = _xhrSender;
                                _self._XMLHttpRequestSupported = true;
                            }
                            else if (typeof XDomainRequest !== strShimUndefined) {
                                _self._sender = _xdrSender;
                            }
                        }
                        else {
                            var fetch_1 = getGlobalInst("fetch");
                            if (fetch_1) {
                                _self._sender = _fetchSender;
                            }
                        }
                    }
                };
                _self.processTelemetry = function (telemetryItem, itemCtx) {
                    itemCtx = _self._getTelCtx(itemCtx);
                    try {
                        if (_self._senderConfig.disableTelemetry()) {
                            return;
                        }
                        if (!telemetryItem) {
                            itemCtx.diagLog().throwInternal(LoggingSeverity.CRITICAL, _InternalMessageId.CannotSendEmptyTelemetry, "Cannot send empty telemetry");
                            return;
                        }
                        if (telemetryItem.baseData && !telemetryItem.baseType) {
                            itemCtx.diagLog().throwInternal(LoggingSeverity.CRITICAL, _InternalMessageId.InvalidEvent, "Cannot send telemetry without baseData and baseType");
                            return;
                        }
                        if (!telemetryItem.baseType) {
                            telemetryItem.baseType = "EventData";
                        }
                        if (!_self._sender) {
                            itemCtx.diagLog().throwInternal(LoggingSeverity.CRITICAL, _InternalMessageId.SenderNotInitialized, "Sender was not initialized");
                            return;
                        }
                        if (!_isSampledIn(telemetryItem)) {
                            itemCtx.diagLog().throwInternal(LoggingSeverity.WARNING, _InternalMessageId.TelemetrySampledAndNotSent, "Telemetry item was sampled out and not sent", { SampleRate: _self._sample.sampleRate });
                            return;
                        }
                        else {
                            telemetryItem[SampleRate] = _self._sample.sampleRate;
                        }
                        var aiEnvelope_1 = Sender.constructEnvelope(telemetryItem, _self._senderConfig.instrumentationKey(), itemCtx.diagLog());
                        if (!aiEnvelope_1) {
                            itemCtx.diagLog().throwInternal(LoggingSeverity.CRITICAL, _InternalMessageId.CreateEnvelopeError, "Unable to create an AppInsights envelope");
                            return;
                        }
                        var doNotSendItem_1 = false;
                        if (telemetryItem.tags && telemetryItem.tags[ProcessLegacy]) {
                            arrForEach(telemetryItem.tags[ProcessLegacy], function (callBack) {
                                try {
                                    if (callBack && callBack(aiEnvelope_1) === false) {
                                        doNotSendItem_1 = true;
                                        itemCtx.diagLog().warnToConsole("Telemetry processor check returns false");
                                    }
                                }
                                catch (e) {
                                    itemCtx.diagLog().throwInternal(LoggingSeverity.CRITICAL, _InternalMessageId.TelemetryInitializerFailed, "One of telemetry initializers failed, telemetry item will not be sent: " + getExceptionName(e), { exception: dumpObj(e) }, true);
                                }
                            });
                            delete telemetryItem.tags[ProcessLegacy];
                        }
                        if (doNotSendItem_1) {
                            return;
                        }
                        var payload = _serializer.serialize(aiEnvelope_1);
                        var bufferPayload = _self._buffer.getItems();
                        var batch = _self._buffer.batchPayloads(bufferPayload);
                        if (batch && (batch.length + payload.length > _self._senderConfig.maxBatchSizeInBytes())) {
                            _self.triggerSend(true, null, 10 );
                        }
                        _self._buffer.enqueue(payload);
                        _setupTimer();
                    }
                    catch (e) {
                        itemCtx.diagLog().throwInternal(LoggingSeverity.WARNING, _InternalMessageId.FailedAddingTelemetryToBuffer, "Failed adding telemetry to the sender's buffer, some telemetry will be lost: " + getExceptionName(e), { exception: dumpObj(e) });
                    }
                    _self.processNext(telemetryItem, itemCtx);
                };
                _self._xhrReadyStateChange = function (xhr, payload, countOfItemsInPayload) {
                    if (xhr.readyState === 4) {
                        _checkResponsStatus(xhr.status, payload, xhr.responseURL, countOfItemsInPayload, _formatErrorMessageXhr(xhr), _getResponseText(xhr) || xhr.response);
                    }
                };
                _self.triggerSend = function (async, forcedSender, sendReason) {
                    if (async === void 0) { async = true; }
                    try {
                        if (!_self._senderConfig.disableTelemetry()) {
                            if (_self._buffer.count() > 0) {
                                var payload = _self._buffer.getItems();
                                _notifySendRequest(sendReason || 0 , async);
                                if (forcedSender) {
                                    forcedSender.call(_this, payload, async);
                                }
                                else {
                                    _self._sender(payload, async);
                                }
                            }
                            _lastSend = +new Date;
                        }
                        else {
                            _self._buffer.clear();
                        }
                        clearTimeout(_timeoutHandle);
                        _timeoutHandle = null;
                        _retryAt = null;
                    }
                    catch (e) {
                        var ieVer = getIEVersion();
                        if (!ieVer || ieVer > 9) {
                            _self.diagLog().throwInternal(LoggingSeverity.CRITICAL, _InternalMessageId.TransmissionFailed, "Telemetry transmission failed, some telemetry will be lost: " + getExceptionName(e), { exception: dumpObj(e) });
                        }
                    }
                };
                _self._onError = function (payload, message, event) {
                    _self.diagLog().throwInternal(LoggingSeverity.WARNING, _InternalMessageId.OnError, "Failed to send telemetry.", { message: message });
                    _self._buffer.clearSent(payload);
                };
                _self._onPartialSuccess = function (payload, results) {
                    var failed = [];
                    var retry = [];
                    var errors = results.errors.reverse();
                    for (var _i = 0, errors_1 = errors; _i < errors_1.length; _i++) {
                        var error = errors_1[_i];
                        var extracted = payload.splice(error.index, 1)[0];
                        if (_isRetriable(error.statusCode)) {
                            retry.push(extracted);
                        }
                        else {
                            failed.push(extracted);
                        }
                    }
                    if (payload.length > 0) {
                        _self._onSuccess(payload, results.itemsAccepted);
                    }
                    if (failed.length > 0) {
                        _self._onError(failed, _formatErrorMessageXhr(null, ['partial success', results.itemsAccepted, 'of', results.itemsReceived].join(' ')));
                    }
                    if (retry.length > 0) {
                        _resendPayload(retry);
                        _self.diagLog().throwInternal(LoggingSeverity.WARNING, _InternalMessageId.TransmissionFailed, "Partial success. " +
                            "Delivered: " + payload.length + ", Failed: " + failed.length +
                            ". Will retry to send " + retry.length + " our of " + results.itemsReceived + " items");
                    }
                };
                _self._onSuccess = function (payload, countOfItemsInPayload) {
                    _self._buffer.clearSent(payload);
                };
                _self._xdrOnLoad = function (xdr, payload) {
                    var responseText = _getResponseText(xdr);
                    if (xdr && (responseText + "" === "200" || responseText === "")) {
                        _consecutiveErrors = 0;
                        _self._onSuccess(payload, 0);
                    }
                    else {
                        var results = _parseResponse(responseText);
                        if (results && results.itemsReceived && results.itemsReceived > results.itemsAccepted
                            && !_self._senderConfig.isRetryDisabled()) {
                            _self._onPartialSuccess(payload, results);
                        }
                        else {
                            _self._onError(payload, _formatErrorMessageXdr(xdr));
                        }
                    }
                };
                function _isSampledIn(envelope) {
                    return _self._sample.isSampledIn(envelope);
                }
                function _checkResponsStatus(status, payload, responseUrl, countOfItemsInPayload, errorMessage, res) {
                    var response = null;
                    if (!_self._appId) {
                        response = _parseResponse(res);
                        if (response && response.appId) {
                            _self._appId = response.appId;
                        }
                    }
                    if ((status < 200 || status >= 300) && status !== 0) {
                        if (status === 301 || status === 307 || status === 308) {
                            if (!_checkAndUpdateEndPointUrl(responseUrl)) {
                                _self._onError(payload, errorMessage);
                                return;
                            }
                        }
                        if (!_self._senderConfig.isRetryDisabled() && _isRetriable(status)) {
                            _resendPayload(payload);
                            _self.diagLog().throwInternal(LoggingSeverity.WARNING, _InternalMessageId.TransmissionFailed, ". " +
                                "Response code " + status + ". Will retry to send " + payload.length + " items.");
                        }
                        else {
                            _self._onError(payload, errorMessage);
                        }
                    }
                    else if (Offline.isOffline()) {
                        if (!_self._senderConfig.isRetryDisabled()) {
                            var offlineBackOffMultiplier = 10;
                            _resendPayload(payload, offlineBackOffMultiplier);
                            _self.diagLog().throwInternal(LoggingSeverity.WARNING, _InternalMessageId.TransmissionFailed, ". Offline - Response Code: " + status + ". Offline status: " + Offline.isOffline() + ". Will retry to send " + payload.length + " items.");
                        }
                    }
                    else {
                        _checkAndUpdateEndPointUrl(responseUrl);
                        if (status === 206) {
                            if (!response) {
                                response = _parseResponse(res);
                            }
                            if (response && !_self._senderConfig.isRetryDisabled()) {
                                _self._onPartialSuccess(payload, response);
                            }
                            else {
                                _self._onError(payload, errorMessage);
                            }
                        }
                        else {
                            _consecutiveErrors = 0;
                            _self._onSuccess(payload, countOfItemsInPayload);
                        }
                    }
                }
                function _checkAndUpdateEndPointUrl(responseUrl) {
                    if (_stamp_specific_redirects >= 10) {
                        return false;
                    }
                    if (!isNullOrUndefined(responseUrl) && responseUrl !== '') {
                        if (responseUrl !== _self._senderConfig.endpointUrl()) {
                            _self._senderConfig.endpointUrl = function () { return responseUrl; };
                            ++_stamp_specific_redirects;
                            return true;
                        }
                    }
                    return false;
                }
                function _beaconSender(payload, isAsync) {
                    var url = _self._senderConfig.endpointUrl();
                    var batch = _self._buffer.batchPayloads(payload);
                    var plainTextBatch = new Blob([batch], { type: 'text/plain;charset=UTF-8' });
                    var queued = getNavigator().sendBeacon(url, plainTextBatch);
                    if (queued) {
                        _self._buffer.markAsSent(payload);
                        _self._onSuccess(payload, payload.length);
                    }
                    else {
                        _xhrSender(payload, true);
                        _self.diagLog().throwInternal(LoggingSeverity.WARNING, _InternalMessageId.TransmissionFailed, ". " + "Failed to send telemetry with Beacon API, retried with xhrSender.");
                    }
                }
                function _xhrSender(payload, isAsync) {
                    var xhr = new XMLHttpRequest();
                    var endPointUrl = _self._senderConfig.endpointUrl();
                    try {
                        xhr[DisabledPropertyName] = true;
                    }
                    catch (e) {
                    }
                    xhr.open("POST", endPointUrl, isAsync);
                    xhr.setRequestHeader("Content-type", "application/json");
                    if (isInternalApplicationInsightsEndpoint(endPointUrl)) {
                        xhr.setRequestHeader(RequestHeaders.sdkContextHeader, RequestHeaders.sdkContextHeaderAppIdRequest);
                    }
                    arrForEach(objKeys(_headers), function (headerName) {
                        xhr.setRequestHeader(headerName, _headers[headerName]);
                    });
                    xhr.onreadystatechange = function () { return _self._xhrReadyStateChange(xhr, payload, payload.length); };
                    xhr.onerror = function (event) { return _self._onError(payload, _formatErrorMessageXhr(xhr), event); };
                    var batch = _self._buffer.batchPayloads(payload);
                    xhr.send(batch);
                    _self._buffer.markAsSent(payload);
                }
                function _fetchSender(payload, isAsync) {
                    var endPointUrl = _self._senderConfig.endpointUrl();
                    var batch = _self._buffer.batchPayloads(payload);
                    var plainTextBatch = new Blob([batch], { type: 'text/plain;charset=UTF-8' });
                    var requestHeaders = new Headers();
                    if (isInternalApplicationInsightsEndpoint(endPointUrl)) {
                        requestHeaders.append(RequestHeaders.sdkContextHeader, RequestHeaders.sdkContextHeaderAppIdRequest);
                    }
                    arrForEach(objKeys(_headers), function (headerName) {
                        requestHeaders.append(headerName, _headers[headerName]);
                    });
                    var init = {
                        method: "POST",
                        headers: requestHeaders,
                        body: plainTextBatch
                    };
                    var request = new Request(endPointUrl, init);
                    fetch(request).then(function (response) {
                        if (!response.ok) {
                            throw Error(response.statusText);
                        }
                        else {
                            response.text().then(function (text) {
                                _checkResponsStatus(response.status, payload, response.url, payload.length, response.statusText, text);
                            });
                            _self._buffer.markAsSent(payload);
                        }
                    })["catch"](function (error) {
                        _self._onError(payload, error.message);
                    });
                }
                function _parseResponse(response) {
                    try {
                        if (response && response !== "") {
                            var result = getJSON().parse(response);
                            if (result && result.itemsReceived && result.itemsReceived >= result.itemsAccepted &&
                                result.itemsReceived - result.itemsAccepted === result.errors.length) {
                                return result;
                            }
                        }
                    }
                    catch (e) {
                        _self.diagLog().throwInternal(LoggingSeverity.CRITICAL, _InternalMessageId.InvalidBackendResponse, "Cannot parse the response. " + getExceptionName(e), {
                            response: response
                        });
                    }
                    return null;
                }
                function _resendPayload(payload, linearFactor) {
                    if (linearFactor === void 0) { linearFactor = 1; }
                    if (!payload || payload.length === 0) {
                        return;
                    }
                    _self._buffer.clearSent(payload);
                    _consecutiveErrors++;
                    for (var _i = 0, payload_1 = payload; _i < payload_1.length; _i++) {
                        var item = payload_1[_i];
                        _self._buffer.enqueue(item);
                    }
                    _setRetryTime(linearFactor);
                    _setupTimer();
                }
                function _setRetryTime(linearFactor) {
                    var SlotDelayInSeconds = 10;
                    var delayInSeconds;
                    if (_consecutiveErrors <= 1) {
                        delayInSeconds = SlotDelayInSeconds;
                    }
                    else {
                        var backOffSlot = (Math.pow(2, _consecutiveErrors) - 1) / 2;
                        var backOffDelay = Math.floor(Math.random() * backOffSlot * SlotDelayInSeconds) + 1;
                        backOffDelay = linearFactor * backOffDelay;
                        delayInSeconds = Math.max(Math.min(backOffDelay, 3600), SlotDelayInSeconds);
                    }
                    var retryAfterTimeSpan = dateNow() + (delayInSeconds * 1000);
                    _retryAt = retryAfterTimeSpan;
                }
                function _setupTimer() {
                    if (!_timeoutHandle) {
                        var retryInterval = _retryAt ? Math.max(0, _retryAt - dateNow()) : 0;
                        var timerValue = Math.max(_self._senderConfig.maxBatchInterval(), retryInterval);
                        _timeoutHandle = setTimeout(function () {
                            _self.triggerSend(true, null, 1 );
                        }, timerValue);
                    }
                }
                function _isRetriable(statusCode) {
                    return statusCode === 408
                        || statusCode === 429
                        || statusCode === 500
                        || statusCode === 503;
                }
                function _formatErrorMessageXhr(xhr, message) {
                    if (xhr) {
                        return "XMLHttpRequest,Status:" + xhr.status + ",Response:" + _getResponseText(xhr) || xhr.response || "";
                    }
                    return message;
                }
                function _xdrSender(payload, isAsync) {
                    var _window = getWindow();
                    var xdr = new XDomainRequest();
                    xdr.onload = function () { return _self._xdrOnLoad(xdr, payload); };
                    xdr.onerror = function (event) { return _self._onError(payload, _formatErrorMessageXdr(xdr), event); };
                    var hostingProtocol = _window && _window.location && _window.location.protocol || "";
                    if (_self._senderConfig.endpointUrl().lastIndexOf(hostingProtocol, 0) !== 0) {
                        _self.diagLog().throwInternal(LoggingSeverity.WARNING, _InternalMessageId.TransmissionFailed, ". " +
                            "Cannot send XDomain request. The endpoint URL protocol doesn't match the hosting page protocol.");
                        _self._buffer.clear();
                        return;
                    }
                    var endpointUrl = _self._senderConfig.endpointUrl().replace(/^(https?:)/, "");
                    xdr.open('POST', endpointUrl);
                    var batch = _self._buffer.batchPayloads(payload);
                    xdr.send(batch);
                    _self._buffer.markAsSent(payload);
                }
                function _formatErrorMessageXdr(xdr, message) {
                    if (xdr) {
                        return "XDomainRequest,Response:" + _getResponseText(xdr) || "";
                    }
                    return message;
                }
                function _getNotifyMgr() {
                    var func = 'getNotifyMgr';
                    if (_self.core[func]) {
                        return _self.core[func]();
                    }
                    return _self.core['_notificationManager'];
                }
                function _notifySendRequest(sendRequest, isAsync) {
                    var manager = _getNotifyMgr();
                    if (manager && manager.eventsSendRequest) {
                        try {
                            manager.eventsSendRequest(sendRequest, isAsync);
                        }
                        catch (e) {
                            _self.diagLog().throwInternal(LoggingSeverity.CRITICAL, _InternalMessageId.NotificationException, "send request notification failed: " + getExceptionName(e), { exception: dumpObj(e) });
                        }
                    }
                }
                function _validateInstrumentationKey(config) {
                    var disableIKeyValidationFlag = isNullOrUndefined(config.disableInstrumentationKeyValidation) ? false : config.disableInstrumentationKeyValidation;
                    if (disableIKeyValidationFlag) {
                        return true;
                    }
                    var UUID_Regex = '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$';
                    var regexp = new RegExp(UUID_Regex);
                    return regexp.test(config.instrumentationKey);
                }
            });
            return _this;
        }
        Sender.constructEnvelope = function (orig, iKey, logger) {
            var envelope;
            if (iKey !== orig.iKey && !isNullOrUndefined(iKey)) {
                envelope = __assignFn({}, orig, { iKey: iKey });
            }
            else {
                envelope = orig;
            }
            switch (envelope.baseType) {
                case Event.dataType:
                    return EventEnvelopeCreator.EventEnvelopeCreator.Create(logger, envelope);
                case Trace.dataType:
                    return TraceEnvelopeCreator.TraceEnvelopeCreator.Create(logger, envelope);
                case PageView.dataType:
                    return PageViewEnvelopeCreator.PageViewEnvelopeCreator.Create(logger, envelope);
                case PageViewPerformance.dataType:
                    return PageViewPerformanceEnvelopeCreator.PageViewPerformanceEnvelopeCreator.Create(logger, envelope);
                case Exception.dataType:
                    return ExceptionEnvelopeCreator.ExceptionEnvelopeCreator.Create(logger, envelope);
                case Metric.dataType:
                    return MetricEnvelopeCreator.MetricEnvelopeCreator.Create(logger, envelope);
                case RemoteDependencyData.dataType:
                    return DependencyEnvelopeCreator.DependencyEnvelopeCreator.Create(logger, envelope);
                default:
                    return EventEnvelopeCreator.EventEnvelopeCreator.Create(logger, envelope);
            }
        };
        Sender._getDefaultAppInsightsChannelConfig = function () {
            return {
                endpointUrl: function () { return "https://dc.services.visualstudio.com/v2/track"; },
                emitLineDelimitedJson: function () { return false; },
                maxBatchInterval: function () { return 15000; },
                maxBatchSizeInBytes: function () { return 102400; },
                disableTelemetry: function () { return false; },
                enableSessionStorageBuffer: function () { return true; },
                isRetryDisabled: function () { return false; },
                isBeaconApiDisabled: function () { return true; },
                onunloadDisableBeacon: function () { return false; },
                instrumentationKey: function () { return undefined; },
                namePrefix: function () { return undefined; },
                samplingPercentage: function () { return 100; },
                customHeaders: function () { return undefined; }
            };
        };
        Sender._getEmptyAppInsightsChannelConfig = function () {
            return {
                endpointUrl: undefined,
                emitLineDelimitedJson: undefined,
                maxBatchInterval: undefined,
                maxBatchSizeInBytes: undefined,
                disableTelemetry: undefined,
                enableSessionStorageBuffer: undefined,
                isRetryDisabled: undefined,
                isBeaconApiDisabled: undefined,
                onunloadDisableBeacon: undefined,
                instrumentationKey: undefined,
                namePrefix: undefined,
                samplingPercentage: undefined,
                customHeaders: undefined
            };
        };
        return Sender;
    }(BaseTelemetryPlugin));

    exports.Sender = Sender;

    (function(obj, prop, descriptor) { /* ai_es3_polyfil defineProperty */ var func = Object["defineProperty"]; if (func) { try { return func(obj, prop, descriptor); } catch(e) { /* IE8 defines defineProperty, but will throw */ } } if (descriptor && typeof descriptor.value !== undefined) { obj[prop] = descriptor.value; } return obj; })(exports, '__esModule', { value: true });

})));//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/fe719cd3e5825bf14e14182fddeb88ee8daf044f/node_modules/@microsoft/applicationinsights-channel-js/browser/applicationinsights-channel-js.js.map
