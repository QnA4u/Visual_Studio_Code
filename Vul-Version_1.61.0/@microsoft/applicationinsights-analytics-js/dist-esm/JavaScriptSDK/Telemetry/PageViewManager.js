/*
 * Application Insights JavaScript SDK - Web Analytics, 2.6.4
 * Copyright (c) Microsoft and contributors. All rights reserved.
 */


import { dateTimeUtilsDuration } from '@microsoft/applicationinsights-common';
import { LoggingSeverity, _InternalMessageId, getDocument, getLocation, arrForEach, isNullOrUndefined, getExceptionName, dumpObj } from '@microsoft/applicationinsights-core-js';
import dynamicProto from "@microsoft/dynamicproto-js";
/**
 * Class encapsulates sending page views and page view performance telemetry.
 */
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
                                // Not processed so rescheduled
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
                            // We process at least one item so flush the queue
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
                // case 1a. if performance timing is not supported by the browser, send the page view telemetry with the duration provided by the user. If the user
                // do not provide the duration, set duration to undefined
                // Also this is case 4
                if (!pageViewPerformanceManager.isPerformanceTimingSupported()) {
                    appInsights.sendPageViewInternal(pageView, customProperties);
                    _flushChannels();
                    // no navigation timing (IE 8, iOS Safari 8.4, Opera Mini 8 - see http://caniuse.com/#feat=nav-timing)
                    _logger.throwInternal(LoggingSeverity.WARNING, _InternalMessageId.NavigationTimingNotSupported, "trackPageView: navigation timing API used for calculation of page duration is not supported in this browser. This page view will be collected without duration and timing info.");
                    return;
                }
                var pageViewSent = false;
                var customDuration;
                // if the performance timing is supported by the browser, calculate the custom duration
                var start = pageViewPerformanceManager.getPerformanceTiming().navigationStart;
                if (start > 0) {
                    customDuration = dateTimeUtilsDuration(start, +new Date);
                    if (!pageViewPerformanceManager.shouldCollectDuration(customDuration)) {
                        customDuration = undefined;
                    }
                }
                // if the user has provided duration, send a page view telemetry with the provided duration. Otherwise, if
                // overridePageViewDuration is set to true, send a page view telemetry with the custom duration calculated earlier
                var duration;
                if (!isNullOrUndefined(customProperties) &&
                    !isNullOrUndefined(customProperties.duration)) {
                    duration = customProperties.duration;
                }
                if (overridePageViewDuration || !isNaN(duration)) {
                    if (isNaN(duration)) {
                        // case 3
                        if (!customProperties) {
                            customProperties = {};
                        }
                        customProperties["duration"] = customDuration;
                    }
                    // case 2
                    appInsights.sendPageViewInternal(pageView, customProperties);
                    _flushChannels();
                    pageViewSent = true;
                }
                // now try to send the page view performance telemetry
                var maxDurationLimit = 60000;
                if (!customProperties) {
                    customProperties = {};
                }
                // Queue the event for processing
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
                                // If navigation timing gives invalid numbers, then go back to "override page view duration" mode.
                                // That's the best value we can get that makes sense.
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
                            // if performance timings are not ready but we exceeded the maximum duration limit, just log a page view telemetry
                            // with the maximum duration limit. Otherwise, keep waiting until performance timings are ready
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
// Removed Stub for PageViewManager.prototype.trackPageView.
    return PageViewManager;
}());
export { PageViewManager };//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/ee8c7def80afc00dd6e593ef12f37756d8f504ea/node_modules/@microsoft/applicationinsights-analytics-js/dist-esm/JavaScriptSDK/Telemetry/PageViewManager.js.map