/*
 * Application Insights JavaScript SDK - Web, 2.6.4
 * Copyright (c) Microsoft and contributors. All rights reserved.
 */
export { Initialization as ApplicationInsights, Telemetry } from "./Initialization";
export { ApplicationInsightsContainer } from "./ApplicationInsightsContainer";
// Re-exports
export { AppInsightsCore, LoggingSeverity, _InternalMessageId, PerfEvent, PerfManager, doPerf, NotificationManager, BaseTelemetryPlugin, BaseCore, CoreUtils } from "@microsoft/applicationinsights-core-js";
export { Util, SeverityLevel, Event, Exception, Metric, PageView, PageViewPerformance, RemoteDependencyData, Trace, DistributedTracingModes } from "@microsoft/applicationinsights-common";
export { Sender } from "@microsoft/applicationinsights-channel-js";
export { ApplicationInsights as ApplicationAnalytics } from "@microsoft/applicationinsights-analytics-js";
export { PropertiesPlugin } from "@microsoft/applicationinsights-properties-js";
export { AjaxPlugin as DependenciesPlugin } from "@microsoft/applicationinsights-dependencies-js";//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/ee8c7def80afc00dd6e593ef12f37756d8f504ea/node_modules/@microsoft/applicationinsights-web/dist-esm/applicationinsights-web.js.map