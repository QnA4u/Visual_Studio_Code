## API Report File for "@microsoft/applicationinsights-dependencies-js"

> Do not edit this file. It is a report generated by [API Extractor](https://api-extractor.com/).

```ts

import { BaseTelemetryPlugin } from '@microsoft/applicationinsights-core-js';
import { IAppInsightsCore } from '@microsoft/applicationinsights-core-js';
import { IConfig } from '@microsoft/applicationinsights-common';
import { IConfiguration } from '@microsoft/applicationinsights-core-js';
import { ICorrelationConfig } from '@microsoft/applicationinsights-common';
import { IDependencyTelemetry } from '@microsoft/applicationinsights-common';
import { IDiagnosticLogger } from '@microsoft/applicationinsights-core-js';
import { IPlugin } from '@microsoft/applicationinsights-core-js';
import { IProcessTelemetryContext } from '@microsoft/applicationinsights-core-js';
import { ITelemetryItem } from '@microsoft/applicationinsights-core-js';
import { ITelemetryPluginChain } from '@microsoft/applicationinsights-core-js';

// @public (undocumented)
export class AjaxPlugin extends BaseTelemetryPlugin implements IDependenciesPlugin, IInstrumentationRequirements {
    constructor();
    // (undocumented)
    static getDefaultConfig(): ICorrelationConfig;
    // (undocumented)
    static getEmptyConfig(): ICorrelationConfig;
    // (undocumented)
    static identifier: string;
    // (undocumented)
    identifier: string;
    // (undocumented)
    includeCorrelationHeaders(ajaxData: ajaxRecord, input?: Request | string, init?: RequestInit, xhr?: XMLHttpRequestInstrumented): any;
    // (undocumented)
    initialize(config: IConfiguration & IConfig, core: IAppInsightsCore, extensions: IPlugin[], pluginChain?: ITelemetryPluginChain): void;
    // (undocumented)
    priority: number;
    // (undocumented)
    processTelemetry(item: ITelemetryItem, itemCtx?: IProcessTelemetryContext): void;
    // (undocumented)
    teardown(): void;
    trackDependencyData(dependency: IDependencyTelemetry, properties?: {
        [key: string]: any;
    }): void;
    protected trackDependencyDataInternal(dependency: IDependencyTelemetry, properties?: {
        [key: string]: any;
    }, systemProperties?: {
        [key: string]: any;
    }): void;
}

// @public (undocumented)
export class ajaxRecord {
    constructor(traceID: string, spanID: string, logger: IDiagnosticLogger);
    // (undocumented)
    aborted: number;
    // (undocumented)
    ajaxTotalDuration: number;
    // (undocumented)
    async?: boolean;
    // (undocumented)
    callbackDuration: number;
    // (undocumented)
    callbackFinishedTime: number;
    // (undocumented)
    clientFailure: number;
    // (undocumented)
    completed: boolean;
    // Warning: (ae-forgotten-export) The symbol "IAjaxRecordResponse" needs to be exported by the entry point applicationinsights-dependencies-js.d.ts
    //
    // (undocumented)
    CreateTrackItem(ajaxType: string, enableRequestHeaderTracking: boolean, getResponse: () => IAjaxRecordResponse): IDependencyTelemetry;
    // (undocumented)
    endTime: number;
    // (undocumented)
    getAbsoluteUrl(): string;
    // (undocumented)
    getPathName(): string;
    // (undocumented)
    method: string;
    // (undocumented)
    pageUrl: string;
    // (undocumented)
    perfAttempts?: number;
    // (undocumented)
    perfMark: PerformanceMark;
    // (undocumented)
    perfTiming: PerformanceResourceTiming;
    // (undocumented)
    requestHeaders: any;
    // (undocumented)
    requestHeadersSize: number;
    // (undocumented)
    requestSentTime: number;
    // (undocumented)
    requestSize: number;
    // (undocumented)
    requestUrl: string;
    // (undocumented)
    responseFinishedTime: number;
    // (undocumented)
    responseReceivingDuration: number;
    // (undocumented)
    responseStartedTime: number;
    // (undocumented)
    spanID: string;
    // (undocumented)
    status: string | number;
    // (undocumented)
    traceID: string;
    // Warning: (ae-forgotten-export) The symbol "XHRMonitoringState" needs to be exported by the entry point applicationinsights-dependencies-js.d.ts
    //
    // (undocumented)
    xhrMonitoringState: XHRMonitoringState;
}

// @public (undocumented)
export interface IDependenciesPlugin {
    trackDependencyData(dependency: IDependencyTelemetry): void;
}

// @public (undocumented)
export interface IInstrumentationRequirements extends IDependenciesPlugin {
    // (undocumented)
    includeCorrelationHeaders: (ajaxData: ajaxRecord, input?: Request | string, init?: RequestInit, xhr?: XMLHttpRequestInstrumented) => any;
}

// @public (undocumented)
export interface XMLHttpRequestInstrumented extends XMLHttpRequest {
    // (undocumented)
    ajaxData: ajaxRecord;
}


// (No @packageDocumentation comment for this package)

```
