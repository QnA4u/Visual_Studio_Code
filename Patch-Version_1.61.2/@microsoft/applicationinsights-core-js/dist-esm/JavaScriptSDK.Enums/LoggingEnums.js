/*
 * Application Insights JavaScript SDK - Core, 2.6.4
 * Copyright (c) Microsoft and contributors. All rights reserved.
 */


export var LoggingSeverity;
(function (LoggingSeverity) {
    /**
     * Error will be sent as internal telemetry
     */
    LoggingSeverity[LoggingSeverity["CRITICAL"] = 1] = "CRITICAL";
    /**
     * Error will NOT be sent as internal telemetry, and will only be shown in browser console
     */
    LoggingSeverity[LoggingSeverity["WARNING"] = 2] = "WARNING";
})(LoggingSeverity || (LoggingSeverity = {}));
/**
 * Internal message ID. Please create a new one for every conceptually different message. Please keep alphabetically ordered
 */
export var _InternalMessageId = {
    // Non user actionable
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
    // User actionable
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
};//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/fe719cd3e5825bf14e14182fddeb88ee8daf044f/node_modules/@microsoft/applicationinsights-core-js/dist-esm/JavaScriptSDK.Enums/LoggingEnums.js.map