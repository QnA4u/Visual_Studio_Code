/*
 * Application Insights JavaScript SDK - Dependencies Plugin, 2.6.4
 * Copyright (c) Microsoft and contributors. All rights reserved.
 */


import { dataSanitizeUrl, dateTimeUtilsDuration, urlGetAbsoluteUrl, urlGetCompleteUrl, msToTimeSpan } from '@microsoft/applicationinsights-common';
import { objKeys, arrForEach, isNumber, isString, normalizeJsName, objForEachKey } from '@microsoft/applicationinsights-core-js';
import dynamicProto from "@microsoft/dynamicproto-js";
var strProperties = "properties";
/** @ignore */
function _calcPerfDuration(resourceEntry, start, end) {
    var result = 0;
    var from = resourceEntry[start];
    var to = resourceEntry[end];
    if (from && to) {
        result = dateTimeUtilsDuration(from, to);
    }
    return result;
}
/** @ignore */
function _setPerfDuration(props, name, resourceEntry, start, end) {
    var result = 0;
    var value = _calcPerfDuration(resourceEntry, start, end);
    if (value) {
        result = _setPerfValue(props, name, msToTimeSpan(value));
    }
    return result;
}
/** @ignore */
function _setPerfValue(props, name, value) {
    var strPerf = "ajaxPerf";
    var result = 0;
    if (props && name && value) {
        var perfData = props[strPerf] = (props[strPerf] || {});
        perfData[name] = value;
        result = 1;
    }
    return result;
}
/** @ignore */
function _populatePerfData(ajaxData, dependency) {
    /*
    * https://developer.mozilla.org/en-US/docs/Web/API/Resource_Timing_API/Using_the_Resource_Timing_API
    *  | -startTime
    *  | -redirectStart
    *  |            | -redirectEnd
    *  |            | | -fetchStart
    *  |            | |   | -domainLookupStart
    *  |            | |   |                |- domainLookupEnd
    *  |            | |   |                | | -connectStart
    *  |            | |   |                | |  | -secureConnectionStart
    *  |            | |   |                | |  |        | -connectEnd
    *  |            | |   |                | |  |        | | -requestStart
    *  |            | |   |                | |  |        | |           | | -responseStart
    *  |            | |   |                | |  |        | |           | |            | | -responseEnd
    *  +------------+-+---+----------------+-+--+--------+-+-----------+-+------------+-+
    *  |--redirect--| |---|--domainLookup--| |--connect--| |--request--| |--response--| |
    *  |-------------------networkConnect----------------|
    *  |                                                   |---------sentRequest--------|
    *  |------------------------------------perfTotal-----------------------------------|
    */
    var resourceEntry = ajaxData.perfTiming;
    var props = dependency[strProperties] || {};
    var propsSet = 0;
    var strName = "name";
    var strStart = "Start";
    var strEnd = "End";
    var strDomainLookup = "domainLookup";
    var strConnect = "connect";
    var strRedirect = "redirect";
    var strRequest = "request";
    var strResponse = "response";
    var strDuration = "duration";
    var strStartTime = "startTime";
    var strDomainLookupStart = strDomainLookup + strStart;
    var strDomainLookupEnd = strDomainLookup + strEnd;
    var strConnectStart = strConnect + strStart;
    var strConnectEnd = strConnect + strEnd;
    var strRequestStart = strRequest + strStart;
    var strRequestEnd = strRequest + strEnd;
    var strResponseStart = strResponse + strStart;
    var strResponseEnd = strResponse + strEnd;
    var strRedirectStart = strRedirect + strStart;
    var strRedirectEnd = strRedirect = strEnd;
    var strTransferSize = "transferSize";
    var strEncodedBodySize = "encodedBodySize";
    var strDecodedBodySize = "decodedBodySize";
    var strServerTiming = "serverTiming";
    if (resourceEntry) {
        // redirect
        propsSet |= _setPerfDuration(props, strRedirect, resourceEntry, strRedirectStart, strRedirectEnd);
        // domainLookup
        propsSet |= _setPerfDuration(props, strDomainLookup, resourceEntry, strDomainLookupStart, strDomainLookupEnd);
        // connect
        propsSet |= _setPerfDuration(props, strConnect, resourceEntry, strConnectStart, strConnectEnd);
        // request
        propsSet |= _setPerfDuration(props, strRequest, resourceEntry, strRequestStart, strRequestEnd);
        // response
        propsSet |= _setPerfDuration(props, strResponse, resourceEntry, strResponseStart, strResponseEnd);
        // Network connection time
        propsSet |= _setPerfDuration(props, "networkConnect", resourceEntry, strStartTime, strConnectEnd);
        // Sent Request
        propsSet |= _setPerfDuration(props, "sentRequest", resourceEntry, strRequestStart, strResponseEnd);
        // PerfTotal / Duration
        var duration = resourceEntry[strDuration];
        if (!duration) {
            duration = _calcPerfDuration(resourceEntry, strStartTime, strResponseEnd) || 0;
        }
        propsSet |= _setPerfValue(props, strDuration, duration);
        propsSet |= _setPerfValue(props, "perfTotal", duration);
        var serverTiming = resourceEntry[strServerTiming];
        if (serverTiming) {
            var server_1 = {};
            arrForEach(serverTiming, function (value, idx) {
                var name = normalizeJsName(value[strName] || "" + idx);
                var newValue = server_1[name] || {};
                objForEachKey(value, function (key, val) {
                    if (key !== strName && isString(val) || isNumber(val)) {
                        if (newValue[key]) {
                            val = newValue[key] + ";" + val;
                        }
                        if (val || !isString(val)) {
                            // Only set the value if it has a value and it's not an empty string
                            newValue[key] = val;
                        }
                    }
                });
                server_1[name] = newValue;
            });
            propsSet |= _setPerfValue(props, strServerTiming, server_1);
        }
        propsSet |= _setPerfValue(props, strTransferSize, resourceEntry[strTransferSize]);
        propsSet |= _setPerfValue(props, strEncodedBodySize, resourceEntry[strEncodedBodySize]);
        propsSet |= _setPerfValue(props, strDecodedBodySize, resourceEntry[strDecodedBodySize]);
    }
    else {
        if (ajaxData.perfMark) {
            propsSet |= _setPerfValue(props, "missing", ajaxData.perfAttempts);
        }
    }
    if (propsSet) {
        dependency[strProperties] = props;
    }
}
var XHRMonitoringState = /** @class */ (function () {
    function XHRMonitoringState() {
        var self = this;
        self.openDone = false;
        self.setRequestHeaderDone = false;
        self.sendDone = false;
        self.abortDone = false;
        // <summary>True, if onreadyStateChangeCallback function attached to xhr, otherwise false</summary>
        self.stateChangeAttached = false;
    }
    return XHRMonitoringState;
}());
export { XHRMonitoringState };
var ajaxRecord = /** @class */ (function () {
    function ajaxRecord(traceID, spanID, logger) {
        var self = this;
        var _logger = logger;
        var strResponseText = "responseText";
        // Assigning the initial/default values within the constructor to avoid typescript from creating a bunch of
        // this.XXXX = null
        self.perfMark = null;
        self.completed = false;
        self.requestHeadersSize = null;
        self.requestHeaders = null;
        self.responseReceivingDuration = null;
        self.callbackDuration = null;
        self.ajaxTotalDuration = null;
        self.aborted = 0;
        self.pageUrl = null;
        self.requestUrl = null;
        self.requestSize = 0;
        self.method = null;
        self.status = null;
        self.requestSentTime = null;
        self.responseStartedTime = null;
        self.responseFinishedTime = null;
        self.callbackFinishedTime = null;
        self.endTime = null;
        self.xhrMonitoringState = new XHRMonitoringState();
        self.clientFailure = 0;
        self.traceID = traceID;
        self.spanID = spanID;
        dynamicProto(ajaxRecord, self, function (self) {
            self.getAbsoluteUrl = function () {
                return self.requestUrl ? urlGetAbsoluteUrl(self.requestUrl) : null;
            };
            self.getPathName = function () {
                return self.requestUrl ? dataSanitizeUrl(_logger, urlGetCompleteUrl(self.method, self.requestUrl)) : null;
            };
            self.CreateTrackItem = function (ajaxType, enableRequestHeaderTracking, getResponse) {
                // round to 3 decimal points
                self.ajaxTotalDuration = Math.round(dateTimeUtilsDuration(self.requestSentTime, self.responseFinishedTime) * 1000) / 1000;
                if (self.ajaxTotalDuration < 0) {
                    return null;
                }
                var dependency = (_a = {
                        id: "|" + self.traceID + "." + self.spanID,
                        target: self.getAbsoluteUrl(),
                        name: self.getPathName(),
                        type: ajaxType,
                        startTime: null,
                        duration: self.ajaxTotalDuration,
                        success: (+(self.status)) >= 200 && (+(self.status)) < 400,
                        responseCode: (+(self.status)),
                        method: self.method
                    },
                    _a[strProperties] = { HttpMethod: self.method },
                    _a);
                if (self.requestSentTime) {
                    // Set the correct dependency start time
                    dependency.startTime = new Date();
                    dependency.startTime.setTime(self.requestSentTime);
                }
                // Add Ajax perf details if available
                _populatePerfData(self, dependency);
                if (enableRequestHeaderTracking) {
                    if (objKeys(self.requestHeaders).length > 0) {
                        dependency[strProperties] = dependency[strProperties] || {};
                        dependency[strProperties].requestHeaders = self.requestHeaders;
                    }
                }
                if (getResponse) {
                    var response = getResponse();
                    if (response) {
                        // enrich dependency target with correlation context from the server
                        var correlationContext = response.correlationContext;
                        if (correlationContext) {
                            dependency.correlationContext = /* dependency.target + " | " + */ correlationContext;
                        }
                        if (response.headerMap) {
                            if (objKeys(response.headerMap).length > 0) {
                                dependency[strProperties] = dependency[strProperties] || {};
                                dependency[strProperties].responseHeaders = response.headerMap;
                            }
                        }
                        if (self.status >= 400) {
                            var responseType = response.type;
                            dependency[strProperties] = dependency[strProperties] || {};
                            if (responseType === "" || responseType === "text") {
                                dependency[strProperties][strResponseText] = response[strResponseText] ? response.statusText + " - " + response[strResponseText] : response.statusText;
                            }
                            if (responseType === "json") {
                                dependency[strProperties][strResponseText] = response.response ? response.statusText + " - " + JSON.stringify(response.response) : response.statusText;
                            }
                        }
                    }
                }
                return dependency;
                var _a;
            };
        });
    }
// Removed Stub for ajaxRecord.prototype.getAbsoluteUrl.
// Removed Stub for ajaxRecord.prototype.getPathName.
// Removed Stub for ajaxRecord.prototype.CreateTrackItem.
    return ajaxRecord;
}());
export { ajaxRecord };
;//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/fe719cd3e5825bf14e14182fddeb88ee8daf044f/node_modules/@microsoft/applicationinsights-dependencies-js/dist-esm/ajaxRecord.js.map