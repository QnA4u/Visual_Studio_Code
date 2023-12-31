/*
 * Application Insights JavaScript SDK - Common, 2.6.4
 * Copyright (c) Microsoft and contributors. All rights reserved.
 */


/**
 * This is an internal property used to cause internal (reporting) requests to be ignored from reporting
 * additional telemetry, to handle polyfil implementations ALL urls used with a disabled request will
 * also be ignored for future requests even when this property is not provided.
 * Tagging as Ignore as this is an internal value and is not expected to be used outside of the SDK
 * @ignore
 */
export var DisabledPropertyName = "Microsoft_ApplicationInsights_BypassAjaxInstrumentation";
export var SampleRate = "sampleRate";
export var ProcessLegacy = "ProcessLegacy";
export var HttpMethod = "http.method";
export var DEFAULT_BREEZE_ENDPOINT = "https://dc.services.visualstudio.com";
export var strNotSpecified = "not_specified";//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/ee8c7def80afc00dd6e593ef12f37756d8f504ea/node_modules/@microsoft/applicationinsights-common/dist-esm/Constants.js.map