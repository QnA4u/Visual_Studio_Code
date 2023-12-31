/*
 * Application Insights JavaScript SDK - Common, 2.6.4
 * Copyright (c) Microsoft and contributors. All rights reserved.
 */


export { Util, CorrelationIdHelper, DateTimeUtils, dateTimeUtilsNow, dateTimeUtilsDuration, UrlHelper, isInternalApplicationInsightsEndpoint } from './Util';
export { parseConnectionString, ConnectionStringParser } from './ConnectionStringParser';
export { RequestHeaders } from './RequestResponseHeaders';
export { DisabledPropertyName, ProcessLegacy, SampleRate, HttpMethod, DEFAULT_BREEZE_ENDPOINT, strNotSpecified } from './Constants';
export { Data as AIData } from './Interfaces/Contracts/Generated/Data';
export { Base as AIBase } from './Interfaces/Contracts/Generated/Base';
export { Envelope } from './Telemetry/Common/Envelope';
export { Event } from './Telemetry/Event';
export { Exception } from './Telemetry/Exception';
export { Metric } from './Telemetry/Metric';
export { PageView } from './Telemetry/PageView';
export { PageViewData } from './Interfaces/Contracts/Generated/PageViewData';
export { RemoteDependencyData } from './Telemetry/RemoteDependencyData';
export { Trace } from './Telemetry/Trace';
export { PageViewPerformance } from './Telemetry/PageViewPerformance';
export { Data } from './Telemetry/Common/Data';
export { SeverityLevel } from './Interfaces/Contracts/Generated/SeverityLevel';
export { ConfigurationManager } from './Interfaces/IConfig';
export { ContextTagKeys } from './Interfaces/Contracts/Generated/ContextTagKeys';
export { DataSanitizer, dataSanitizeKeyAndAddUniqueness, dataSanitizeKey, dataSanitizeString, dataSanitizeUrl, dataSanitizeMessage, dataSanitizeException, dataSanitizeProperties, dataSanitizeMeasurements, dataSanitizeId, dataSanitizeInput, dsPadNumber } from './Telemetry/Common/DataSanitizer';
export { TelemetryItemCreator } from './TelemetryItemCreator';
export { CtxTagKeys, Extensions } from './Interfaces/PartAExtensions';
export { DistributedTracingModes } from './Enums';
export { stringToBoolOrDefault, msToTimeSpan, isBeaconApiSupported, getExtensionByName, isCrossOriginError } from './HelperFuncs';
export { createDomEvent } from './DomHelperFuncs';
export { utlDisableStorage, utlCanUseLocalStorage, utlGetLocalStorage, utlSetLocalStorage, utlRemoveStorage, utlCanUseSessionStorage, utlGetSessionStorageKeys, utlGetSessionStorage, utlSetSessionStorage, utlRemoveSessionStorage } from './StorageHelperFuncs';
export { urlParseUrl, urlGetAbsoluteUrl, urlGetPathName, urlGetCompleteUrl, urlParseHost, urlParseFullHost } from './UrlHelperFuncs';
export var PropertiesPluginIdentifier = "AppInsightsPropertiesPlugin";
export var BreezeChannelIdentifier = "AppInsightsChannelPlugin";
export var AnalyticsPluginIdentifier = "ApplicationInsightsAnalytics";//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/fe719cd3e5825bf14e14182fddeb88ee8daf044f/node_modules/@microsoft/applicationinsights-common/dist-esm/applicationinsights-common.js.map