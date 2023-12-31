/*
 * Application Insights JavaScript SDK - Web Analytics, 2.6.4
 * Copyright (c) Microsoft and contributors. All rights reserved.
 */


import { utlCanUseSessionStorage, utlGetSessionStorage, utlRemoveSessionStorage, utlSetSessionStorage } from '@microsoft/applicationinsights-common';
import { hasJSON, getJSON, dateNow, dumpObj, throwError } from '@microsoft/applicationinsights-core-js';
/**
 * Used to track page visit durations
 */
var PageVisitTimeManager = /** @class */ (function () {
    /**
     * Creates a new instance of PageVisitTimeManager
     * @param pageVisitTimeTrackingHandler Delegate that will be called to send telemetry data to AI (when trackPreviousPageVisit is called)
     * @returns {}
     */
    function PageVisitTimeManager(logger, pageVisitTimeTrackingHandler) {
        this.prevPageVisitDataKeyName = "prevPageVisitData";
        this.pageVisitTimeTrackingHandler = pageVisitTimeTrackingHandler;
        this._logger = logger;
    }
    /**
     * Tracks the previous page visit time telemetry (if exists) and starts timing of new page visit time
     * @param currentPageName Name of page to begin timing for visit duration
     * @param currentPageUrl Url of page to begin timing for visit duration
     */
    PageVisitTimeManager.prototype.trackPreviousPageVisit = function (currentPageName, currentPageUrl) {
        try {
            // Restart timer for new page view
            var prevPageVisitTimeData = this.restartPageVisitTimer(currentPageName, currentPageUrl);
            // If there was a page already being timed, track the visit time for it now.
            if (prevPageVisitTimeData) {
                this.pageVisitTimeTrackingHandler(prevPageVisitTimeData.pageName, prevPageVisitTimeData.pageUrl, prevPageVisitTimeData.pageVisitTime);
            }
        }
        catch (e) {
            this._logger.warnToConsole("Auto track page visit time failed, metric will not be collected: " + dumpObj(e));
        }
    };
    /**
     * Stops timing of current page (if exists) and starts timing for duration of visit to pageName
     * @param pageName Name of page to begin timing visit duration
     * @returns {PageVisitData} Page visit data (including duration) of pageName from last call to start or restart, if exists. Null if not.
     */
    PageVisitTimeManager.prototype.restartPageVisitTimer = function (pageName, pageUrl) {
        try {
            var prevPageVisitData = this.stopPageVisitTimer();
            this.startPageVisitTimer(pageName, pageUrl);
            return prevPageVisitData;
        }
        catch (e) {
            this._logger.warnToConsole("Call to restart failed: " + dumpObj(e));
            return null;
        }
    };
    /**
     * Starts timing visit duration of pageName
     * @param pageName
     * @returns {}
     */
    PageVisitTimeManager.prototype.startPageVisitTimer = function (pageName, pageUrl) {
        try {
            if (utlCanUseSessionStorage()) {
                if (utlGetSessionStorage(this._logger, this.prevPageVisitDataKeyName) != null) {
                    throwError("Cannot call startPageVisit consecutively without first calling stopPageVisit");
                }
                var currPageVisitData = new PageVisitData(pageName, pageUrl);
                var currPageVisitDataStr = getJSON().stringify(currPageVisitData);
                utlSetSessionStorage(this._logger, this.prevPageVisitDataKeyName, currPageVisitDataStr);
            }
        }
        catch (e) {
            // TODO: Remove this catch in next phase, since if start is called twice in a row the exception needs to be propagated out
            this._logger.warnToConsole("Call to start failed: " + dumpObj(e));
        }
    };
    /**
     * Stops timing of current page, if exists.
     * @returns {PageVisitData} Page visit data (including duration) of pageName from call to start, if exists. Null if not.
     */
    PageVisitTimeManager.prototype.stopPageVisitTimer = function () {
        try {
            if (utlCanUseSessionStorage()) {
                // Define end time of page's visit
                var pageVisitEndTime = dateNow();
                // Try to retrieve  page name and start time from session storage
                var pageVisitDataJsonStr = utlGetSessionStorage(this._logger, this.prevPageVisitDataKeyName);
                if (pageVisitDataJsonStr && hasJSON()) {
                    // if previous page data exists, set end time of visit
                    var prevPageVisitData = getJSON().parse(pageVisitDataJsonStr);
                    prevPageVisitData.pageVisitTime = pageVisitEndTime - prevPageVisitData.pageVisitStartTime;
                    // Remove data from storage since we already used it
                    utlRemoveSessionStorage(this._logger, this.prevPageVisitDataKeyName);
                    // Return page visit data
                    return prevPageVisitData;
                }
                else {
                    return null;
                }
            }
            return null;
        }
        catch (e) {
            this._logger.warnToConsole("Stop page visit timer failed: " + dumpObj(e));
            return null;
        }
    };
    return PageVisitTimeManager;
}());
export { PageVisitTimeManager };
var PageVisitData = /** @class */ (function () {
    function PageVisitData(pageName, pageUrl) {
        this.pageVisitStartTime = dateNow();
        this.pageName = pageName;
        this.pageUrl = pageUrl;
    }
    return PageVisitData;
}());
export { PageVisitData };//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/ee8c7def80afc00dd6e593ef12f37756d8f504ea/node_modules/@microsoft/applicationinsights-analytics-js/dist-esm/JavaScriptSDK/Telemetry/PageVisitTimeManager.js.map