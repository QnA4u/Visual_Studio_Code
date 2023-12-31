/*
 * Application Insights JavaScript SDK - Web Analytics, 2.6.4
 * Copyright (c) Microsoft and contributors. All rights reserved.
 */


import { dateTimeUtilsDuration, msToTimeSpan } from '@microsoft/applicationinsights-common';
import { LoggingSeverity, _InternalMessageId, getNavigator, getPerformance } from '@microsoft/applicationinsights-core-js';
/**
 * Class encapsulates sending page view performance telemetry.
 */
var PageViewPerformanceManager = /** @class */ (function () {
    function PageViewPerformanceManager(core) {
        this.MAX_DURATION_ALLOWED = 3600000; // 1h
        if (core) {
            this._logger = core.logger;
        }
    }
    PageViewPerformanceManager.prototype.populatePageViewPerformanceEvent = function (pageViewPerformance) {
        pageViewPerformance.isValid = false;
        /*
         * http://www.w3.org/TR/navigation-timing/#processing-model
         *  |-navigationStart
         *  |             |-connectEnd
         *  |             ||-requestStart
         *  |             ||             |-responseStart
         *  |             ||             |              |-responseEnd
         *  |             ||             |              |
         *  |             ||             |              |         |-loadEventEnd
         *  |---network---||---request---|---response---|---dom---|
         *  |--------------------------total----------------------|
         *
         *  total = The difference between the load event of the current document is completed and the first recorded timestamp of the performance entry : https://developer.mozilla.org/en-US/docs/Web/Performance/Navigation_and_resource_timings#duration
         *  network = Redirect time + App Cache + DNS lookup time + TCP connection time
         *  request = Request time : https://developer.mozilla.org/en-US/docs/Web/Performance/Navigation_and_resource_timings#request_time
         *  response = Response time
         *  dom = Document load time : https://html.spec.whatwg.org/multipage/dom.html#document-load-timing-info
         *      = Document processing time : https://developers.google.com/web/fundamentals/performance/navigation-and-resource-timing/#document_processing
         *      + Loading time : https://developers.google.com/web/fundamentals/performance/navigation-and-resource-timing/#loading
         */
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
                /**
                 * support both cases:
                 * - startTime is always zero: https://developer.mozilla.org/en-US/docs/Web/API/PerformanceNavigationTiming
                 * - for older browsers where the startTime is not zero
                 */
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
                // some browsers may report individual components incorrectly so that the sum of the parts will be bigger than total PLT
                // in this case, don't report client performance from this page
                this._logger.throwInternal(LoggingSeverity.WARNING, _InternalMessageId.ClientPerformanceMathError, "client performance math error.", { total: total, network: network, request: request, response: response, dom: dom });
            }
            else {
                pageViewPerformance.durationMs = total;
                // // convert to timespans
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
    /**
     * Returns true is window PerformanceNavigationTiming API is supported, false otherwise.
     */
    PageViewPerformanceManager.prototype.isPerformanceNavigationTimingSupported = function () {
        var perf = getPerformance();
        return perf && perf.getEntriesByType && perf.getEntriesByType("navigation").length > 0;
    };
    /**
     * Returns true is window performance timing API is supported, false otherwise.
     */
    PageViewPerformanceManager.prototype.isPerformanceTimingSupported = function () {
        var perf = getPerformance();
        return perf && perf.timing;
    };
    /**
     * As page loads different parts of performance timing numbers get set. When all of them are set we can report it.
     * Returns true if ready, false otherwise.
     */
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
    /**
     * This method tells if given durations should be excluded from collection.
     */
    PageViewPerformanceManager.prototype.shouldCollectDuration = function () {
        var durations = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            durations[_i] = arguments[_i];
        }
        var _navigator = getNavigator() || {};
        // a full list of Google crawlers user agent strings - https://support.google.com/webmasters/answer/1061943?hl=en
        var botAgentNames = ['googlebot', 'adsbot-google', 'apis-google', 'mediapartners-google'];
        var userAgent = _navigator.userAgent;
        var isGoogleBot = false;
        if (userAgent) {
            for (var i = 0; i < botAgentNames.length; i++) {
                isGoogleBot = isGoogleBot || userAgent.toLowerCase().indexOf(botAgentNames[i]) !== -1;
            }
        }
        if (isGoogleBot) {
            // Don't report durations for GoogleBot, it is returning invalid values in performance.timing API.
            return false;
        }
        else {
            // for other page views, don't report if it's outside of a reasonable range
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
export { PageViewPerformanceManager };//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/fe719cd3e5825bf14e14182fddeb88ee8daf044f/node_modules/@microsoft/applicationinsights-analytics-js/dist-esm/JavaScriptSDK/Telemetry/PageViewPerformanceManager.js.map