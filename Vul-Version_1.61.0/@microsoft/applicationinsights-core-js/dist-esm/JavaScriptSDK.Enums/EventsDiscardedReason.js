/*
 * Application Insights JavaScript SDK - Core, 2.6.4
 * Copyright (c) Microsoft and contributors. All rights reserved.
 */


/**
 * The EventsDiscardedReason enumeration contains a set of values that specify the reason for discarding an event.
 */
export var EventsDiscardedReason = {
    /**
     * Unknown.
     */
    Unknown: 0,
    /**
     * Status set to non-retryable.
     */
    NonRetryableStatus: 1,
    /**
     * The event is invalid.
     */
    InvalidEvent: 2,
    /**
     * The size of the event is too large.
     */
    SizeLimitExceeded: 3,
    /**
     * The server is not accepting events from this instrumentation key.
     */
    KillSwitch: 4,
    /**
     * The event queue is full.
     */
    QueueFull: 5
};//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/ee8c7def80afc00dd6e593ef12f37756d8f504ea/node_modules/@microsoft/applicationinsights-core-js/dist-esm/JavaScriptSDK.Enums/EventsDiscardedReason.js.map