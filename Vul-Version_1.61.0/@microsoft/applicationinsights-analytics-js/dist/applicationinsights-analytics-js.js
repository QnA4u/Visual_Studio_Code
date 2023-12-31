/*!
 * Application Insights JavaScript SDK - Web Analytics, 2.6.4
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

    var strWindow = "window";
    var strDocument = "document";
    var strNavigator = "navigator";
    var strHistory = "history";
    var strLocation = "location";
    var strConsole = "console";
    var strPerformance = "performance";
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
    function hasHistory() {
        return Boolean(typeof history === strShimObject && history);
    }
    function getHistory() {
        if (hasHistory()) {
            return history;
        }
        return getGlobalInst(strHistory);
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
    function getPerformance() {
        return getGlobalInst(strPerformance);
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

    function createDomEvent(eventName) {
        var event = null;
        if (isFunction(Event)) {
            event = new Event(eventName);
        }
        else {
            var doc = getDocument();
            if (doc && doc.createEvent) {
                event = doc.createEvent("Event");
                event.initEvent(eventName, true, true);
            }
        }
        return event;
    }

    function stringToBoolOrDefault(str, defaultValue) {
        if (defaultValue === void 0) { defaultValue = false; }
        if (str === undefined || str === null) {
            return defaultValue;
        }
        return str.toString().toLowerCase() === "true";
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
    function isCrossOriginError(message, url, lineNumber, columnNumber, error) {
        return !error && isString(message) && (message === "Script error." || message === "Script error");
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
    function utlDisableStorage() {
        _canUseSessionStorage = false;
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
    function utlRemoveSessionStorage(logger, name) {
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
    function dateTimeUtilsDuration(start, end) {
        var result = null;
        if (start !== 0 && end !== 0 && !isNullOrUndefined(start) && !isNullOrUndefined(end)) {
            result = end - start;
        }
        return result;
    }

    var EventData = /** @class */ (function () {
        function EventData() {
            this.ver = 2;
            this.properties = {};
            this.measurements = {};
        }
        return EventData;
    }());

    var Event$1 = /** @class */ (function (_super) {
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

    var SeverityLevel;
    (function (SeverityLevel) {
        SeverityLevel[SeverityLevel["Verbose"] = 0] = "Verbose";
        SeverityLevel[SeverityLevel["Information"] = 1] = "Information";
        SeverityLevel[SeverityLevel["Warning"] = 2] = "Warning";
        SeverityLevel[SeverityLevel["Error"] = 3] = "Error";
        SeverityLevel[SeverityLevel["Critical"] = 4] = "Critical";
    })(SeverityLevel || (SeverityLevel = {}));

    var TelemetryItemCreator = /** @class */ (function () {
        function TelemetryItemCreator() {
        }
        TelemetryItemCreator.create = function (item, baseType, envelopeName, logger, customProperties, systemProperties) {
            envelopeName = dataSanitizeString(logger, envelopeName) || strNotSpecified;
            if (isNullOrUndefined(item) ||
                isNullOrUndefined(baseType) ||
                isNullOrUndefined(envelopeName)) {
                throw Error("Input doesn't contain all required fields");
            }
            var telemetryItem = {
                name: envelopeName,
                time: toISOString(new Date()),
                iKey: "",
                ext: systemProperties ? systemProperties : {},
                tags: [],
                data: {},
                baseType: baseType,
                baseData: item
            };
            if (!isNullOrUndefined(customProperties)) {
                objForEachKey(customProperties, function (prop, value) {
                    telemetryItem.data[prop] = value;
                });
            }
            return telemetryItem;
        };
        return TelemetryItemCreator;
    }());

    var PropertiesPluginIdentifier = "AppInsightsPropertiesPlugin";
    var AnalyticsPluginIdentifier = "ApplicationInsightsAnalytics";

    var PageViewManager = /** @class */ (function () {
        function PageViewManager(appInsights, overridePageViewDuration, core, pageViewPerformanceManager) {
            dynamicProto(PageViewManager, this, function (_self) {
                var intervalHandle = null;
                var itemQueue = [];
                var pageViewPerformanceSent = false;
                var _logger;
                if (core) {
                    _logger = core.logger;
                }
                function _flushChannels() {
                    if (core) {
                        arrForEach(core.getTransmissionControls(), function (queues) {
                            arrForEach(queues, function (q) { return q.flush(true); });
                        });
                    }
                }
                function _addQueue(cb) {
                    itemQueue.push(cb);
                    if (!intervalHandle) {
                        intervalHandle = setInterval((function () {
                            var allItems = itemQueue.slice(0);
                            var doFlush = false;
                            itemQueue = [];
                            arrForEach(allItems, function (item) {
                                if (!item()) {
                                    itemQueue.push(item);
                                }
                                else {
                                    doFlush = true;
                                }
                            });
                            if (itemQueue.length === 0) {
                                clearInterval(intervalHandle);
                                intervalHandle = null;
                            }
                            if (doFlush) {
                                _flushChannels();
                            }
                        }), 100);
                    }
                }
                _self.trackPageView = function (pageView, customProperties) {
                    var name = pageView.name;
                    if (isNullOrUndefined(name) || typeof name !== "string") {
                        var doc = getDocument();
                        name = pageView.name = doc && doc.title || "";
                    }
                    var uri = pageView.uri;
                    if (isNullOrUndefined(uri) || typeof uri !== "string") {
                        var location_1 = getLocation();
                        uri = pageView.uri = location_1 && location_1.href || "";
                    }
                    if (!pageViewPerformanceManager.isPerformanceTimingSupported()) {
                        appInsights.sendPageViewInternal(pageView, customProperties);
                        _flushChannels();
                        _logger.throwInternal(LoggingSeverity.WARNING, _InternalMessageId.NavigationTimingNotSupported, "trackPageView: navigation timing API used for calculation of page duration is not supported in this browser. This page view will be collected without duration and timing info.");
                        return;
                    }
                    var pageViewSent = false;
                    var customDuration;
                    var start = pageViewPerformanceManager.getPerformanceTiming().navigationStart;
                    if (start > 0) {
                        customDuration = dateTimeUtilsDuration(start, +new Date);
                        if (!pageViewPerformanceManager.shouldCollectDuration(customDuration)) {
                            customDuration = undefined;
                        }
                    }
                    var duration;
                    if (!isNullOrUndefined(customProperties) &&
                        !isNullOrUndefined(customProperties.duration)) {
                        duration = customProperties.duration;
                    }
                    if (overridePageViewDuration || !isNaN(duration)) {
                        if (isNaN(duration)) {
                            if (!customProperties) {
                                customProperties = {};
                            }
                            customProperties["duration"] = customDuration;
                        }
                        appInsights.sendPageViewInternal(pageView, customProperties);
                        _flushChannels();
                        pageViewSent = true;
                    }
                    var maxDurationLimit = 60000;
                    if (!customProperties) {
                        customProperties = {};
                    }
                    _addQueue(function () {
                        var processed = false;
                        try {
                            if (pageViewPerformanceManager.isPerformanceTimingDataReady()) {
                                processed = true;
                                var pageViewPerformance = {
                                    name: name,
                                    uri: uri
                                };
                                pageViewPerformanceManager.populatePageViewPerformanceEvent(pageViewPerformance);
                                if (!pageViewPerformance.isValid && !pageViewSent) {
                                    customProperties["duration"] = customDuration;
                                    appInsights.sendPageViewInternal(pageView, customProperties);
                                }
                                else {
                                    if (!pageViewSent) {
                                        customProperties["duration"] = pageViewPerformance.durationMs;
                                        appInsights.sendPageViewInternal(pageView, customProperties);
                                    }
                                    if (!pageViewPerformanceSent) {
                                        appInsights.sendPageViewPerformanceInternal(pageViewPerformance, customProperties);
                                        pageViewPerformanceSent = true;
                                    }
                                }
                            }
                            else if (start > 0 && dateTimeUtilsDuration(start, +new Date) > maxDurationLimit) {
                                processed = true;
                                if (!pageViewSent) {
                                    customProperties["duration"] = maxDurationLimit;
                                    appInsights.sendPageViewInternal(pageView, customProperties);
                                }
                            }
                        }
                        catch (e) {
                            _logger.throwInternal(LoggingSeverity.CRITICAL, _InternalMessageId.TrackPVFailedCalc, "trackPageView failed on page load calculation: " + getExceptionName(e), { exception: dumpObj(e) });
                        }
                        return processed;
                    });
                };
            });
        }
        return PageViewManager;
    }());

    var PageVisitTimeManager = /** @class */ (function () {
        function PageVisitTimeManager(logger, pageVisitTimeTrackingHandler) {
            this.prevPageVisitDataKeyName = "prevPageVisitData";
            this.pageVisitTimeTrackingHandler = pageVisitTimeTrackingHandler;
            this._logger = logger;
        }
        PageVisitTimeManager.prototype.trackPreviousPageVisit = function (currentPageName, currentPageUrl) {
            try {
                var prevPageVisitTimeData = this.restartPageVisitTimer(currentPageName, currentPageUrl);
                if (prevPageVisitTimeData) {
                    this.pageVisitTimeTrackingHandler(prevPageVisitTimeData.pageName, prevPageVisitTimeData.pageUrl, prevPageVisitTimeData.pageVisitTime);
                }
            }
            catch (e) {
                this._logger.warnToConsole("Auto track page visit time failed, metric will not be collected: " + dumpObj(e));
            }
        };
        PageVisitTimeManager.prototype.restartPageVisitTimer = function (pageName, pageUrl) {
            try {
                var prevPageVisitData = this.stopPageVisitTimer();
                this.startPageVisitTimer(pageName, pageUrl);
                return prevPageVisitData;
            }
            catch (e) {
                this._logger.warnToConsole("Call to restart failed: " + dumpObj(e));
                return null;
            }
        };
        PageVisitTimeManager.prototype.startPageVisitTimer = function (pageName, pageUrl) {
            try {
                if (utlCanUseSessionStorage()) {
                    if (utlGetSessionStorage(this._logger, this.prevPageVisitDataKeyName) != null) {
                        throwError("Cannot call startPageVisit consecutively without first calling stopPageVisit");
                    }
                    var currPageVisitData = new PageVisitData(pageName, pageUrl);
                    var currPageVisitDataStr = getJSON().stringify(currPageVisitData);
                    utlSetSessionStorage(this._logger, this.prevPageVisitDataKeyName, currPageVisitDataStr);
                }
            }
            catch (e) {
                this._logger.warnToConsole("Call to start failed: " + dumpObj(e));
            }
        };
        PageVisitTimeManager.prototype.stopPageVisitTimer = function () {
            try {
                if (utlCanUseSessionStorage()) {
                    var pageVisitEndTime = dateNow();
                    var pageVisitDataJsonStr = utlGetSessionStorage(this._logger, this.prevPageVisitDataKeyName);
                    if (pageVisitDataJsonStr && hasJSON()) {
                        var prevPageVisitData = getJSON().parse(pageVisitDataJsonStr);
                        prevPageVisitData.pageVisitTime = pageVisitEndTime - prevPageVisitData.pageVisitStartTime;
                        utlRemoveSessionStorage(this._logger, this.prevPageVisitDataKeyName);
                        return prevPageVisitData;
                    }
                    else {
                        return null;
                    }
                }
                return null;
            }
            catch (e) {
                this._logger.warnToConsole("Stop page visit timer failed: " + dumpObj(e));
                return null;
            }
        };
        return PageVisitTimeManager;
    }());
    var PageVisitData = /** @class */ (function () {
        function PageVisitData(pageName, pageUrl) {
            this.pageVisitStartTime = dateNow();
            this.pageName = pageName;
            this.pageUrl = pageUrl;
        }
        return PageVisitData;
    }());

    var PageViewPerformanceManager = /** @class */ (function () {
        function PageViewPerformanceManager(core) {
            this.MAX_DURATION_ALLOWED = 3600000;
            if (core) {
                this._logger = core.logger;
            }
        }
        PageViewPerformanceManager.prototype.populatePageViewPerformanceEvent = function (pageViewPerformance) {
            pageViewPerformance.isValid = false;
            var navigationTiming = this.getPerformanceNavigationTiming();
            var timing = this.getPerformanceTiming();
            var total = 0;
            var network = 0;
            var request = 0;
            var response = 0;
            var dom = 0;
            if (navigationTiming || timing) {
                if (navigationTiming) {
                    total = navigationTiming.duration;
                    network = navigationTiming.startTime === 0 ? navigationTiming.connectEnd : dateTimeUtilsDuration(navigationTiming.startTime, navigationTiming.connectEnd);
                    request = dateTimeUtilsDuration(navigationTiming.requestStart, navigationTiming.responseStart);
                    response = dateTimeUtilsDuration(navigationTiming.responseStart, navigationTiming.responseEnd);
                    dom = dateTimeUtilsDuration(navigationTiming.responseEnd, navigationTiming.loadEventEnd);
                }
                else {
                    total = dateTimeUtilsDuration(timing.navigationStart, timing.loadEventEnd);
                    network = dateTimeUtilsDuration(timing.navigationStart, timing.connectEnd);
                    request = dateTimeUtilsDuration(timing.requestStart, timing.responseStart);
                    response = dateTimeUtilsDuration(timing.responseStart, timing.responseEnd);
                    dom = dateTimeUtilsDuration(timing.responseEnd, timing.loadEventEnd);
                }
                if (total === 0) {
                    this._logger.throwInternal(LoggingSeverity.WARNING, _InternalMessageId.ErrorPVCalc, "error calculating page view performance.", { total: total, network: network, request: request, response: response, dom: dom });
                }
                else if (!this.shouldCollectDuration(total, network, request, response, dom)) {
                    this._logger.throwInternal(LoggingSeverity.WARNING, _InternalMessageId.InvalidDurationValue, "Invalid page load duration value. Browser perf data won't be sent.", { total: total, network: network, request: request, response: response, dom: dom });
                }
                else if (total < Math.floor(network) + Math.floor(request) + Math.floor(response) + Math.floor(dom)) {
                    this._logger.throwInternal(LoggingSeverity.WARNING, _InternalMessageId.ClientPerformanceMathError, "client performance math error.", { total: total, network: network, request: request, response: response, dom: dom });
                }
                else {
                    pageViewPerformance.durationMs = total;
                    pageViewPerformance.perfTotal = pageViewPerformance.duration = msToTimeSpan(total);
                    pageViewPerformance.networkConnect = msToTimeSpan(network);
                    pageViewPerformance.sentRequest = msToTimeSpan(request);
                    pageViewPerformance.receivedResponse = msToTimeSpan(response);
                    pageViewPerformance.domProcessing = msToTimeSpan(dom);
                    pageViewPerformance.isValid = true;
                }
            }
        };
        PageViewPerformanceManager.prototype.getPerformanceTiming = function () {
            if (this.isPerformanceTimingSupported()) {
                return getPerformance().timing;
            }
            return null;
        };
        PageViewPerformanceManager.prototype.getPerformanceNavigationTiming = function () {
            if (this.isPerformanceNavigationTimingSupported()) {
                return getPerformance().getEntriesByType("navigation")[0];
            }
            return null;
        };
        PageViewPerformanceManager.prototype.isPerformanceNavigationTimingSupported = function () {
            var perf = getPerformance();
            return perf && perf.getEntriesByType && perf.getEntriesByType("navigation").length > 0;
        };
        PageViewPerformanceManager.prototype.isPerformanceTimingSupported = function () {
            var perf = getPerformance();
            return perf && perf.timing;
        };
        PageViewPerformanceManager.prototype.isPerformanceTimingDataReady = function () {
            var perf = getPerformance();
            var timing = perf ? perf.timing : 0;
            return timing
                && timing.domainLookupStart > 0
                && timing.navigationStart > 0
                && timing.responseStart > 0
                && timing.requestStart > 0
                && timing.loadEventEnd > 0
                && timing.responseEnd > 0
                && timing.connectEnd > 0
                && timing.domLoading > 0;
        };
        PageViewPerformanceManager.prototype.shouldCollectDuration = function () {
            var durations = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                durations[_i] = arguments[_i];
            }
            var _navigator = getNavigator() || {};
            var botAgentNames = ['googlebot', 'adsbot-google', 'apis-google', 'mediapartners-google'];
            var userAgent = _navigator.userAgent;
            var isGoogleBot = false;
            if (userAgent) {
                for (var i = 0; i < botAgentNames.length; i++) {
                    isGoogleBot = isGoogleBot || userAgent.toLowerCase().indexOf(botAgentNames[i]) !== -1;
                }
            }
            if (isGoogleBot) {
                return false;
            }
            else {
                for (var i = 0; i < durations.length; i++) {
                    if (durations[i] < 0 || durations[i] >= this.MAX_DURATION_ALLOWED) {
                        return false;
                    }
                }
            }
            return true;
        };
        return PageViewPerformanceManager;
    }());

    var durationProperty = "duration";
    var strEvent = "event";
    function _dispatchEvent(target, evnt) {
        if (target && target.dispatchEvent && evnt) {
            target.dispatchEvent(evnt);
        }
    }
    var ApplicationInsights = /** @class */ (function (_super) {
        __extendsFn(ApplicationInsights, _super);
        function ApplicationInsights() {
            var _this = _super.call(this) || this;
            _this.identifier = AnalyticsPluginIdentifier;
            _this.priority = 180;
            _this.autoRoutePVDelay = 500;
            var _eventTracking;
            var _pageTracking;
            var _properties;
            var _prevUri;
            var _currUri;
            dynamicProto(ApplicationInsights, _this, function (_self, _base) {
                var location = getLocation(true);
                _prevUri = location && location.href || "";
                _self.getCookieMgr = function () {
                    return safeGetCookieMgr(_self.core);
                };
                _self.processTelemetry = function (env, itemCtx) {
                    doPerf(_self.core, function () { return _self.identifier + ":processTelemetry"; }, function () {
                        var doNotSendItem = false;
                        var telemetryInitializersCount = _self._telemetryInitializers.length;
                        itemCtx = _self._getTelCtx(itemCtx);
                        for (var i = 0; i < telemetryInitializersCount; ++i) {
                            var telemetryInitializer = _self._telemetryInitializers[i];
                            if (telemetryInitializer) {
                                try {
                                    if (telemetryInitializer.apply(null, [env]) === false) {
                                        doNotSendItem = true;
                                        break;
                                    }
                                }
                                catch (e) {
                                    itemCtx.diagLog().throwInternal(LoggingSeverity.CRITICAL, _InternalMessageId.TelemetryInitializerFailed, "One of telemetry initializers failed, telemetry item will not be sent: " + getExceptionName(e), { exception: dumpObj(e) }, true);
                                }
                            }
                        }
                        if (!doNotSendItem) {
                            _self.processNext(env, itemCtx);
                        }
                    }, function () { return ({ item: env }); }, !(env.sync));
                };
                _self.trackEvent = function (event, customProperties) {
                    try {
                        var telemetryItem = TelemetryItemCreator.create(event, Event$1.dataType, Event$1.envelopeType, _self.diagLog(), customProperties);
                        _self.core.track(telemetryItem);
                    }
                    catch (e) {
                        _self.diagLog().throwInternal(LoggingSeverity.WARNING, _InternalMessageId.TrackTraceFailed, "trackTrace failed, trace will not be collected: " + getExceptionName(e), { exception: dumpObj(e) });
                    }
                };
                _self.startTrackEvent = function (name) {
                    try {
                        _eventTracking.start(name);
                    }
                    catch (e) {
                        _self.diagLog().throwInternal(LoggingSeverity.CRITICAL, _InternalMessageId.StartTrackEventFailed, "startTrackEvent failed, event will not be collected: " + getExceptionName(e), { exception: dumpObj(e) });
                    }
                };
                _self.stopTrackEvent = function (name, properties, measurements) {
                    try {
                        _eventTracking.stop(name, undefined, properties);
                    }
                    catch (e) {
                        _self.diagLog().throwInternal(LoggingSeverity.CRITICAL, _InternalMessageId.StopTrackEventFailed, "stopTrackEvent failed, event will not be collected: " + getExceptionName(e), { exception: dumpObj(e) });
                    }
                };
                _self.trackTrace = function (trace, customProperties) {
                    try {
                        var telemetryItem = TelemetryItemCreator.create(trace, Trace.dataType, Trace.envelopeType, _self.diagLog(), customProperties);
                        _self.core.track(telemetryItem);
                    }
                    catch (e) {
                        _self.diagLog().throwInternal(LoggingSeverity.WARNING, _InternalMessageId.TrackTraceFailed, "trackTrace failed, trace will not be collected: " + getExceptionName(e), { exception: dumpObj(e) });
                    }
                };
                _self.trackMetric = function (metric, customProperties) {
                    try {
                        var telemetryItem = TelemetryItemCreator.create(metric, Metric.dataType, Metric.envelopeType, _self.diagLog(), customProperties);
                        _self.core.track(telemetryItem);
                    }
                    catch (e) {
                        _self.diagLog().throwInternal(LoggingSeverity.CRITICAL, _InternalMessageId.TrackMetricFailed, "trackMetric failed, metric will not be collected: " + getExceptionName(e), { exception: dumpObj(e) });
                    }
                };
                _self.trackPageView = function (pageView, customProperties) {
                    try {
                        var inPv = pageView || {};
                        _self._pageViewManager.trackPageView(inPv, __assignFn({}, inPv.properties, inPv.measurements, customProperties));
                        if (_self.config.autoTrackPageVisitTime) {
                            _self._pageVisitTimeManager.trackPreviousPageVisit(inPv.name, inPv.uri);
                        }
                    }
                    catch (e) {
                        _self.diagLog().throwInternal(LoggingSeverity.CRITICAL, _InternalMessageId.TrackPVFailed, "trackPageView failed, page view will not be collected: " + getExceptionName(e), { exception: dumpObj(e) });
                    }
                };
                _self.sendPageViewInternal = function (pageView, properties, systemProperties) {
                    var doc = getDocument();
                    if (doc) {
                        pageView.refUri = pageView.refUri === undefined ? doc.referrer : pageView.refUri;
                    }
                    var telemetryItem = TelemetryItemCreator.create(pageView, PageView.dataType, PageView.envelopeType, _self.diagLog(), properties, systemProperties);
                    _self.core.track(telemetryItem);
                };
                _self.sendPageViewPerformanceInternal = function (pageViewPerformance, properties, systemProperties) {
                    var telemetryItem = TelemetryItemCreator.create(pageViewPerformance, PageViewPerformance.dataType, PageViewPerformance.envelopeType, _self.diagLog(), properties, systemProperties);
                    _self.core.track(telemetryItem);
                };
                _self.trackPageViewPerformance = function (pageViewPerformance, customProperties) {
                    try {
                        _self._pageViewPerformanceManager.populatePageViewPerformanceEvent(pageViewPerformance);
                        _self.sendPageViewPerformanceInternal(pageViewPerformance, customProperties);
                    }
                    catch (e) {
                        _self.diagLog().throwInternal(LoggingSeverity.CRITICAL, _InternalMessageId.TrackPVFailed, "trackPageViewPerformance failed, page view will not be collected: " + getExceptionName(e), { exception: dumpObj(e) });
                    }
                };
                _self.startTrackPage = function (name) {
                    try {
                        if (typeof name !== "string") {
                            var doc = getDocument();
                            name = doc && doc.title || "";
                        }
                        _pageTracking.start(name);
                    }
                    catch (e) {
                        _self.diagLog().throwInternal(LoggingSeverity.CRITICAL, _InternalMessageId.StartTrackFailed, "startTrackPage failed, page view may not be collected: " + getExceptionName(e), { exception: dumpObj(e) });
                    }
                };
                _self.stopTrackPage = function (name, url, properties, measurement) {
                    try {
                        if (typeof name !== "string") {
                            var doc = getDocument();
                            name = doc && doc.title || "";
                        }
                        if (typeof url !== "string") {
                            var loc = getLocation();
                            url = loc && loc.href || "";
                        }
                        _pageTracking.stop(name, url, properties, measurement);
                        if (_self.config.autoTrackPageVisitTime) {
                            _self._pageVisitTimeManager.trackPreviousPageVisit(name, url);
                        }
                    }
                    catch (e) {
                        _self.diagLog().throwInternal(LoggingSeverity.CRITICAL, _InternalMessageId.StopTrackFailed, "stopTrackPage failed, page view will not be collected: " + getExceptionName(e), { exception: dumpObj(e) });
                    }
                };
                _self.sendExceptionInternal = function (exception, customProperties, systemProperties) {
                    var theError = exception.exception || exception.error || new Error(strNotSpecified);
                    var exceptionPartB = new Exception(_self.diagLog(), theError, exception.properties || customProperties, exception.measurements, exception.severityLevel, exception.id).toInterface();
                    var telemetryItem = TelemetryItemCreator.create(exceptionPartB, Exception.dataType, Exception.envelopeType, _self.diagLog(), customProperties, systemProperties);
                    _self.core.track(telemetryItem);
                };
                _self.trackException = function (exception, customProperties) {
                    try {
                        _self.sendExceptionInternal(exception, customProperties);
                    }
                    catch (e) {
                        _self.diagLog().throwInternal(LoggingSeverity.CRITICAL, _InternalMessageId.TrackExceptionFailed, "trackException failed, exception will not be collected: " + getExceptionName(e), { exception: dumpObj(e) });
                    }
                };
                _self._onerror = function (exception) {
                    var error = exception && exception.error;
                    var evt = exception && exception.evt;
                    try {
                        if (!evt) {
                            var _window = getWindow();
                            if (_window) {
                                evt = _window[strEvent];
                            }
                        }
                        var url = (exception && exception.url) || (getDocument() || {}).URL;
                        var errorSrc = exception.errorSrc || "window.onerror@" + url + ":" + (exception.lineNumber || 0) + ":" + (exception.columnNumber || 0);
                        var properties = {
                            errorSrc: errorSrc,
                            url: url,
                            lineNumber: exception.lineNumber || 0,
                            columnNumber: exception.columnNumber || 0,
                            message: exception.message
                        };
                        if (isCrossOriginError(exception.message, exception.url, exception.lineNumber, exception.columnNumber, exception.error)) {
                            _sendCORSException(Exception.CreateAutoException("Script error: The browser's same-origin policy prevents us from getting the details of this exception. Consider using the 'crossorigin' attribute.", url, exception.lineNumber || 0, exception.columnNumber || 0, error, evt, null, errorSrc), properties);
                        }
                        else {
                            if (!exception.errorSrc) {
                                exception.errorSrc = errorSrc;
                            }
                            _self.trackException({ exception: exception, severityLevel: SeverityLevel.Error }, properties);
                        }
                    }
                    catch (e) {
                        var errorString = error ? (error.name + ", " + error.message) : "null";
                        _self.diagLog().throwInternal(LoggingSeverity.CRITICAL, _InternalMessageId.ExceptionWhileLoggingError, "_onError threw exception while logging error, error will not be collected: "
                            + getExceptionName(e), { exception: dumpObj(e), errorString: errorString });
                    }
                };
                _self.addTelemetryInitializer = function (telemetryInitializer) {
                    _self._telemetryInitializers.push(telemetryInitializer);
                };
                _self.initialize = function (config, core, extensions, pluginChain) {
                    if (_self.isInitialized()) {
                        return;
                    }
                    if (isNullOrUndefined(core)) {
                        throw Error("Error initializing");
                    }
                    _base.initialize(config, core, extensions, pluginChain);
                    _self.setInitialized(false);
                    var ctx = _self._getTelCtx();
                    var identifier = _self.identifier;
                    _self.config = ctx.getExtCfg(identifier);
                    var defaults = ApplicationInsights.getDefaultConfig(config);
                    if (defaults !== undefined) {
                        objForEachKey(defaults, function (field, value) {
                            _self.config[field] = ctx.getConfig(identifier, field, value);
                            if (_self.config[field] === undefined) {
                                _self.config[field] = value;
                            }
                        });
                    }
                    if (_self.config.isStorageUseDisabled) {
                        utlDisableStorage();
                    }
                    var configGetters = {
                        instrumentationKey: function () { return config.instrumentationKey; },
                        accountId: function () { return _self.config.accountId || config.accountId; },
                        sessionRenewalMs: function () { return _self.config.sessionRenewalMs || config.sessionRenewalMs; },
                        sessionExpirationMs: function () { return _self.config.sessionExpirationMs || config.sessionExpirationMs; },
                        sampleRate: function () { return _self.config.samplingPercentage || config.samplingPercentage; },
                        sdkExtension: function () { return _self.config.sdkExtension || config.sdkExtension; },
                        isBrowserLinkTrackingEnabled: function () { return _self.config.isBrowserLinkTrackingEnabled || config.isBrowserLinkTrackingEnabled; },
                        appId: function () { return _self.config.appId || config.appId; }
                    };
                    _self._pageViewPerformanceManager = new PageViewPerformanceManager(_self.core);
                    _self._pageViewManager = new PageViewManager(_this, _self.config.overridePageViewDuration, _self.core, _self._pageViewPerformanceManager);
                    _self._pageVisitTimeManager = new PageVisitTimeManager(_self.diagLog(), function (pageName, pageUrl, pageVisitTime) { return trackPageVisitTime(pageName, pageUrl, pageVisitTime); });
                    _self._telemetryInitializers = _self._telemetryInitializers || [];
                    _addDefaultTelemetryInitializers(configGetters);
                    _eventTracking = new Timing(_self.diagLog(), "trackEvent");
                    _eventTracking.action =
                        function (name, url, duration, properties) {
                            if (!properties) {
                                properties = {};
                            }
                            properties[durationProperty] = duration.toString();
                            _self.trackEvent({ name: name, properties: properties });
                        };
                    _pageTracking = new Timing(_self.diagLog(), "trackPageView");
                    _pageTracking.action = function (name, url, duration, properties, measurements) {
                        if (isNullOrUndefined(properties)) {
                            properties = {};
                        }
                        properties[durationProperty] = duration.toString();
                        var pageViewItem = {
                            name: name,
                            uri: url,
                            properties: properties,
                            measurements: measurements
                        };
                        _self.sendPageViewInternal(pageViewItem, properties);
                    };
                    var _window = getWindow();
                    var _history = getHistory();
                    var _location = getLocation(true);
                    var instance = _this;
                    if (_self.config.disableExceptionTracking === false &&
                        !_self.config.autoExceptionInstrumented && _window) {
                        var onerror_1 = "onerror";
                        var originalOnError_1 = _window[onerror_1];
                        _window.onerror = function (message, url, lineNumber, columnNumber, error) {
                            var evt = _window[strEvent];
                            var handled = originalOnError_1 && originalOnError_1(message, url, lineNumber, columnNumber, error);
                            if (handled !== true) {
                                instance._onerror(Exception.CreateAutoException(message, url, lineNumber, columnNumber, error, evt));
                            }
                            return handled;
                        };
                        _self.config.autoExceptionInstrumented = true;
                    }
                    if (_self.config.disableExceptionTracking === false &&
                        _self.config.enableUnhandledPromiseRejectionTracking === true &&
                        !_self.config.autoUnhandledPromiseInstrumented && _window) {
                        var onunhandledrejection = "onunhandledrejection";
                        var originalOnUnhandledRejection_1 = _window[onunhandledrejection];
                        _window[onunhandledrejection] = function (error) {
                            var evt = _window[strEvent];
                            var handled = originalOnUnhandledRejection_1 && originalOnUnhandledRejection_1.call(_window, error);
                            if (handled !== true) {
                                instance._onerror(Exception.CreateAutoException(error.reason.toString(), _location ? _location.href : "", 0, 0, error, evt));
                            }
                            return handled;
                        };
                        _self.config.autoUnhandledPromiseInstrumented = true;
                    }
                    if (_self.config.enableAutoRouteTracking === true
                        && _history && isFunction(_history.pushState) && isFunction(_history.replaceState)
                        && _window
                        && typeof Event !== "undefined") {
                        var _self_1 = _this;
                        arrForEach(extensions, function (extension) {
                            if (extension.identifier === PropertiesPluginIdentifier) {
                                _properties = extension;
                            }
                        });
                        _history.pushState = (function (f) { return function pushState() {
                            var ret = f.apply(this, arguments);
                            _dispatchEvent(_window, createDomEvent(_self_1.config.namePrefix + "pushState"));
                            _dispatchEvent(_window, createDomEvent(_self_1.config.namePrefix + "locationchange"));
                            return ret;
                        }; })(_history.pushState);
                        _history.replaceState = (function (f) { return function replaceState() {
                            var ret = f.apply(this, arguments);
                            _dispatchEvent(_window, createDomEvent(_self_1.config.namePrefix + "replaceState"));
                            _dispatchEvent(_window, createDomEvent(_self_1.config.namePrefix + "locationchange"));
                            return ret;
                        }; })(_history.replaceState);
                        if (_window.addEventListener) {
                            _window.addEventListener(_self_1.config.namePrefix + "popstate", function () {
                                _dispatchEvent(_window, createDomEvent(_self_1.config.namePrefix + "locationchange"));
                            });
                            _window.addEventListener(_self_1.config.namePrefix + "locationchange", function () {
                                if (_properties && _properties.context && _properties.context.telemetryTrace) {
                                    _properties.context.telemetryTrace.traceID = generateW3CId();
                                    var traceLocationName = "_unknown_";
                                    if (_location && _location.pathname) {
                                        traceLocationName = _location.pathname + (_location.hash || "");
                                    }
                                    _properties.context.telemetryTrace.name = traceLocationName;
                                }
                                if (_currUri) {
                                    _prevUri = _currUri;
                                    _currUri = _location && _location.href || "";
                                }
                                else {
                                    _currUri = _location && _location.href || "";
                                }
                                setTimeout((function (uri) {
                                    _self_1.trackPageView({ refUri: uri, properties: { duration: 0 } });
                                }).bind(_this, _prevUri), _self_1.autoRoutePVDelay);
                            });
                        }
                    }
                    _self.setInitialized(true);
                };
                function trackPageVisitTime(pageName, pageUrl, pageVisitTime) {
                    var properties = { PageName: pageName, PageUrl: pageUrl };
                    _self.trackMetric({
                        name: "PageVisitTime",
                        average: pageVisitTime,
                        max: pageVisitTime,
                        min: pageVisitTime,
                        sampleCount: 1
                    }, properties);
                }
                function _addDefaultTelemetryInitializers(configGetters) {
                    if (!configGetters.isBrowserLinkTrackingEnabled()) {
                        var browserLinkPaths_1 = ['/browserLinkSignalR/', '/__browserLink/'];
                        var dropBrowserLinkRequests = function (envelope) {
                            if (envelope.baseType === RemoteDependencyData.dataType) {
                                var remoteData = envelope.baseData;
                                if (remoteData) {
                                    for (var i = 0; i < browserLinkPaths_1.length; i++) {
                                        if (remoteData.target && remoteData.target.indexOf(browserLinkPaths_1[i]) >= 0) {
                                            return false;
                                        }
                                    }
                                }
                            }
                            return true;
                        };
                        _addTelemetryInitializer(dropBrowserLinkRequests);
                    }
                }
                function _addTelemetryInitializer(telemetryInitializer) {
                    _self._telemetryInitializers.push(telemetryInitializer);
                }
                function _sendCORSException(exception, properties) {
                    var telemetryItem = TelemetryItemCreator.create(exception, Exception.dataType, Exception.envelopeType, _self.diagLog(), properties);
                    _self.core.track(telemetryItem);
                }
            });
            return _this;
        }
        ApplicationInsights.getDefaultConfig = function (config) {
            if (!config) {
                config = {};
            }
            config.sessionRenewalMs = 30 * 60 * 1000;
            config.sessionExpirationMs = 24 * 60 * 60 * 1000;
            config.disableExceptionTracking = stringToBoolOrDefault(config.disableExceptionTracking);
            config.autoTrackPageVisitTime = stringToBoolOrDefault(config.autoTrackPageVisitTime);
            config.overridePageViewDuration = stringToBoolOrDefault(config.overridePageViewDuration);
            config.enableUnhandledPromiseRejectionTracking = stringToBoolOrDefault(config.enableUnhandledPromiseRejectionTracking);
            if (isNaN(config.samplingPercentage) || config.samplingPercentage <= 0 || config.samplingPercentage >= 100) {
                config.samplingPercentage = 100;
            }
            config.isStorageUseDisabled = stringToBoolOrDefault(config.isStorageUseDisabled);
            config.isBrowserLinkTrackingEnabled = stringToBoolOrDefault(config.isBrowserLinkTrackingEnabled);
            config.enableAutoRouteTracking = stringToBoolOrDefault(config.enableAutoRouteTracking);
            config.namePrefix = config.namePrefix || "";
            config.enableDebug = stringToBoolOrDefault(config.enableDebug);
            config.disableFlushOnBeforeUnload = stringToBoolOrDefault(config.disableFlushOnBeforeUnload);
            config.disableFlushOnUnload = stringToBoolOrDefault(config.disableFlushOnUnload, config.disableFlushOnBeforeUnload);
            return config;
        };
        ApplicationInsights.Version = "2.6.4";
        return ApplicationInsights;
    }(BaseTelemetryPlugin));
    var Timing = /** @class */ (function () {
        function Timing(logger, name) {
            var _self = this;
            var _events = {};
            _self.start = function (name) {
                if (typeof _events[name] !== "undefined") {
                    logger.throwInternal(LoggingSeverity.WARNING, _InternalMessageId.StartCalledMoreThanOnce, "start was called more than once for this event without calling stop.", { name: name, key: name }, true);
                }
                _events[name] = +new Date;
            };
            _self.stop = function (name, url, properties, measurements) {
                var start = _events[name];
                if (isNaN(start)) {
                    logger.throwInternal(LoggingSeverity.WARNING, _InternalMessageId.StopCalledWithoutStart, "stop was called without a corresponding start.", { name: name, key: name }, true);
                }
                else {
                    var end = +new Date;
                    var duration = dateTimeUtilsDuration(start, end);
                    _self.action(name, url, duration, properties, measurements);
                }
                delete _events[name];
                _events[name] = undefined;
            };
        }
        return Timing;
    }());

    exports.ApplicationInsights = ApplicationInsights;

    (function(obj, prop, descriptor) { /* ai_es3_polyfil defineProperty */ var func = Object["defineProperty"]; if (func) { try { return func(obj, prop, descriptor); } catch(e) { /* IE8 defines defineProperty, but will throw */ } } if (descriptor && typeof descriptor.value !== undefined) { obj[prop] = descriptor.value; } return obj; })(exports, '__esModule', { value: true });

})));//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/ee8c7def80afc00dd6e593ef12f37756d8f504ea/node_modules/@microsoft/applicationinsights-analytics-js/dist/applicationinsights-analytics-js.js.map
