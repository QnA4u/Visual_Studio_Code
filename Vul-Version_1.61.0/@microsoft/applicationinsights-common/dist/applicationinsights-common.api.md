## API Report File for "@microsoft/applicationinsights-common"

> Do not edit this file. It is a report generated by [API Extractor](https://api-extractor.com/).

```ts

import { IChannelControls } from '@microsoft/applicationinsights-core-js';
import { IConfiguration } from '@microsoft/applicationinsights-core-js';
import { ICookieMgr } from '@microsoft/applicationinsights-core-js';
import { ICookieMgrConfig } from '@microsoft/applicationinsights-core-js';
import { IDiagnosticLogger } from '@microsoft/applicationinsights-core-js';
import { _InternalMessageId } from '@microsoft/applicationinsights-core-js';
import { IPlugin } from '@microsoft/applicationinsights-core-js';
import { ITelemetryItem } from '@microsoft/applicationinsights-core-js';

// @public
export class AIBase {
    constructor();
    baseType: string;
}

// @public
export class AIData<TDomain> extends AIBase {
    constructor();
    baseData: TDomain;
    baseType: string;
}

// @public (undocumented)
export const AnalyticsPluginIdentifier = "ApplicationInsightsAnalytics";

// @public (undocumented)
export const BreezeChannelIdentifier = "AppInsightsChannelPlugin";

// @public (undocumented)
export class ConfigurationManager {
    // (undocumented)
    static getConfig(config: IConfiguration & IConfig, field: string, identifier?: string, defaultValue?: number | string | boolean): number | string | boolean;
}

// @public (undocumented)
export const ConnectionStringParser: {
    parse: (connectionString?: string) => ConnectionString;
};

// Warning: (ae-forgotten-export) The symbol "ContextTagKeys_base" needs to be exported by the entry point applicationinsights-common.d.ts
//
// @public (undocumented)
export class ContextTagKeys extends ContextTagKeys_base {
    constructor();
}

// @public (undocumented)
export const CorrelationIdHelper: ICorrelationIdHelper;

// @public (undocumented)
export function createDomEvent(eventName: string): Event;

// @public (undocumented)
export let CtxTagKeys: ContextTagKeys;

// @public (undocumented)
export class Data<TDomain> extends AIData<TDomain> implements ISerializable {
    constructor(baseType: string, data: TDomain);
    aiDataContract: {
        baseType: FieldType;
        baseData: FieldType;
    };
}

// @public (undocumented)
export function dataSanitizeException(logger: IDiagnosticLogger, exception: any): any;

// @public (undocumented)
export function dataSanitizeId(logger: IDiagnosticLogger, id: string): string;

// @public (undocumented)
export function dataSanitizeInput(logger: IDiagnosticLogger, input: any, maxLength: number, _msgId: _InternalMessageId): any;

// @public (undocumented)
export function dataSanitizeKey(logger: IDiagnosticLogger, name: any): any;

// @public (undocumented)
export function dataSanitizeKeyAndAddUniqueness(logger: IDiagnosticLogger, key: any, map: any): any;

// @public (undocumented)
export function dataSanitizeMeasurements(logger: IDiagnosticLogger, measurements: any): any;

// @public (undocumented)
export function dataSanitizeMessage(logger: IDiagnosticLogger, message: any): any;

// @public (undocumented)
export function dataSanitizeProperties(logger: IDiagnosticLogger, properties: any): any;

// @public
export const DataSanitizer: IDataSanitizer;

// @public (undocumented)
export const enum DataSanitizerValues {
    MAX_EXCEPTION_LENGTH = 32768,
    MAX_ID_LENGTH = 128,
    MAX_MESSAGE_LENGTH = 32768,
    MAX_NAME_LENGTH = 150,
    MAX_PROPERTY_LENGTH = 8192,
    MAX_STRING_LENGTH = 1024,
    MAX_URL_LENGTH = 2048,
}

// @public (undocumented)
export function dataSanitizeString(logger: IDiagnosticLogger, value: any, maxLength?: number): any;

// @public (undocumented)
export function dataSanitizeUrl(logger: IDiagnosticLogger, url: any): any;

// @public
export const DateTimeUtils: IDateTimeUtils;

// @public (undocumented)
export function dateTimeUtilsDuration(start: number, end: number): number;

// @public (undocumented)
export function dateTimeUtilsNow(): number;

// @public (undocumented)
export const DEFAULT_BREEZE_ENDPOINT = "https://dc.services.visualstudio.com";

// @public
export const DisabledPropertyName: string;

// @public (undocumented)
export enum DistributedTracingModes {
    AI = 0,
    AI_AND_W3C = 1,
    W3C = 2,
}

// @public (undocumented)
export function dsPadNumber(num: number): string;

// Warning: (ae-forgotten-export) The symbol "Envelope" needs to be exported by the entry point applicationinsights-common.d.ts
//
// @public (undocumented)
export class Envelope extends Envelope_2 implements IEnvelope {
    constructor(logger: IDiagnosticLogger, data: AIBase, name: string);
    aiDataContract: any;
}

// Warning: (ae-forgotten-export) The symbol "EventData" needs to be exported by the entry point applicationinsights-common.d.ts
//
// @public (undocumented)
class Event_2 extends EventData implements ISerializable {
    constructor(logger: IDiagnosticLogger, name: string, properties?: any, measurements?: any);
    // (undocumented)
    aiDataContract: {
        ver: FieldType;
        name: FieldType;
        properties: FieldType;
        measurements: FieldType;
    };
    // (undocumented)
    static dataType: string;
    // (undocumented)
    static envelopeType: string;
}

export { Event_2 as Event }

// Warning: (ae-forgotten-export) The symbol "ExceptionData" needs to be exported by the entry point applicationinsights-common.d.ts
//
// @public (undocumented)
export class Exception extends ExceptionData implements ISerializable {
    constructor(logger: IDiagnosticLogger, exception: Error | IExceptionInternal | IAutoExceptionTelemetry, properties?: {
        [key: string]: any;
    }, measurements?: {
        [key: string]: number;
    }, severityLevel?: SeverityLevel, id?: string);
    // (undocumented)
    aiDataContract: {
        ver: FieldType;
        exceptions: FieldType;
        severityLevel: FieldType;
        properties: FieldType;
        measurements: FieldType;
    };
    // (undocumented)
    static CreateAutoException(message: string | Event, url: string, lineNumber: number, columnNumber: number, error: any, evt?: Event | string, stack?: string, errorSrc?: string): IAutoExceptionTelemetry;
    // (undocumented)
    static CreateFromInterface(logger: IDiagnosticLogger, exception: IExceptionInternal, properties?: any, measurements?: {
        [key: string]: number;
    }): Exception;
    static CreateSimpleException(message: string, typeName: string, assembly: string, fileName: string, details: string, line: number): Exception;
    // (undocumented)
    static dataType: string;
    // (undocumented)
    static envelopeType: string;
    // Warning: (ae-forgotten-export) The symbol "_formatErrorCode" needs to be exported by the entry point applicationinsights-common.d.ts
    //
    // (undocumented)
    static formatError: typeof _formatErrorCode;
    // (undocumented)
    id?: string;
    // (undocumented)
    isManual?: boolean;
    // (undocumented)
    problemGroup?: string;
    // (undocumented)
    toInterface(): IExceptionInternal;
}

// @public (undocumented)
export const Extensions: {
    UserExt: string;
    DeviceExt: string;
    TraceExt: string;
    WebExt: string;
    AppExt: string;
    OSExt: string;
    SessionExt: string;
    SDKExt: string;
};

// @public
export const enum FieldType {
    // (undocumented)
    Array = 2,
    // (undocumented)
    Default = 0,
    // (undocumented)
    Hidden = 4,
    // (undocumented)
    Required = 1,
}

// @public (undocumented)
export function getExtensionByName(extensions: IPlugin[], identifier: string): IPlugin | null;

// @public (undocumented)
export const HttpMethod = "http.method";

// @public (undocumented)
export interface IAppInsights {
    // (undocumented)
    addTelemetryInitializer(telemetryInitializer: (item: ITelemetryItem) => boolean | void): void;
    getCookieMgr(): ICookieMgr;
    // (undocumented)
    _onerror(exception: IAutoExceptionTelemetry): void;
    // (undocumented)
    startTrackEvent(name: string): void;
    // (undocumented)
    startTrackPage(name?: string): void;
    // (undocumented)
    stopTrackEvent(name: string, properties?: Object, measurements?: Object): void;
    // (undocumented)
    stopTrackPage(name?: string, url?: string, customProperties?: Object): void;
    // (undocumented)
    trackEvent(event: IEventTelemetry, customProperties?: {
        [key: string]: any;
    }): void;
    // (undocumented)
    trackException(exception: IExceptionTelemetry, customProperties?: {
        [key: string]: any;
    }): void;
    // (undocumented)
    trackMetric(metric: IMetricTelemetry, customProperties?: {
        [key: string]: any;
    }): void;
    // (undocumented)
    trackPageView(pageView: IPageViewTelemetry, customProperties?: {
        [key: string]: any;
    }): void;
    // (undocumented)
    trackPageViewPerformance(pageViewPerformance: IPageViewPerformanceTelemetry, customProperties?: {
        [key: string]: any;
    }): void;
    // (undocumented)
    trackTrace(trace: ITraceTelemetry, customProperties?: {
        [key: string]: any;
    }): void;
}

// @public (undocumented)
export interface IApplication {
    build: string;
    ver: string;
}

// @public
export interface IAutoExceptionTelemetry {
    columnNumber: number;
    error: any;
    errorSrc?: string;
    evt?: Event | string;
    lineNumber: number;
    message: string;
    // Warning: (ae-forgotten-export) The symbol "IStackDetails" needs to be exported by the entry point applicationinsights-common.d.ts
    stackDetails?: IStackDetails;
    typeName?: string;
    url: string;
}

// @public (undocumented)
export interface IChannelControlsAI extends IChannelControls {
}

// @public
export interface IConfig {
    accountId?: string;
    ajaxPerfLookupDelay?: number;
    appId?: string;
    autoExceptionInstrumented?: boolean;
    autoTrackPageVisitTime?: boolean;
    autoUnhandledPromiseInstrumented?: boolean;
    cookieDomain?: string;
    cookieMgrCfg?: ICookieMgrConfig;
    cookiePath?: string;
    // (undocumented)
    correlationHeaderDomains?: string[];
    correlationHeaderExcludedDomains?: string[];
    correlationHeaderExcludePatterns?: RegExp[];
    customHeaders?: [{
        header: string;
        value: string;
    }];
    disableAjaxTracking?: boolean;
    disableCookiesUsage?: boolean;
    disableCorrelationHeaders?: boolean;
    disableDataLossAnalysis?: boolean;
    disableExceptionTracking?: boolean;
    disableFetchTracking?: boolean;
    disableFlushOnBeforeUnload?: boolean;
    disableFlushOnUnload?: boolean;
    disableTelemetry?: boolean;
    distributedTracingMode?: DistributedTracingModes;
    emitLineDelimitedJson?: boolean;
    enableAjaxErrorStatusText?: boolean;
    enableAjaxPerfTracking?: boolean;
    enableAutoRouteTracking?: boolean;
    enableCorsCorrelation?: boolean;
    enableDebug?: boolean;
    enableRequestHeaderTracking?: boolean;
    enableResponseHeaderTracking?: boolean;
    enableSessionStorageBuffer?: boolean;
    enableUnhandledPromiseRejectionTracking?: boolean;
    excludeRequestFromAutoTrackingPatterns?: string[] | RegExp[];
    isBeaconApiDisabled?: boolean;
    isBrowserLinkTrackingEnabled?: boolean;
    // @deprecated (undocumented)
    isCookieUseDisabled?: boolean;
    isRetryDisabled?: boolean;
    isStorageUseDisabled?: boolean;
    maxAjaxCallsPerView?: number;
    maxAjaxPerfLookupAttempts?: number;
    maxBatchInterval?: number;
    maxBatchSizeInBytes?: number;
    namePrefix?: string;
    onunloadDisableBeacon?: boolean;
    overridePageViewDuration?: boolean;
    samplingPercentage?: number;
    sdkExtension?: string;
    sessionCookiePostfix?: string;
    sessionExpirationMs?: number;
    sessionRenewalMs?: number;
    // @deprecated (undocumented)
    url?: string;
    userCookiePostfix?: string;
}

// @public (undocumented)
export interface IContextTagKeys {
    readonly applicationBuild: string;
    readonly applicationId: string;
    readonly applicationLayer: string;
    readonly applicationTypeId: string;
    readonly applicationVersion: string;
    // (undocumented)
    readonly cloudDeploymentUnit: string;
    // (undocumented)
    readonly cloudEnvironment: string;
    // (undocumented)
    readonly cloudLocation: string;
    // (undocumented)
    readonly cloudName: string;
    readonly cloudRole: string;
    readonly cloudRoleInstance: string;
    // (undocumented)
    readonly cloudRoleVer: string;
    // (undocumented)
    readonly deviceBrowser: string;
    readonly deviceBrowserVersion: string;
    // (undocumented)
    readonly deviceFriendlyName: string;
    readonly deviceId: string;
    // (undocumented)
    readonly deviceIp: string;
    // (undocumented)
    readonly deviceLanguage: string;
    readonly deviceLocale: string;
    // (undocumented)
    readonly deviceMachineName: string;
    readonly deviceModel: string;
    // (undocumented)
    readonly deviceNetwork: string;
    // (undocumented)
    readonly deviceNetworkName: string;
    readonly deviceOEMName: string;
    // (undocumented)
    readonly deviceOS: string;
    readonly deviceOSVersion: string;
    readonly deviceRoleInstance: string;
    readonly deviceRoleName: string;
    // (undocumented)
    readonly deviceScreenResolution: string;
    readonly deviceType: string;
    // (undocumented)
    readonly deviceVMName: string;
    readonly internalAgentVersion: string;
    readonly internalNodeName: string;
    readonly internalSdkSrc: string;
    readonly internalSdkVersion: string;
    readonly internalSnippet: string;
    readonly locationCity: string;
    readonly locationCountry: string;
    readonly locationIp: string;
    readonly locationProvince: string;
    readonly operationCorrelationVector: string;
    readonly operationId: string;
    readonly operationName: string;
    readonly operationParentId: string;
    // (undocumented)
    readonly operationRootId: string;
    readonly operationSyntheticSource: string;
    readonly sessionId: string;
    readonly sessionIsFirst: string;
    // (undocumented)
    readonly sessionIsNew: string;
    // (undocumented)
    readonly userAccountAcquisitionDate: string;
    readonly userAccountId: string;
    readonly userAgent: string;
    // (undocumented)
    readonly userAnonymousUserAcquisitionDate: string;
    // (undocumented)
    readonly userAuthenticatedUserAcquisitionDate: string;
    readonly userAuthUserId: string;
    readonly userId: string;
    readonly userStoreRegion: string;
}

// @public (undocumented)
export interface ICorrelationConfig {
    ajaxPerfLookupDelay?: number;
    // (undocumented)
    appId?: string;
    // (undocumented)
    correlationHeaderDomains?: string[];
    // (undocumented)
    correlationHeaderExcludedDomains: string[];
    // (undocumented)
    correlationHeaderExcludePatterns?: RegExp[];
    // (undocumented)
    disableAjaxTracking: boolean;
    // (undocumented)
    disableCorrelationHeaders: boolean;
    // (undocumented)
    disableFetchTracking: boolean;
    // (undocumented)
    distributedTracingMode: DistributedTracingModes;
    // (undocumented)
    enableAjaxErrorStatusText?: boolean;
    enableAjaxPerfTracking?: boolean;
    // (undocumented)
    enableCorsCorrelation: boolean;
    // (undocumented)
    enableRequestHeaderTracking?: boolean;
    // (undocumented)
    enableResponseHeaderTracking?: boolean;
    excludeRequestFromAutoTrackingPatterns?: string[] | RegExp[];
    ignoreHeaders?: string[];
    // (undocumented)
    maxAjaxCallsPerView: number;
    maxAjaxPerfLookupAttempts?: number;
}

// @public (undocumented)
export interface ICorrelationIdHelper {
    canIncludeCorrelationHeader(config: ICorrelationConfig, requestUrl: string, currentHost?: string): boolean;
    // (undocumented)
    correlationIdPrefix: string;
    getCorrelationContext(responseHeader: string): string | undefined;
    getCorrelationContextValue(responseHeader: string, key: string): string | undefined;
}

// @public (undocumented)
export interface IDataSanitizer {
    MAX_EXCEPTION_LENGTH: number;
    MAX_ID_LENGTH: number;
    MAX_MESSAGE_LENGTH: number;
    MAX_NAME_LENGTH: number;
    MAX_PROPERTY_LENGTH: number;
    MAX_STRING_LENGTH: number;
    MAX_URL_LENGTH: number;
    // (undocumented)
    padNumber: (num: number) => string;
    // (undocumented)
    sanitizeException: (logger: IDiagnosticLogger, exception: any) => string;
    // (undocumented)
    sanitizeId: (logger: IDiagnosticLogger, id: string) => string;
    // (undocumented)
    sanitizeInput: (logger: IDiagnosticLogger, input: any, maxLength: number, _msgId: _InternalMessageId) => any;
    // (undocumented)
    sanitizeKey: (logger: IDiagnosticLogger, name: any) => string;
    // (undocumented)
    sanitizeKeyAndAddUniqueness: (logger: IDiagnosticLogger, key: any, map: any) => string;
    // (undocumented)
    sanitizeMeasurements: (logger: IDiagnosticLogger, measurements: any) => any;
    // (undocumented)
    sanitizeMessage: (logger: IDiagnosticLogger, message: any) => string;
    // (undocumented)
    sanitizeProperties: (logger: IDiagnosticLogger, properties: any) => any;
    // (undocumented)
    sanitizeString: (logger: IDiagnosticLogger, value: any, maxLength?: number) => string;
    // (undocumented)
    sanitizeUrl: (logger: IDiagnosticLogger, url: any) => string;
    trim: (str: any) => string;
}

// @public (undocumented)
export interface IDateTimeUtils {
    GetDuration: (start: number, end: number) => number;
    Now: () => number;
}

// Warning: (ae-forgotten-export) The symbol "IPartC" needs to be exported by the entry point applicationinsights-common.d.ts
//
// @public
export interface IDependencyTelemetry extends IPartC {
    // (undocumented)
    correlationContext?: string;
    // (undocumented)
    data?: string;
    // (undocumented)
    duration?: number;
    // (undocumented)
    id: string;
    // (undocumented)
    name?: string;
    // (undocumented)
    responseCode: number;
    // (undocumented)
    startTime?: Date;
    // (undocumented)
    success?: boolean;
    // (undocumented)
    target?: string;
    // (undocumented)
    type?: string;
}

// @public (undocumented)
export interface IDevice {
    deviceClass: string;
    id: string;
    ip: string;
    model: string;
    resolution: string;
}

// @public (undocumented)
export interface IEnvelope extends ISerializable {
    // (undocumented)
    data: any;
    // (undocumented)
    iKey: string;
    // (undocumented)
    name: string;
    // (undocumented)
    sampleRate: number;
    // (undocumented)
    seq: string;
    // (undocumented)
    tags: {
        [name: string]: any;
    };
    // (undocumented)
    time: string;
    // (undocumented)
    ver: number;
}

// @public (undocumented)
export interface IEventTelemetry extends IPartC {
    name: string;
}

// @public (undocumented)
export interface IExceptionInternal extends IPartC {
    // Warning: (ae-forgotten-export) The symbol "IExceptionDetailsInternal" needs to be exported by the entry point applicationinsights-common.d.ts
    //
    // (undocumented)
    exceptions: IExceptionDetailsInternal[];
    // (undocumented)
    id: string;
    // (undocumented)
    isManual: boolean;
    // (undocumented)
    problemGroup: string;
    // (undocumented)
    severityLevel?: SeverityLevel | number;
    // (undocumented)
    ver: string;
}

// @public
export interface IExceptionTelemetry extends IPartC {
    // @deprecated (undocumented)
    error?: Error;
    exception?: Error | IAutoExceptionTelemetry;
    id?: string;
    severityLevel?: SeverityLevel | number;
}

// @public (undocumented)
export interface IInternal {
    agentVersion: string;
    sdkSrc: string;
    sdkVersion: string;
    snippetVer: string;
}

// @public (undocumented)
export interface ILocation {
    ip: string;
}

// @public (undocumented)
export interface IMetricTelemetry extends IPartC {
    average: number;
    max?: number;
    min?: number;
    name: string;
    sampleCount?: number;
}

// @public (undocumented)
export interface IOperatingSystem {
    // (undocumented)
    name: string;
}

// @public (undocumented)
export interface IPageViewPerformanceTelemetry extends IPartC {
    domProcessing?: string;
    duration?: string;
    name?: string;
    networkConnect?: string;
    perfTotal?: string;
    receivedResponse?: string;
    sentRequest?: string;
    uri?: string;
}

// @public (undocumented)
export interface IPageViewPerformanceTelemetryInternal extends IPageViewPerformanceTelemetry {
    durationMs?: number;
    id?: string;
    isValid?: boolean;
    ver?: string;
}

// @public
export interface IPageViewTelemetry extends IPartC {
    isLoggedIn?: boolean;
    name?: string;
    pageType?: string;
    properties?: {
        duration?: number;
        [key: string]: any;
    };
    refUri?: string;
    uri?: string;
}

// @public (undocumented)
export interface IPageViewTelemetryInternal extends IPageViewTelemetry {
    id?: string;
    ver?: string;
}

// @public (undocumented)
export interface IPropertiesPlugin {
    // (undocumented)
    readonly context: ITelemetryContext;
}

// @public (undocumented)
export interface IRequestHeaders {
    requestContextAppIdFormat: string;
    requestContextHeader: string;
    // (undocumented)
    requestContextHeaderLowerCase: string;
    requestContextTargetKey: string;
    requestIdHeader: string;
    sdkContextHeader: string;
    sdkContextHeaderAppIdRequest: string;
    traceParentHeader: string;
    traceStateHeader: string;
}

// @public (undocumented)
export interface ISample {
    sampleRate: number;
}

// @public (undocumented)
export function isBeaconApiSupported(): boolean;

// @public (undocumented)
export function isCrossOriginError(message: string | Event, url: string, lineNumber: number, columnNumber: number, error: Error | Event): boolean;

// @public (undocumented)
export interface ISerializable {
    aiDataContract: any;
}

// @public (undocumented)
export interface ISession {
    acquisitionDate?: number;
    id?: string;
    renewalDate?: number;
}

// @public (undocumented)
export function isInternalApplicationInsightsEndpoint(endpointUrl: string): boolean;

// @public (undocumented)
export interface ITelemetryContext {
    appId: () => string;
    readonly application: IApplication;
    readonly device: IDevice;
    readonly internal: IInternal;
    readonly location: ILocation;
    readonly os?: IOperatingSystem;
    readonly session: ISession;
    readonly telemetryTrace: ITelemetryTrace;
    readonly user: IUserContext;
    readonly web?: IWeb;
}

// @public (undocumented)
export interface ITelemetryTrace {
    name?: string;
    parentID: string;
    traceID: string;
    traceState?: ITraceState;
}

// @public (undocumented)
export interface ITraceState {
}

// @public (undocumented)
export interface ITraceTelemetry extends IPartC {
    message: string;
    severityLevel?: SeverityLevel;
}

// @public (undocumented)
export interface IUrlHelper {
    // (undocumented)
    getAbsoluteUrl: (url: string) => string;
    // (undocumented)
    getCompleteUrl: (method: string, absoluteUrl: string) => string;
    // (undocumented)
    getPathName: (url: string) => string;
    parseFullHost: (url: string, inclPort?: boolean) => string;
    // (undocumented)
    parseHost: (url: string, inclPort?: boolean) => string;
    // (undocumented)
    parseUrl: (url: string) => HTMLAnchorElement;
}

// @public (undocumented)
export interface IUser {
    accountAcquisitionDate: string;
    accountId: string;
    authenticatedId: string;
    config: any;
    id: string;
    isNewUser?: boolean;
    localId: string;
}

// @public (undocumented)
export interface IUserContext extends IUser {
    // (undocumented)
    clearAuthenticatedUserContext(): void;
    // (undocumented)
    setAuthenticatedUserContext(authenticatedUserId: string, accountId?: string, storeInCookie?: boolean): void;
}

// @public (undocumented)
export interface IUtil {
    addEventHandler: (obj: any, eventNameWithoutOn: string, handlerRef: any, useCapture: boolean) => boolean;
    // @deprecated (undocumented)
    canUseCookies: (logger: IDiagnosticLogger) => any;
    canUseLocalStorage: () => boolean;
    canUseSessionStorage: () => boolean;
    // (undocumented)
    createDomEvent: (eventName: string) => Event;
    // @deprecated (undocumented)
    deleteCookie: (logger: IDiagnosticLogger, name: string) => void;
    // @deprecated (undocumented)
    disableCookies: () => void;
    // (undocumented)
    disableStorage: () => void;
    // (undocumented)
    disallowsSameSiteNone: (userAgent: string) => boolean;
    dump: (object: any) => string;
    generateW3CId: () => string;
    // @deprecated (undocumented)
    getCookie: (logger: IDiagnosticLogger, name: string) => string;
    getExceptionName: (object: any) => string;
    // (undocumented)
    getExtension: (extensions: IPlugin[], identifier: string) => IPlugin | null;
    getIEVersion: (userAgentStr?: string) => number;
    getSessionStorage: (logger: IDiagnosticLogger, name: string) => string;
    getSessionStorageKeys: () => string[];
    getStorage: (logger: IDiagnosticLogger, name: string) => string;
    isArray: (obj: any) => boolean;
    IsBeaconApiSupported: () => boolean;
    isCrossOriginError: (message: string | Event, url: string, lineNumber: number, columnNumber: number, error: Error) => boolean;
    isDate: (obj: any) => obj is Date;
    isError: (obj: any) => obj is Error;
    isInternalApplicationInsightsEndpoint: (endpointUrl: string) => boolean;
    msToTimeSpan: (totalms: number) => string;
    newId: () => string;
    // (undocumented)
    NotSpecified: string;
    random32: () => number;
    removeSessionStorage: (logger: IDiagnosticLogger, name: string) => boolean;
    removeStorage: (logger: IDiagnosticLogger, name: string) => boolean;
    // @deprecated (undocumented)
    setCookie: (logger: IDiagnosticLogger, name: string, value: string, domain?: string) => void;
    setSessionStorage: (logger: IDiagnosticLogger, name: string, data: string) => boolean;
    setStorage: (logger: IDiagnosticLogger, name: string, data: string) => boolean;
    // (undocumented)
    stringToBoolOrDefault: (str: any, defaultValue?: boolean) => boolean;
    // (undocumented)
    toISOStringForIE8: (date: Date) => string;
    trim: (str: any) => string;
}

// @public (undocumented)
export interface IWeb {
    browser: string;
    browserLang: string;
    browserVer: string;
    domain: string;
    isManual: boolean;
    screenRes: string;
    userConsent: boolean;
}

// Warning: (ae-forgotten-export) The symbol "MetricData" needs to be exported by the entry point applicationinsights-common.d.ts
//
// @public (undocumented)
export class Metric extends MetricData implements ISerializable {
    constructor(logger: IDiagnosticLogger, name: string, value: number, count?: number, min?: number, max?: number, properties?: any, measurements?: {
        [key: string]: number;
    });
    // (undocumented)
    aiDataContract: {
        ver: FieldType;
        metrics: FieldType;
        properties: FieldType;
    };
    // (undocumented)
    static dataType: string;
    // (undocumented)
    static envelopeType: string;
}

// @public
export function msToTimeSpan(totalms: number): string;

// @public (undocumented)
export class PageView extends PageViewData implements ISerializable {
    constructor(logger: IDiagnosticLogger, name?: string, url?: string, durationMs?: number, properties?: {
        [key: string]: string;
    }, measurements?: {
        [key: string]: number;
    }, id?: string);
    // (undocumented)
    aiDataContract: {
        ver: FieldType;
        name: FieldType;
        url: FieldType;
        duration: FieldType;
        properties: FieldType;
        measurements: FieldType;
        id: FieldType;
    };
    // (undocumented)
    static dataType: string;
    // (undocumented)
    static envelopeType: string;
}

// @public
export class PageViewData extends EventData {
    constructor();
    duration: string;
    id: string;
    measurements: any;
    name: string;
    properties: any;
    url: string;
    ver: number;
}

// Warning: (ae-forgotten-export) The symbol "PageViewPerfData" needs to be exported by the entry point applicationinsights-common.d.ts
//
// @public (undocumented)
export class PageViewPerformance extends PageViewPerfData implements ISerializable {
    constructor(logger: IDiagnosticLogger, name: string, url: string, unused: number, properties?: {
        [key: string]: string;
    }, measurements?: {
        [key: string]: number;
    }, cs4BaseData?: IPageViewPerformanceTelemetry);
    // (undocumented)
    aiDataContract: {
        ver: FieldType;
        name: FieldType;
        url: FieldType;
        duration: FieldType;
        perfTotal: FieldType;
        networkConnect: FieldType;
        sentRequest: FieldType;
        receivedResponse: FieldType;
        domProcessing: FieldType;
        properties: FieldType;
        measurements: FieldType;
    };
    // (undocumented)
    static dataType: string;
    // (undocumented)
    static envelopeType: string;
}

// @public (undocumented)
export function parseConnectionString(connectionString?: string): ConnectionString;

// @public (undocumented)
export const ProcessLegacy = "ProcessLegacy";

// @public (undocumented)
export const PropertiesPluginIdentifier = "AppInsightsPropertiesPlugin";

// Warning: (ae-forgotten-export) The symbol "RemoteDependencyData" needs to be exported by the entry point applicationinsights-common.d.ts
//
// @public (undocumented)
export class RemoteDependencyData extends RemoteDependencyData_2 implements ISerializable {
    constructor(logger: IDiagnosticLogger, id: string, absoluteUrl: string, commandName: string, value: number, success: boolean, resultCode: number, method?: string, requestAPI?: string, correlationContext?: string, properties?: Object, measurements?: Object);
    // (undocumented)
    aiDataContract: {
        id: FieldType;
        ver: FieldType;
        name: FieldType;
        resultCode: FieldType;
        duration: FieldType;
        success: FieldType;
        data: FieldType;
        target: FieldType;
        type: FieldType;
        properties: FieldType;
        measurements: FieldType;
        kind: FieldType;
        value: FieldType;
        count: FieldType;
        min: FieldType;
        max: FieldType;
        stdDev: FieldType;
        dependencyKind: FieldType;
        dependencySource: FieldType;
        commandName: FieldType;
        dependencyTypeName: FieldType;
    };
    // (undocumented)
    static dataType: string;
    // (undocumented)
    static envelopeType: string;
}

// @public (undocumented)
export const RequestHeaders: IRequestHeaders;

// @public (undocumented)
export const SampleRate = "sampleRate";

// @public
export enum SeverityLevel {
    // (undocumented)
    Critical = 4,
    // (undocumented)
    Error = 3,
    // (undocumented)
    Information = 1,
    // (undocumented)
    Verbose = 0,
    // (undocumented)
    Warning = 2,
}

// @public (undocumented)
export function stringToBoolOrDefault(str: any, defaultValue?: boolean): boolean;

// @public (undocumented)
export const strNotSpecified = "not_specified";

// @public (undocumented)
export class TelemetryItemCreator {
    static create<T>(item: T, baseType: string, envelopeName: string, logger: IDiagnosticLogger, customProperties?: {
        [key: string]: any;
    }, systemProperties?: {
        [key: string]: any;
    }): ITelemetryItem;
}

// Warning: (ae-forgotten-export) The symbol "MessageData" needs to be exported by the entry point applicationinsights-common.d.ts
//
// @public (undocumented)
export class Trace extends MessageData implements ISerializable {
    constructor(logger: IDiagnosticLogger, message: string, severityLevel?: SeverityLevel, properties?: any, measurements?: {
        [key: string]: number;
    });
    // (undocumented)
    aiDataContract: {
        ver: FieldType;
        message: FieldType;
        severityLevel: FieldType;
        properties: FieldType;
    };
    // (undocumented)
    static dataType: string;
    // (undocumented)
    static envelopeType: string;
}

// @public (undocumented)
export function urlGetAbsoluteUrl(url: string): string;

// @public (undocumented)
export function urlGetCompleteUrl(method: string, absoluteUrl: string): string;

// @public (undocumented)
export function urlGetPathName(url: string): string;

// @public (undocumented)
export const UrlHelper: IUrlHelper;

// @public (undocumented)
export function urlParseFullHost(url: string, inclPort?: boolean): string;

// @public (undocumented)
export function urlParseHost(url: string, inclPort?: boolean): string;

// @public (undocumented)
export function urlParseUrl(url: string): HTMLAnchorElement;

// @public (undocumented)
export const Util: IUtil;

// @public (undocumented)
export function utlCanUseLocalStorage(): boolean;

// @public (undocumented)
export function utlCanUseSessionStorage(): boolean;

// @public (undocumented)
export function utlDisableStorage(): void;

// @public (undocumented)
export function utlGetLocalStorage(logger: IDiagnosticLogger, name: string): string;

// @public (undocumented)
export function utlGetSessionStorage(logger: IDiagnosticLogger, name: string): string;

// @public (undocumented)
export function utlGetSessionStorageKeys(): string[];

// @public (undocumented)
export function utlRemoveSessionStorage(logger: IDiagnosticLogger, name: string): boolean;

// @public (undocumented)
export function utlRemoveStorage(logger: IDiagnosticLogger, name: string): boolean;

// @public (undocumented)
export function utlSetLocalStorage(logger: IDiagnosticLogger, name: string, data: string): boolean;

// @public (undocumented)
export function utlSetSessionStorage(logger: IDiagnosticLogger, name: string, data: string): boolean;


// Warnings were encountered during analysis:
//
// types/ConnectionStringParser.d.ts:4:5 - (ae-forgotten-export) The symbol "ConnectionString" needs to be exported by the entry point applicationinsights-common.d.ts

// (No @packageDocumentation comment for this package)

```
