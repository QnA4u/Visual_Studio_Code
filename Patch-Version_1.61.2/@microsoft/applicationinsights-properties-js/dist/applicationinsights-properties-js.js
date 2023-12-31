/*!
 * Application Insights JavaScript SDK - Properties Plugin, 2.6.4
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
    function isNotNullOrUndefined(value) {
        return !isNullOrUndefined(value);
    }
    function isObject(value) {
        return typeof value === strShimObject;
    }
    function isFunction(value) {
        return typeof value === strShimFunction;
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
    function strEndsWith(value, search) {
        if (value && search) {
            var searchLen = search.length;
            var valLen = value.length;
            if (value === search) {
                return true;
            }
            else if (valLen >= searchLen) {
                var pos = valLen - 1;
                for (var lp = searchLen - 1; lp >= 0; lp--) {
                    if (value[pos] != search[lp]) {
                        return false;
                    }
                    pos--;
                }
                return true;
            }
        }
        return false;
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
    function getSetValue(target, field, defValue) {
        var theValue;
        if (target) {
            theValue = target[field];
            if (!theValue && isNullOrUndefined(theValue)) {
                theValue = !isUndefined(defValue) ? defValue : {};
                target[field] = theValue;
            }
        }
        else {
            theValue = !isUndefined(defValue) ? defValue : {};
        }
        return theValue;
    }
    function isTruthy(value) {
        return !!value;
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

    var strWindow = "window";
    var strDocument = "document";
    var strNavigator = "navigator";
    var strLocation = "location";
    var strConsole = "console";
    var strJSON = "JSON";
    var strCrypto = "crypto";
    var strMsCrypto = "msCrypto";
    var strMsie = "msie";
    var strTrident = "trident/";
    var _isTrident = null;
    var _navUserAgentCheck = null;
    var _enableMocks = false;
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
    function getLocation(checkForMock) {
        if (checkForMock && _enableMocks) {
            var mockLocation = getGlobalInst("__mockLocation");
            if (mockLocation) {
                return mockLocation;
            }
        }
        if (typeof location === strShimObject && location) {
            return location;
        }
        return getGlobalInst(strLocation);
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
    function getCrypto() {
        return getGlobalInst(strCrypto);
    }
    function getMsCrypto() {
        return getGlobalInst(strMsCrypto);
    }
    function isIE() {
        var nav = getNavigator();
        if (nav && (nav.userAgent !== _navUserAgentCheck || _isTrident === null)) {
            _navUserAgentCheck = nav.userAgent;
            var userAgent = (_navUserAgentCheck || "").toLowerCase();
            _isTrident = (strContains(userAgent, strMsie) || strContains(userAgent, strTrident));
        }
        return _isTrident;
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

    var strToGMTString = "toGMTString";
    var strToUTCString = "toUTCString";
    var strCookie = "cookie";
    var strExpires = "expires";
    var strEnabled = "enabled";
    var strIsCookieUseDisabled = "isCookieUseDisabled";
    var strDisableCookiesUsage = "disableCookiesUsage";
    var strConfigCookieMgr = "_ckMgr";
    var strEmpty = "";
    var _supportsCookies = null;
    var _allowUaSameSite = null;
    var _parsedCookieValue = null;
    var _doc = getDocument();
    var _cookieCache = {};
    var _globalCookieConfig = {};
    function _gblCookieMgr(config, logger) {
        var inst = createCookieMgr[strConfigCookieMgr] || _globalCookieConfig[strConfigCookieMgr];
        if (!inst) {
            inst = createCookieMgr[strConfigCookieMgr] = createCookieMgr(config, logger);
            _globalCookieConfig[strConfigCookieMgr] = inst;
        }
        return inst;
    }
    function _isMgrEnabled(cookieMgr) {
        if (cookieMgr) {
            return cookieMgr.isEnabled();
        }
        return true;
    }
    function _createCookieMgrConfig(rootConfig) {
        var cookieMgrCfg = rootConfig.cookieCfg = rootConfig.cookieCfg || {};
        setValue(cookieMgrCfg, "domain", rootConfig.cookieDomain, isNotNullOrUndefined, isNullOrUndefined);
        setValue(cookieMgrCfg, "path", rootConfig.cookiePath || "/", null, isNullOrUndefined);
        if (isNullOrUndefined(cookieMgrCfg[strEnabled])) {
            var cookieEnabled = void 0;
            if (!isUndefined(rootConfig[strIsCookieUseDisabled])) {
                cookieEnabled = !rootConfig[strIsCookieUseDisabled];
            }
            if (!isUndefined(rootConfig[strDisableCookiesUsage])) {
                cookieEnabled = !rootConfig[strDisableCookiesUsage];
            }
            cookieMgrCfg[strEnabled] = cookieEnabled;
        }
        return cookieMgrCfg;
    }
    function safeGetCookieMgr(core, config) {
        var cookieMgr;
        if (core) {
            cookieMgr = core.getCookieMgr();
        }
        else if (config) {
            var cookieCfg = config.cookieCfg;
            if (cookieCfg[strConfigCookieMgr]) {
                cookieMgr = cookieCfg[strConfigCookieMgr];
            }
            else {
                cookieMgr = createCookieMgr(config);
            }
        }
        if (!cookieMgr) {
            cookieMgr = _gblCookieMgr(config, (core || {}).logger);
        }
        return cookieMgr;
    }
    function createCookieMgr(rootConfig, logger) {
        var cookieMgrConfig = _createCookieMgrConfig(rootConfig || _globalCookieConfig);
        var _path = cookieMgrConfig.path || "/";
        var _domain = cookieMgrConfig.domain;
        var _enabled = cookieMgrConfig[strEnabled] !== false;
        var cookieMgr = {
            isEnabled: function () {
                var enabled = _enabled && areCookiesSupported(logger);
                var gblManager = _globalCookieConfig[strConfigCookieMgr];
                if (enabled && gblManager && cookieMgr !== gblManager) {
                    enabled = _isMgrEnabled(gblManager);
                }
                return enabled;
            },
            setEnabled: function (value) {
                _enabled = value !== false;
            },
            set: function (name, value, maxAgeSec, domain, path) {
                if (_isMgrEnabled(cookieMgr)) {
                    var values = {};
                    var theValue = strTrim(value || strEmpty);
                    var idx = theValue.indexOf(";");
                    if (idx !== -1) {
                        theValue = strTrim(value.substring(0, idx));
                        values = _extractParts(value.substring(idx + 1));
                    }
                    setValue(values, "domain", domain || _domain, isTruthy, isUndefined);
                    if (!isNullOrUndefined(maxAgeSec)) {
                        var _isIE = isIE();
                        if (isUndefined(values[strExpires])) {
                            var nowMs = dateNow();
                            var expireMs = nowMs + (maxAgeSec * 1000);
                            if (expireMs > 0) {
                                var expiry = new Date();
                                expiry.setTime(expireMs);
                                setValue(values, strExpires, _formatDate(expiry, !_isIE ? strToUTCString : strToGMTString) || _formatDate(expiry, _isIE ? strToGMTString : strToUTCString) || strEmpty, isTruthy);
                            }
                        }
                        if (!_isIE) {
                            setValue(values, "max-age", strEmpty + maxAgeSec, null, isUndefined);
                        }
                    }
                    var location_1 = getLocation();
                    if (location_1 && location_1.protocol === "https:") {
                        setValue(values, "secure", null, null, isUndefined);
                        if (_allowUaSameSite === null) {
                            _allowUaSameSite = !uaDisallowsSameSiteNone((getNavigator() || {}).userAgent);
                        }
                        if (_allowUaSameSite) {
                            setValue(values, "SameSite", "None", null, isUndefined);
                        }
                    }
                    setValue(values, "path", path || _path, null, isUndefined);
                    var setCookieFn = cookieMgrConfig.setCookie || _setCookieValue;
                    setCookieFn(name, _formatCookieValue(theValue, values));
                }
            },
            get: function (name) {
                var value = strEmpty;
                if (_isMgrEnabled(cookieMgr)) {
                    value = (cookieMgrConfig.getCookie || _getCookieValue)(name);
                }
                return value;
            },
            del: function (name, path) {
                if (_isMgrEnabled(cookieMgr)) {
                    cookieMgr.purge(name, path);
                }
            },
            purge: function (name, path) {
                if (areCookiesSupported(logger)) {
                    var values = (_a = {},
                        _a["path"] = path ? path : "/",
                        _a[strExpires] = "Thu, 01 Jan 1970 00:00:01 GMT",
                        _a);
                    if (!isIE()) {
                        values["max-age"] = "0";
                    }
                    var delCookie = cookieMgrConfig.delCookie || _setCookieValue;
                    delCookie(name, _formatCookieValue(strEmpty, values));
                }
                var _a;
            }
        };
        cookieMgr[strConfigCookieMgr] = cookieMgr;
        return cookieMgr;
    }
    function areCookiesSupported(logger) {
        if (_supportsCookies === null) {
            _supportsCookies = false;
            try {
                var doc = _doc || {};
                _supportsCookies = doc[strCookie] !== undefined;
            }
            catch (e) {
                logger && logger.throwInternal(LoggingSeverity.WARNING, _InternalMessageId.CannotAccessCookie, "Cannot access document.cookie - " + getExceptionName(e), { exception: dumpObj(e) });
            }
        }
        return _supportsCookies;
    }
    function _extractParts(theValue) {
        var values = {};
        if (theValue && theValue.length) {
            var parts = strTrim(theValue).split(";");
            arrForEach(parts, function (thePart) {
                thePart = strTrim(thePart || strEmpty);
                if (thePart) {
                    var idx = thePart.indexOf("=");
                    if (idx === -1) {
                        values[thePart] = null;
                    }
                    else {
                        values[strTrim(thePart.substring(0, idx))] = strTrim(thePart.substring(idx + 1));
                    }
                }
            });
        }
        return values;
    }
    function _formatDate(theDate, func) {
        if (isFunction(theDate[func])) {
            return theDate[func]();
        }
        return null;
    }
    function _formatCookieValue(value, values) {
        var cookieValue = value || strEmpty;
        objForEachKey(values, function (name, theValue) {
            cookieValue += "; " + name + (!isNullOrUndefined(theValue) ? "=" + theValue : strEmpty);
        });
        return cookieValue;
    }
    function _getCookieValue(name) {
        var cookieValue = strEmpty;
        if (_doc) {
            var theCookie = _doc[strCookie] || strEmpty;
            if (_parsedCookieValue !== theCookie) {
                _cookieCache = _extractParts(theCookie);
                _parsedCookieValue = theCookie;
            }
            cookieValue = strTrim(_cookieCache[name] || strEmpty);
        }
        return cookieValue;
    }
    function _setCookieValue(name, cookieValue) {
        if (_doc) {
            _doc[strCookie] = name + "=" + cookieValue;
        }
    }
    function uaDisallowsSameSiteNone(userAgent) {
        if (!isString(userAgent)) {
            return false;
        }
        if (strContains(userAgent, "CPU iPhone OS 12") || strContains(userAgent, "iPad; CPU OS 12")) {
            return true;
        }
        if (strContains(userAgent, "Macintosh; Intel Mac OS X 10_14") && strContains(userAgent, "Version/") && strContains(userAgent, "Safari")) {
            return true;
        }
        if (strContains(userAgent, "Macintosh; Intel Mac OS X 10_14") && strEndsWith(userAgent, "AppleWebKit/605.1.15 (KHTML, like Gecko)")) {
            return true;
        }
        if (strContains(userAgent, "Chrome/5") || strContains(userAgent, "Chrome/6")) {
            return true;
        }
        if (strContains(userAgent, "UnrealEngine") && !strContains(userAgent, "Chrome")) {
            return true;
        }
        if (strContains(userAgent, "UCBrowser/12") || strContains(userAgent, "UCBrowser/11")) {
            return true;
        }
        return false;
    }

    var UInt32Mask = 0x100000000;
    var MaxUInt32 = 0xffffffff;
    var _mwcSeeded = false;
    var _mwcW = 123456789;
    var _mwcZ = 987654321;
    function _mwcSeed(seedValue) {
        if (seedValue < 0) {
            seedValue >>>= 0;
        }
        _mwcW = (123456789 + seedValue) & MaxUInt32;
        _mwcZ = (987654321 - seedValue) & MaxUInt32;
        _mwcSeeded = true;
    }
    function _autoSeedMwc() {
        try {
            var now = dateNow() & 0x7fffffff;
            _mwcSeed(((Math.random() * UInt32Mask) ^ now) + now);
        }
        catch (e) {
        }
    }
    function random32(signed) {
        var value;
        var c = getCrypto() || getMsCrypto();
        if (c && c.getRandomValues) {
            value = c.getRandomValues(new Uint32Array(1))[0] & MaxUInt32;
        }
        else if (isIE()) {
            if (!_mwcSeeded) {
                _autoSeedMwc();
            }
            value = mwcRandom32() & MaxUInt32;
        }
        else {
            value = Math.floor((UInt32Mask * Math.random()) | 0);
        }
        if (!signed) {
            value >>>= 0;
        }
        return value;
    }
    function mwcRandom32(signed) {
        _mwcZ = (36969 * (_mwcZ & 0xFFFF) + (_mwcZ >> 16)) & MaxUInt32;
        _mwcW = (18000 * (_mwcW & 0xFFFF) + (_mwcW >> 16)) & MaxUInt32;
        var value = (((_mwcZ << 16) + (_mwcW & 0xFFFF)) >>> 0) & MaxUInt32 | 0;
        if (!signed) {
            value >>>= 0;
        }
        return value;
    }

    function newId(maxLength) {
        if (maxLength === void 0) { maxLength = 22; }
        var base64chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
        var number = random32() >>> 0;
        var chars = 0;
        var result = "";
        while (result.length < maxLength) {
            chars++;
            result += base64chars.charAt(number & 0x3F);
            number >>>= 6;
            if (chars === 5) {
                number = (((random32() << 2) & 0xFFFFFFFF) | (number & 0x03)) >>> 0;
                chars = 0;
            }
        }
        return result;
    }
    function generateW3CId() {
        var hexValues = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f"];
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
        var clockSequenceHi = hexValues[8 + (random32() & 0x03) | 0];
        return oct.substr(0, 8) + oct.substr(9, 4) + "4" + oct.substr(13, 3) + clockSequenceHi + oct.substr(16, 3) + oct.substr(19, 12);
    }

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
    function getExtensionByName(extensions, identifier) {
        var extension = null;
        arrForEach(extensions, function (value) {
            if (value.identifier === identifier) {
                extension = value;
                return -1;
            }
        });
        return extension;
    }

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

    var _canUseLocalStorage = undefined;
    function _getLocalStorageObject() {
        if (utlCanUseLocalStorage()) {
            return _getVerifiedStorageObject(StorageType.LocalStorage);
        }
        return null;
    }
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
    function utlCanUseLocalStorage() {
        if (_canUseLocalStorage === undefined) {
            _canUseLocalStorage = !!_getVerifiedStorageObject(StorageType.LocalStorage);
        }
        return _canUseLocalStorage;
    }
    function utlGetLocalStorage(logger, name) {
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
    function utlSetLocalStorage(logger, name, data) {
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
    function utlRemoveStorage(logger, name) {
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

    var EventData = /** @class */ (function () {
        function EventData() {
            this.ver = 2;
            this.properties = {};
            this.measurements = {};
        }
        return EventData;
    }());

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

    var Extensions = {
        UserExt: "user",
        DeviceExt: "device",
        TraceExt: "trace",
        WebExt: "web",
        AppExt: "app",
        OSExt: "os",
        SessionExt: "ses",
        SDKExt: "sdk"
    };
    var CtxTagKeys = new ContextTagKeys();

    var PropertiesPluginIdentifier = "AppInsightsPropertiesPlugin";
    var BreezeChannelIdentifier = "AppInsightsChannelPlugin";

    var cookieNameConst = 'ai_session';
    var Session = /** @class */ (function () {
        function Session() {
        }
        return Session;
    }());
    var _SessionManager = /** @class */ (function () {
        function _SessionManager(config, core) {
            var self = this;
            var _storageNamePrefix;
            var _cookieUpdatedTimestamp;
            var _logger = safeGetLogger(core);
            var _cookieManager = safeGetCookieMgr(core);
            dynamicProto(_SessionManager, self, function (_self) {
                if (!config) {
                    config = {};
                }
                if (!isFunction(config.sessionExpirationMs)) {
                    config.sessionExpirationMs = function () { return _SessionManager.acquisitionSpan; };
                }
                if (!isFunction(config.sessionRenewalMs)) {
                    config.sessionRenewalMs = function () { return _SessionManager.renewalSpan; };
                }
                _self.config = config;
                var sessionCookiePostfix = (_self.config.sessionCookiePostfix && _self.config.sessionCookiePostfix()) ?
                    _self.config.sessionCookiePostfix() :
                    ((_self.config.namePrefix && _self.config.namePrefix()) ? _self.config.namePrefix() : "");
                _storageNamePrefix = function () { return cookieNameConst + sessionCookiePostfix; };
                _self.automaticSession = new Session();
                _self.update = function () {
                    var nowMs = dateNow();
                    var isExpired = false;
                    var session = _self.automaticSession;
                    if (!session.id) {
                        isExpired = !_initializeAutomaticSession(session);
                    }
                    var sessionExpirationMs = _self.config.sessionExpirationMs();
                    if (!isExpired && sessionExpirationMs > 0) {
                        var sessionRenewalMs = _self.config.sessionRenewalMs();
                        var timeSinceAcqMs = nowMs - session.acquisitionDate;
                        var timeSinceRenewalMs = nowMs - session.renewalDate;
                        isExpired = timeSinceAcqMs < 0 || timeSinceRenewalMs < 0;
                        isExpired = isExpired || timeSinceAcqMs > sessionExpirationMs;
                        isExpired = isExpired || timeSinceRenewalMs > sessionRenewalMs;
                    }
                    if (isExpired) {
                        _renew(nowMs);
                    }
                    else {
                        if (!_cookieUpdatedTimestamp || nowMs - _cookieUpdatedTimestamp > _SessionManager.cookieUpdateInterval) {
                            _setCookie(session, nowMs);
                        }
                    }
                };
                _self.backup = function () {
                    var session = _self.automaticSession;
                    _setStorage(session.id, session.acquisitionDate, session.renewalDate);
                };
                function _initializeAutomaticSession(session, now) {
                    var isValid = false;
                    var cookieValue = _cookieManager.get(_storageNamePrefix());
                    if (cookieValue && isFunction(cookieValue.split)) {
                        isValid = _initializeAutomaticSessionWithData(session, cookieValue);
                    }
                    else {
                        var storageValue = utlGetLocalStorage(_logger, _storageNamePrefix());
                        if (storageValue) {
                            isValid = _initializeAutomaticSessionWithData(session, storageValue);
                        }
                    }
                    return isValid || !!session.id;
                }
                function _initializeAutomaticSessionWithData(session, sessionData) {
                    var isValid = false;
                    var sessionReset = ", session will be reset";
                    var tokens = sessionData.split("|");
                    if (tokens.length >= 2) {
                        try {
                            var acqMs = +tokens[1] || 0;
                            var renewalMs = +tokens[2] || 0;
                            if (isNaN(acqMs) || acqMs <= 0) {
                                _logger.throwInternal(LoggingSeverity.WARNING, _InternalMessageId.SessionRenewalDateIsZero, "AI session acquisition date is 0" + sessionReset);
                            }
                            else if (isNaN(renewalMs) || renewalMs <= 0) {
                                _logger.throwInternal(LoggingSeverity.WARNING, _InternalMessageId.SessionRenewalDateIsZero, "AI session renewal date is 0" + sessionReset);
                            }
                            else if (tokens[0]) {
                                session.id = tokens[0];
                                session.acquisitionDate = acqMs;
                                session.renewalDate = renewalMs;
                                isValid = true;
                            }
                        }
                        catch (e) {
                            _logger.throwInternal(LoggingSeverity.CRITICAL, _InternalMessageId.ErrorParsingAISessionCookie, "Error parsing ai_session value [" + (sessionData || "") + "]" + sessionReset + " - " + getExceptionName(e), { exception: dumpObj(e) });
                        }
                    }
                    return isValid;
                }
                function _renew(nowMs) {
                    var theConfig = (_self.config || {});
                    var getNewId = (theConfig.getNewId ? theConfig.getNewId() : null) || newId;
                    _self.automaticSession.id = getNewId(theConfig.idLength ? theConfig.idLength() : 22);
                    _self.automaticSession.acquisitionDate = nowMs;
                    _setCookie(_self.automaticSession, nowMs);
                    if (!utlCanUseLocalStorage()) {
                        _logger.throwInternal(LoggingSeverity.WARNING, _InternalMessageId.BrowserDoesNotSupportLocalStorage, "Browser does not support local storage. Session durations will be inaccurate.");
                    }
                }
                function _setCookie(session, nowMs) {
                    var acq = session.acquisitionDate;
                    session.renewalDate = nowMs;
                    var config = _self.config;
                    var renewalPeriodMs = config.sessionRenewalMs();
                    var acqTimeLeftMs = (acq + config.sessionExpirationMs()) - nowMs;
                    var cookie = [session.id, acq, nowMs];
                    var maxAgeSec = 0;
                    if (acqTimeLeftMs < renewalPeriodMs) {
                        maxAgeSec = acqTimeLeftMs / 1000;
                    }
                    else {
                        maxAgeSec = renewalPeriodMs / 1000;
                    }
                    var cookieDomain = config.cookieDomain ? config.cookieDomain() : null;
                    _cookieManager.set(_storageNamePrefix(), cookie.join('|'), config.sessionExpirationMs() > 0 ? maxAgeSec : null, cookieDomain);
                    _cookieUpdatedTimestamp = nowMs;
                }
                function _setStorage(guid, acq, renewal) {
                    utlSetLocalStorage(_logger, _storageNamePrefix(), [guid, acq, renewal].join('|'));
                }
            });
        }
        _SessionManager.acquisitionSpan = 86400000;
        _SessionManager.renewalSpan = 1800000;
        _SessionManager.cookieUpdateInterval = 60000;
        return _SessionManager;
    }());

    var Application = /** @class */ (function () {
        function Application() {
        }
        return Application;
    }());

    var Device = /** @class */ (function () {
        function Device() {
            this.id = "browser";
            this.deviceClass = "Browser";
        }
        return Device;
    }());

    var Version = "2.6.4";
    var Internal = /** @class */ (function () {
        function Internal(config) {
            this.sdkVersion = (config.sdkExtension && config.sdkExtension() ? config.sdkExtension() + "_" : "") + "javascript:" + Version;
        }
        return Internal;
    }());

    function _validateUserInput(id) {
        if (typeof id !== 'string' ||
            !id ||
            id.match(/,|;|=| |\|/)) {
            return false;
        }
        return true;
    }
    var User = /** @class */ (function () {
        function User(config, core) {
            this.isNewUser = false;
            var _logger = safeGetLogger(core);
            var _cookieManager = safeGetCookieMgr(core);
            var _storageNamePrefix;
            dynamicProto(User, this, function (_self) {
                _self.config = config;
                var userCookiePostfix = (_self.config.userCookiePostfix && _self.config.userCookiePostfix()) ? _self.config.userCookiePostfix() : "";
                _storageNamePrefix = function () { return User.userCookieName + userCookiePostfix; };
                var cookie = _cookieManager.get(_storageNamePrefix());
                if (cookie) {
                    _self.isNewUser = false;
                    var params = cookie.split(User.cookieSeparator);
                    if (params.length > 0) {
                        _self.id = params[0];
                    }
                }
                if (!_self.id) {
                    var theConfig = (config || {});
                    var getNewId = (theConfig.getNewId ? theConfig.getNewId() : null) || newId;
                    _self.id = getNewId(theConfig.idLength ? config.idLength() : 22);
                    var oneYear = 31536000;
                    var acqStr = toISOString(new Date());
                    _self.accountAcquisitionDate = acqStr;
                    _self.isNewUser = true;
                    var newCookie = [_self.id, acqStr];
                    _cookieManager.set(_storageNamePrefix(), newCookie.join(User.cookieSeparator), oneYear);
                    var name_1 = config.namePrefix && config.namePrefix() ? config.namePrefix() + 'ai_session' : 'ai_session';
                    utlRemoveStorage(_logger, name_1);
                }
                _self.accountId = config.accountId ? config.accountId() : undefined;
                var authCookie = _cookieManager.get(User.authUserCookieName);
                if (authCookie) {
                    authCookie = decodeURI(authCookie);
                    var authCookieString = authCookie.split(User.cookieSeparator);
                    if (authCookieString[0]) {
                        _self.authenticatedId = authCookieString[0];
                    }
                    if (authCookieString.length > 1 && authCookieString[1]) {
                        _self.accountId = authCookieString[1];
                    }
                }
                _self.setAuthenticatedUserContext = function (authenticatedUserId, accountId, storeInCookie) {
                    if (storeInCookie === void 0) { storeInCookie = false; }
                    var isInvalidInput = !_validateUserInput(authenticatedUserId) || (accountId && !_validateUserInput(accountId));
                    if (isInvalidInput) {
                        _logger.throwInternal(LoggingSeverity.WARNING, _InternalMessageId.SetAuthContextFailedAccountName, "Setting auth user context failed. " +
                            "User auth/account id should be of type string, and not contain commas, semi-colons, equal signs, spaces, or vertical-bars.", true);
                        return;
                    }
                    _self.authenticatedId = authenticatedUserId;
                    var authCookie = _self.authenticatedId;
                    if (accountId) {
                        _self.accountId = accountId;
                        authCookie = [_self.authenticatedId, _self.accountId].join(User.cookieSeparator);
                    }
                    if (storeInCookie) {
                        _cookieManager.set(User.authUserCookieName, encodeURI(authCookie));
                    }
                };
                _self.clearAuthenticatedUserContext = function () {
                    _self.authenticatedId = null;
                    _self.accountId = null;
                    _cookieManager.del(User.authUserCookieName);
                };
            });
        }
        User.cookieSeparator = '|';
        User.userCookieName = 'ai_user';
        User.authUserCookieName = 'ai_authUser';
        return User;
    }());

    var Location = /** @class */ (function () {
        function Location() {
        }
        return Location;
    }());

    var TelemetryTrace = /** @class */ (function () {
        function TelemetryTrace(id, parentId, name, logger) {
            var _self = this;
            _self.traceID = id || generateW3CId();
            _self.parentID = parentId;
            _self.name = name;
            var location = getLocation();
            if (!name && location && location.pathname) {
                _self.name = location.pathname;
            }
            _self.name = dataSanitizeString(logger, _self.name);
        }
        return TelemetryTrace;
    }());

    var strExt = "ext";
    var strTags = "tags";
    function _removeEmpty(target, name) {
        if (target && target[name] && objKeys(target[name]).length === 0) {
            delete target[name];
        }
    }
    var TelemetryContext = /** @class */ (function () {
        function TelemetryContext(core, defaultConfig) {
            var _this = this;
            var logger = core.logger;
            this.appId = function () { return null; };
            dynamicProto(TelemetryContext, this, function (_self) {
                _self.application = new Application();
                _self.internal = new Internal(defaultConfig);
                if (hasWindow()) {
                    _self.sessionManager = new _SessionManager(defaultConfig, core);
                    _self.device = new Device();
                    _self.location = new Location();
                    _self.user = new User(defaultConfig, core);
                    _self.telemetryTrace = new TelemetryTrace(undefined, undefined, undefined, logger);
                    _self.session = new Session();
                }
                _self.applySessionContext = function (evt, itemCtx) {
                    var session = _self.session;
                    var sessionManager = _self.sessionManager;
                    if (session && isString(session.id)) {
                        setValue(getSetValue(evt.ext, Extensions.AppExt), "sesId", session.id);
                    }
                    else if (sessionManager && sessionManager.automaticSession) {
                        setValue(getSetValue(evt.ext, Extensions.AppExt), "sesId", sessionManager.automaticSession.id, isString);
                    }
                };
                _self.applyOperatingSystemContxt = function (evt, itemCtx) {
                    setValue(evt.ext, Extensions.OSExt, _self.os);
                };
                _self.applyApplicationContext = function (evt, itemCtx) {
                    var application = _self.application;
                    if (application) {
                        var tags = getSetValue(evt, strTags);
                        setValue(tags, CtxTagKeys.applicationVersion, application.ver, isString);
                        setValue(tags, CtxTagKeys.applicationBuild, application.build, isString);
                    }
                };
                _self.applyDeviceContext = function (evt, itemCtx) {
                    var device = _self.device;
                    if (device) {
                        var extDevice = getSetValue(getSetValue(evt, strExt), Extensions.DeviceExt);
                        setValue(extDevice, "localId", device.id, isString);
                        setValue(extDevice, "ip", device.ip, isString);
                        setValue(extDevice, "model", device.model, isString);
                        setValue(extDevice, "deviceClass", device.deviceClass, isString);
                    }
                };
                _self.applyInternalContext = function (evt, itemCtx) {
                    var internal = _self.internal;
                    if (internal) {
                        var tags = getSetValue(evt, strTags);
                        setValue(tags, CtxTagKeys.internalAgentVersion, internal.agentVersion, isString);
                        setValue(tags, CtxTagKeys.internalSdkVersion, internal.sdkVersion, isString);
                        if (evt.baseType === _InternalLogMessage.dataType || evt.baseType === PageView.dataType) {
                            setValue(tags, CtxTagKeys.internalSnippet, internal.snippetVer, isString);
                            setValue(tags, CtxTagKeys.internalSdkSrc, internal.sdkSrc, isString);
                        }
                    }
                };
                _self.applyLocationContext = function (evt, itemCtx) {
                    var location = _this.location;
                    if (location) {
                        setValue(getSetValue(evt, strTags, []), CtxTagKeys.locationIp, location.ip, isString);
                    }
                };
                _self.applyOperationContext = function (evt, itemCtx) {
                    var telemetryTrace = _self.telemetryTrace;
                    if (telemetryTrace) {
                        var extTrace = getSetValue(getSetValue(evt, strExt), Extensions.TraceExt, { traceID: undefined, parentID: undefined });
                        setValue(extTrace, "traceID", telemetryTrace.traceID, isString);
                        setValue(extTrace, "name", telemetryTrace.name, isString);
                        setValue(extTrace, "parentID", telemetryTrace.parentID, isString);
                    }
                };
                _self.applyWebContext = function (evt, itemCtx) {
                    var web = _this.web;
                    if (web) {
                        setValue(getSetValue(evt, strExt), Extensions.WebExt, web);
                    }
                };
                _self.applyUserContext = function (evt, itemCtx) {
                    var user = _self.user;
                    if (user) {
                        var tags = getSetValue(evt, strTags, []);
                        setValue(tags, CtxTagKeys.userAccountId, user.accountId, isString);
                        var extUser = getSetValue(getSetValue(evt, strExt), Extensions.UserExt);
                        setValue(extUser, "id", user.id, isString);
                        setValue(extUser, "authId", user.authenticatedId, isString);
                    }
                };
                _self.cleanUp = function (evt, itemCtx) {
                    var ext = evt.ext;
                    if (ext) {
                        _removeEmpty(ext, Extensions.DeviceExt);
                        _removeEmpty(ext, Extensions.UserExt);
                        _removeEmpty(ext, Extensions.WebExt);
                        _removeEmpty(ext, Extensions.OSExt);
                        _removeEmpty(ext, Extensions.AppExt);
                        _removeEmpty(ext, Extensions.TraceExt);
                    }
                };
            });
        }
        return TelemetryContext;
    }());

    var PropertiesPlugin = /** @class */ (function (_super) {
        __extendsFn(PropertiesPlugin, _super);
        function PropertiesPlugin() {
            var _this = _super.call(this) || this;
            _this.priority = 110;
            _this.identifier = PropertiesPluginIdentifier;
            var _breezeChannel;
            var _extensionConfig;
            dynamicProto(PropertiesPlugin, _this, function (_self, _base) {
                _self.initialize = function (config, core, extensions, pluginChain) {
                    _base.initialize(config, core, extensions, pluginChain);
                    var ctx = _self._getTelCtx();
                    var identifier = _self.identifier;
                    var defaultConfig = PropertiesPlugin.getDefaultConfig();
                    _extensionConfig = _extensionConfig || {};
                    objForEachKey(defaultConfig, function (field, value) {
                        _extensionConfig[field] = function () { return ctx.getConfig(identifier, field, value()); };
                    });
                    _self.context = new TelemetryContext(core, _extensionConfig);
                    _breezeChannel = getExtensionByName(extensions, BreezeChannelIdentifier);
                    _self.context.appId = function () { return _breezeChannel ? _breezeChannel["_appId"] : null; };
                    _self["_extConfig"] = _extensionConfig;
                };
                _self.processTelemetry = function (event, itemCtx) {
                    if (isNullOrUndefined(event)) ;
                    else {
                        itemCtx = _self._getTelCtx(itemCtx);
                        if (event.name === PageView.envelopeType) {
                            itemCtx.diagLog().resetInternalMessageCount();
                        }
                        var theContext = (_self.context || {});
                        if (theContext.session) {
                            if (typeof _self.context.session.id !== "string" && theContext.sessionManager) {
                                theContext.sessionManager.update();
                            }
                        }
                        _processTelemetryInternal(event, itemCtx);
                        if (theContext.user && theContext.user.isNewUser) {
                            theContext.user.isNewUser = false;
                            var message = new _InternalLogMessage(_InternalMessageId.SendBrowserInfoOnUserInit, ((getNavigator() || {}).userAgent || ""));
                            itemCtx.diagLog().logInternalMessage(LoggingSeverity.CRITICAL, message);
                        }
                        _self.processNext(event, itemCtx);
                    }
                };
                function _processTelemetryInternal(evt, itemCtx) {
                    getSetValue(evt, "tags", []);
                    getSetValue(evt, "ext", {});
                    var ctx = _self.context;
                    ctx.applySessionContext(evt, itemCtx);
                    ctx.applyApplicationContext(evt, itemCtx);
                    ctx.applyDeviceContext(evt, itemCtx);
                    ctx.applyOperationContext(evt, itemCtx);
                    ctx.applyUserContext(evt, itemCtx);
                    ctx.applyOperatingSystemContxt(evt, itemCtx);
                    ctx.applyWebContext(evt, itemCtx);
                    ctx.applyLocationContext(evt, itemCtx);
                    ctx.applyInternalContext(evt, itemCtx);
                    ctx.cleanUp(evt, itemCtx);
                }
            });
            return _this;
        }
        PropertiesPlugin.getDefaultConfig = function () {
            var defaultConfig = {
                instrumentationKey: function () { return undefined; },
                accountId: function () { return null; },
                sessionRenewalMs: function () { return 30 * 60 * 1000; },
                samplingPercentage: function () { return 100; },
                sessionExpirationMs: function () { return 24 * 60 * 60 * 1000; },
                cookieDomain: function () { return null; },
                sdkExtension: function () { return null; },
                isBrowserLinkTrackingEnabled: function () { return false; },
                appId: function () { return null; },
                namePrefix: function () { return undefined; },
                sessionCookiePostfix: function () { return undefined; },
                userCookiePostfix: function () { return undefined; },
                idLength: function () { return 22; },
                getNewId: function () { return null; }
            };
            return defaultConfig;
        };
        return PropertiesPlugin;
    }(BaseTelemetryPlugin));

    exports.PropertiesPlugin = PropertiesPlugin;
    exports.Session = Session;
    exports.SessionManager = _SessionManager;
    exports.TelemetryContext = TelemetryContext;
    exports.TelemetryTrace = TelemetryTrace;

    (function(obj, prop, descriptor) { /* ai_es3_polyfil defineProperty */ var func = Object["defineProperty"]; if (func) { try { return func(obj, prop, descriptor); } catch(e) { /* IE8 defines defineProperty, but will throw */ } } if (descriptor && typeof descriptor.value !== undefined) { obj[prop] = descriptor.value; } return obj; })(exports, '__esModule', { value: true });

})));//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/fe719cd3e5825bf14e14182fddeb88ee8daf044f/node_modules/@microsoft/applicationinsights-properties-js/dist/applicationinsights-properties-js.js.map
