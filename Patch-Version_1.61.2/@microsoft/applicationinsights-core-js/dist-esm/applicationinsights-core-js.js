/*
 * Application Insights JavaScript SDK - Core, 2.6.4
 * Copyright (c) Microsoft and contributors. All rights reserved.
 */
export { MinChannelPriorty } from "./JavaScriptSDK.Interfaces/IChannelControls";
export { EventsDiscardedReason } from "./JavaScriptSDK.Enums/EventsDiscardedReason";
export { AppInsightsCore } from "./JavaScriptSDK/AppInsightsCore";
export { BaseCore } from './JavaScriptSDK/BaseCore';
export { BaseTelemetryPlugin } from './JavaScriptSDK/BaseTelemetryPlugin';
export { randomValue, random32, mwcRandomSeed, mwcRandom32 } from './JavaScriptSDK/RandomHelper';
export { CoreUtils, EventHelper, Undefined, addEventHandler, newGuid, perfNow, newId, generateW3CId, disableCookies, canUseCookies, getCookie, setCookie, deleteCookie, _legacyCookieMgr } from "./JavaScriptSDK/CoreUtils";
export { isTypeof, isUndefined, isNullOrUndefined, hasOwnProperty, isObject, isFunction, attachEvent, detachEvent, normalizeJsName, objForEachKey, strEndsWith, strStartsWith, isDate, isArray, isError, isString, isNumber, isBoolean, toISOString, arrForEach, arrIndexOf, arrMap, arrReduce, strTrim, objKeys, objDefineAccessors, dateNow, getExceptionName, throwError, strContains, isSymbol, setValue, getSetValue, isNotTruthy, isTruthy, proxyAssign, createClassFromInterface, optimizeObject, isNotUndefined, isNotNullOrUndefined, objFreeze, objSeal } from './JavaScriptSDK/HelperFuncs';
export { getGlobalInst, hasWindow, getWindow, hasDocument, getDocument, getCrypto, getMsCrypto, hasNavigator, getNavigator, hasHistory, getHistory, getLocation, getPerformance, hasJSON, getJSON, isReactNative, getConsole, dumpObj, isIE, getIEVersion, isSafari, setEnableEnvMocks } from "./JavaScriptSDK/EnvUtils";
export { getGlobal, objCreateFn as objCreate, strShimPrototype as strPrototype, strShimFunction as strFunction, strShimUndefined as strUndefined, strShimObject as strObject } from '@microsoft/applicationinsights-shims';
export { NotificationManager } from "./JavaScriptSDK/NotificationManager";
export { PerfEvent, PerfManager, doPerf } from './JavaScriptSDK/PerfManager';
export { safeGetLogger, DiagnosticLogger, _InternalLogMessage } from './JavaScriptSDK/DiagnosticLogger';
export { ProcessTelemetryContext } from './JavaScriptSDK/ProcessTelemetryContext';
export { initializePlugins, sortPlugins } from "./JavaScriptSDK/TelemetryHelpers";
export { _InternalMessageId, LoggingSeverity } from './JavaScriptSDK.Enums/LoggingEnums';
export { InstrumentProto, InstrumentProtos, InstrumentFunc, InstrumentFuncs } from "./JavaScriptSDK/InstrumentHooks";
export { createCookieMgr, safeGetCookieMgr, uaDisallowsSameSiteNone, areCookiesSupported } from './JavaScriptSDK/CookieMgr';
export { strIKey, strExtensionConfig } from './JavaScriptSDK/Constants';//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/fe719cd3e5825bf14e14182fddeb88ee8daf044f/node_modules/@microsoft/applicationinsights-core-js/dist-esm/applicationinsights-core-js.js.map