/*
 * Application Insights JavaScript SDK - Channel, 2.6.4
 * Copyright (c) Microsoft and contributors. All rights reserved.
 */
import { __extendsFn, __assignFn } from "@microsoft/applicationinsights-shims";
import { SessionStorageSendBuffer, ArraySendBuffer } from './SendBuffer';
import { DependencyEnvelopeCreator, EventEnvelopeCreator, ExceptionEnvelopeCreator, MetricEnvelopeCreator, PageViewEnvelopeCreator, PageViewPerformanceEnvelopeCreator, TraceEnvelopeCreator } from './EnvelopeCreator';
import { Serializer } from './Serializer'; // todo move to channel
import { DisabledPropertyName, RequestHeaders, PageView, Event, Trace, Exception, Metric, PageViewPerformance, RemoteDependencyData, ProcessLegacy, BreezeChannelIdentifier, SampleRate, isInternalApplicationInsightsEndpoint, utlCanUseSessionStorage, isBeaconApiSupported } from '@microsoft/applicationinsights-common';
import { _InternalMessageId, LoggingSeverity, getWindow, getNavigator, getJSON, BaseTelemetryPlugin, getGlobalInst, objForEachKey, isNullOrUndefined, arrForEach, dateNow, dumpObj, getExceptionName, getIEVersion, throwError, objKeys, strUndefined } from '@microsoft/applicationinsights-core-js';
import { Offline } from './Offline';
import { Sample } from './TelemetryProcessors/Sample';
import dynamicProto from '@microsoft/dynamicproto-js';
function _getResponseText(xhr) {
    try {
        return xhr.responseText;
    }
    catch (e) {
        // Best effort, as XHR may throw while XDR wont so just ignore
    }
    return null;
}
var Sender = /** @class */ (function (_super) {
    __extendsFn(Sender, _super);
    function Sender() {
        var _this = _super.call(this) || this;
        _this.priority = 1001;
        _this.identifier = BreezeChannelIdentifier;
        /**
         * Whether XMLHttpRequest object is supported. Older version of IE (8,9) do not support it.
         */
        _this._XMLHttpRequestSupported = false;
        /**
         * How many times in a row a retryable error condition has occurred.
         */
        var _consecutiveErrors;
        /**
         * The time to retry at in milliseconds from 1970/01/01 (this makes the timer calculation easy).
         */
        var _retryAt;
        /**
         * The time of the last send operation.
         */
        var _lastSend;
        /**
         * Handle to the timer for delayed sending of batches of data.
         */
        var _timeoutHandle;
        var _serializer;
        var _stamp_specific_redirects;
        var _headers = {};
        dynamicProto(Sender, _this, function (_self, _base) {
            function _notImplemented() {
                throwError("Method not implemented.");
            }
            _self.pause = _notImplemented;
            _self.resume = _notImplemented;
            _self.flush = function () {
                try {
                    _self.triggerSend(true, null, 1 /* ManualFlush */);
                }
                catch (e) {
                    _self.diagLog().throwInternal(LoggingSeverity.CRITICAL, _InternalMessageId.FlushFailed, "flush failed, telemetry will not be collected: " + getExceptionName(e), { exception: dumpObj(e) });
                }
            };
            _self.onunloadFlush = function () {
                if ((_self._senderConfig.onunloadDisableBeacon() === false || _self._senderConfig.isBeaconApiDisabled() === false) && isBeaconApiSupported()) {
                    try {
                        _self.triggerSend(true, _beaconSender, 2 /* Unload */);
                    }
                    catch (e) {
                        _self.diagLog().throwInternal(LoggingSeverity.CRITICAL, _InternalMessageId.FailedToSendQueuedTelemetry, "failed to flush with beacon sender on page unload, telemetry will not be collected: " + getExceptionName(e), { exception: dumpObj(e) });
                    }
                }
                else {
                    _self.flush();
                }
            };
            _self.teardown = _notImplemented;
            _self.addHeader = function (name, value) {
                _headers[name] = value;
            };
            _self.initialize = function (config, core, extensions, pluginChain) {
                _base.initialize(config, core, extensions, pluginChain);
                var ctx = _self._getTelCtx();
                var identifier = _self.identifier;
                _serializer = new Serializer(core.logger);
                _consecutiveErrors = 0;
                _retryAt = null;
                _lastSend = 0;
                _self._sender = null;
                _stamp_specific_redirects = 0;
                var defaultConfig = Sender._getDefaultAppInsightsChannelConfig();
                _self._senderConfig = Sender._getEmptyAppInsightsChannelConfig();
                objForEachKey(defaultConfig, function (field, value) {
                    _self._senderConfig[field] = function () { return ctx.getConfig(identifier, field, value()); };
                });
                _self._buffer = (_self._senderConfig.enableSessionStorageBuffer() && utlCanUseSessionStorage())
                    ? new SessionStorageSendBuffer(_self.diagLog(), _self._senderConfig) : new ArraySendBuffer(_self._senderConfig);
                _self._sample = new Sample(_self._senderConfig.samplingPercentage(), _self.diagLog());
                if (!_validateInstrumentationKey(config)) {
                    _self.diagLog().throwInternal(LoggingSeverity.CRITICAL, _InternalMessageId.InvalidInstrumentationKey, "Invalid Instrumentation key " + config.instrumentationKey);
                }
                if (!isInternalApplicationInsightsEndpoint(_self._senderConfig.endpointUrl()) && _self._senderConfig.customHeaders() && _self._senderConfig.customHeaders().length > 0) {
                    arrForEach(_self._senderConfig.customHeaders(), function (customHeader) {
                        _this.addHeader(customHeader.header, customHeader.value);
                    });
                }
                if (!_self._senderConfig.isBeaconApiDisabled() && isBeaconApiSupported()) {
                    _self._sender = _beaconSender;
                }
                else {
                    var xhr = getGlobalInst("XMLHttpRequest");
                    if (xhr) {
                        var testXhr = new xhr();
                        if ("withCredentials" in testXhr) {
                            _self._sender = _xhrSender;
                            _self._XMLHttpRequestSupported = true;
                        }
                        else if (typeof XDomainRequest !== strUndefined) {
                            _self._sender = _xdrSender; // IE 8 and 9
                        }
                    }
                    else {
                        var fetch_1 = getGlobalInst("fetch");
                        if (fetch_1) {
                            _self._sender = _fetchSender;
                        }
                    }
                }
            };
            _self.processTelemetry = function (telemetryItem, itemCtx) {
                itemCtx = _self._getTelCtx(itemCtx);
                try {
                    // if master off switch is set, don't send any data
                    if (_self._senderConfig.disableTelemetry()) {
                        // Do not send/save data
                        return;
                    }
                    // validate input
                    if (!telemetryItem) {
                        itemCtx.diagLog().throwInternal(LoggingSeverity.CRITICAL, _InternalMessageId.CannotSendEmptyTelemetry, "Cannot send empty telemetry");
                        return;
                    }
                    // validate event
                    if (telemetryItem.baseData && !telemetryItem.baseType) {
                        itemCtx.diagLog().throwInternal(LoggingSeverity.CRITICAL, _InternalMessageId.InvalidEvent, "Cannot send telemetry without baseData and baseType");
                        return;
                    }
                    if (!telemetryItem.baseType) {
                        // Default
                        telemetryItem.baseType = "EventData";
                    }
                    // ensure a sender was constructed
                    if (!_self._sender) {
                        itemCtx.diagLog().throwInternal(LoggingSeverity.CRITICAL, _InternalMessageId.SenderNotInitialized, "Sender was not initialized");
                        return;
                    }
                    // check if this item should be sampled in, else add sampleRate tag
                    if (!_isSampledIn(telemetryItem)) {
                        // Item is sampled out, do not send it
                        itemCtx.diagLog().throwInternal(LoggingSeverity.WARNING, _InternalMessageId.TelemetrySampledAndNotSent, "Telemetry item was sampled out and not sent", { SampleRate: _self._sample.sampleRate });
                        return;
                    }
                    else {
                        telemetryItem[SampleRate] = _self._sample.sampleRate;
                    }
                    // construct an envelope that Application Insights endpoint can understand
                    var aiEnvelope_1 = Sender.constructEnvelope(telemetryItem, _self._senderConfig.instrumentationKey(), itemCtx.diagLog());
                    if (!aiEnvelope_1) {
                        itemCtx.diagLog().throwInternal(LoggingSeverity.CRITICAL, _InternalMessageId.CreateEnvelopeError, "Unable to create an AppInsights envelope");
                        return;
                    }
                    var doNotSendItem_1 = false;
                    // this is for running in legacy mode, where customer may already have a custom initializer present
                    if (telemetryItem.tags && telemetryItem.tags[ProcessLegacy]) {
                        arrForEach(telemetryItem.tags[ProcessLegacy], function (callBack) {
                            try {
                                if (callBack && callBack(aiEnvelope_1) === false) {
                                    doNotSendItem_1 = true;
                                    itemCtx.diagLog().warnToConsole("Telemetry processor check returns false");
                                }
                            }
                            catch (e) {
                                // log error but dont stop executing rest of the telemetry initializers
                                // doNotSendItem = true;
                                itemCtx.diagLog().throwInternal(LoggingSeverity.CRITICAL, _InternalMessageId.TelemetryInitializerFailed, "One of telemetry initializers failed, telemetry item will not be sent: " + getExceptionName(e), { exception: dumpObj(e) }, true);
                            }
                        });
                        delete telemetryItem.tags[ProcessLegacy];
                    }
                    if (doNotSendItem_1) {
                        return; // do not send, no need to execute next plugin
                    }
                    // check if the incoming payload is too large, truncate if necessary
                    var payload = _serializer.serialize(aiEnvelope_1);
                    // flush if we would exceed the max-size limit by adding this item
                    var bufferPayload = _self._buffer.getItems();
                    var batch = _self._buffer.batchPayloads(bufferPayload);
                    if (batch && (batch.length + payload.length > _self._senderConfig.maxBatchSizeInBytes())) {
                        _self.triggerSend(true, null, 10 /* MaxBatchSize */);
                    }
                    // enqueue the payload
                    _self._buffer.enqueue(payload);
                    // ensure an invocation timeout is set
                    _setupTimer();
                }
                catch (e) {
                    itemCtx.diagLog().throwInternal(LoggingSeverity.WARNING, _InternalMessageId.FailedAddingTelemetryToBuffer, "Failed adding telemetry to the sender's buffer, some telemetry will be lost: " + getExceptionName(e), { exception: dumpObj(e) });
                }
                // hand off the telemetry item to the next plugin
                _self.processNext(telemetryItem, itemCtx);
            };
            /**
             * xhr state changes
             */
            _self._xhrReadyStateChange = function (xhr, payload, countOfItemsInPayload) {
                if (xhr.readyState === 4) {
                    _checkResponsStatus(xhr.status, payload, xhr.responseURL, countOfItemsInPayload, _formatErrorMessageXhr(xhr), _getResponseText(xhr) || xhr.response);
                }
            };
            /**
             * Immediately send buffered data
             * @param async {boolean} - Indicates if the events should be sent asynchronously
             * @param forcedSender {SenderFunction} - Indicates the forcedSender, undefined if not passed
             */
            _self.triggerSend = function (async, forcedSender, sendReason) {
                if (async === void 0) { async = true; }
                try {
                    // Send data only if disableTelemetry is false
                    if (!_self._senderConfig.disableTelemetry()) {
                        if (_self._buffer.count() > 0) {
                            var payload = _self._buffer.getItems();
                            _notifySendRequest(sendReason || 0 /* Undefined */, async);
                            // invoke send
                            if (forcedSender) {
                                forcedSender.call(_this, payload, async);
                            }
                            else {
                                _self._sender(payload, async);
                            }
                        }
                        // update lastSend time to enable throttling
                        _lastSend = +new Date;
                    }
                    else {
                        _self._buffer.clear();
                    }
                    clearTimeout(_timeoutHandle);
                    _timeoutHandle = null;
                    _retryAt = null;
                }
                catch (e) {
                    /* Ignore this error for IE under v10 */
                    var ieVer = getIEVersion();
                    if (!ieVer || ieVer > 9) {
                        _self.diagLog().throwInternal(LoggingSeverity.CRITICAL, _InternalMessageId.TransmissionFailed, "Telemetry transmission failed, some telemetry will be lost: " + getExceptionName(e), { exception: dumpObj(e) });
                    }
                }
            };
            /**
             * error handler
             */
            _self._onError = function (payload, message, event) {
                _self.diagLog().throwInternal(LoggingSeverity.WARNING, _InternalMessageId.OnError, "Failed to send telemetry.", { message: message });
                _self._buffer.clearSent(payload);
            };
            /**
             * partial success handler
             */
            _self._onPartialSuccess = function (payload, results) {
                var failed = [];
                var retry = [];
                // Iterate through the reversed array of errors so that splicing doesn't have invalid indexes after the first item.
                var errors = results.errors.reverse();
                for (var _i = 0, errors_1 = errors; _i < errors_1.length; _i++) {
                    var error = errors_1[_i];
                    var extracted = payload.splice(error.index, 1)[0];
                    if (_isRetriable(error.statusCode)) {
                        retry.push(extracted);
                    }
                    else {
                        // All other errors, including: 402 (Monthly quota exceeded) and 439 (Too many requests and refresh cache).
                        failed.push(extracted);
                    }
                }
                if (payload.length > 0) {
                    _self._onSuccess(payload, results.itemsAccepted);
                }
                if (failed.length > 0) {
                    _self._onError(failed, _formatErrorMessageXhr(null, ['partial success', results.itemsAccepted, 'of', results.itemsReceived].join(' ')));
                }
                if (retry.length > 0) {
                    _resendPayload(retry);
                    _self.diagLog().throwInternal(LoggingSeverity.WARNING, _InternalMessageId.TransmissionFailed, "Partial success. " +
                        "Delivered: " + payload.length + ", Failed: " + failed.length +
                        ". Will retry to send " + retry.length + " our of " + results.itemsReceived + " items");
                }
            };
            /**
             * success handler
             */
            _self._onSuccess = function (payload, countOfItemsInPayload) {
                _self._buffer.clearSent(payload);
            };
            /**
             * xdr state changes
             */
            _self._xdrOnLoad = function (xdr, payload) {
                var responseText = _getResponseText(xdr);
                if (xdr && (responseText + "" === "200" || responseText === "")) {
                    _consecutiveErrors = 0;
                    _self._onSuccess(payload, 0);
                }
                else {
                    var results = _parseResponse(responseText);
                    if (results && results.itemsReceived && results.itemsReceived > results.itemsAccepted
                        && !_self._senderConfig.isRetryDisabled()) {
                        _self._onPartialSuccess(payload, results);
                    }
                    else {
                        _self._onError(payload, _formatErrorMessageXdr(xdr));
                    }
                }
            };
            function _isSampledIn(envelope) {
                return _self._sample.isSampledIn(envelope);
            }
            function _checkResponsStatus(status, payload, responseUrl, countOfItemsInPayload, errorMessage, res) {
                var response = null;
                if (!_self._appId) {
                    response = _parseResponse(res);
                    if (response && response.appId) {
                        _self._appId = response.appId;
                    }
                }
                if ((status < 200 || status >= 300) && status !== 0) {
                    // Update End Point url if permanent redirect or moved permanently
                    // Updates the end point url before retry
                    if (status === 301 || status === 307 || status === 308) {
                        if (!_checkAndUpdateEndPointUrl(responseUrl)) {
                            _self._onError(payload, errorMessage);
                            return;
                        }
                    }
                    if (!_self._senderConfig.isRetryDisabled() && _isRetriable(status)) {
                        _resendPayload(payload);
                        _self.diagLog().throwInternal(LoggingSeverity.WARNING, _InternalMessageId.TransmissionFailed, ". " +
                            "Response code " + status + ". Will retry to send " + payload.length + " items.");
                    }
                    else {
                        _self._onError(payload, errorMessage);
                    }
                }
                else if (Offline.isOffline()) {
                    // Note: Don't check for status == 0, since adblock gives this code
                    if (!_self._senderConfig.isRetryDisabled()) {
                        var offlineBackOffMultiplier = 10; // arbritrary number
                        _resendPayload(payload, offlineBackOffMultiplier);
                        _self.diagLog().throwInternal(LoggingSeverity.WARNING, _InternalMessageId.TransmissionFailed, ". Offline - Response Code: " + status + ". Offline status: " + Offline.isOffline() + ". Will retry to send " + payload.length + " items.");
                    }
                }
                else {
                    // check if the xhr's responseURL or fetch's response.url is same as endpoint url
                    // TODO after 10 redirects force send telemetry with 'redirect=false' as query parameter.
                    _checkAndUpdateEndPointUrl(responseUrl);
                    if (status === 206) {
                        if (!response) {
                            response = _parseResponse(res);
                        }
                        if (response && !_self._senderConfig.isRetryDisabled()) {
                            _self._onPartialSuccess(payload, response);
                        }
                        else {
                            _self._onError(payload, errorMessage);
                        }
                    }
                    else {
                        _consecutiveErrors = 0;
                        _self._onSuccess(payload, countOfItemsInPayload);
                    }
                }
            }
            function _checkAndUpdateEndPointUrl(responseUrl) {
                // Maximum stamp specific redirects allowed(uncomment this when breeze is ready with not allowing redirects feature)
                if (_stamp_specific_redirects >= 10) {
                    //  _self._senderConfig.endpointUrl = () => Sender._getDefaultAppInsightsChannelConfig().endpointUrl()+"/?redirect=false";
                    //  _stamp_specific_redirects = 0;
                    return false;
                }
                if (!isNullOrUndefined(responseUrl) && responseUrl !== '') {
                    if (responseUrl !== _self._senderConfig.endpointUrl()) {
                        _self._senderConfig.endpointUrl = function () { return responseUrl; };
                        ++_stamp_specific_redirects;
                        return true;
                    }
                }
                return false;
            }
            /**
             * Send Beacon API request
             * @param payload {string} - The data payload to be sent.
             * @param isAsync {boolean} - not used
             * Note: Beacon API does not support custom headers and we are not able to get
             * appId from the backend for the correct correlation.
             */
            function _beaconSender(payload, isAsync) {
                var url = _self._senderConfig.endpointUrl();
                var batch = _self._buffer.batchPayloads(payload);
                // Chrome only allows CORS-safelisted values for the sendBeacon data argument
                // see: https://bugs.chromium.org/p/chromium/issues/detail?id=720283
                var plainTextBatch = new Blob([batch], { type: 'text/plain;charset=UTF-8' });
                // The sendBeacon method returns true if the user agent is able to successfully queue the data for transfer. Otherwise it returns false.
                var queued = getNavigator().sendBeacon(url, plainTextBatch);
                if (queued) {
                    _self._buffer.markAsSent(payload);
                    // no response from beaconSender, clear buffer
                    _self._onSuccess(payload, payload.length);
                }
                else {
                    _xhrSender(payload, true);
                    _self.diagLog().throwInternal(LoggingSeverity.WARNING, _InternalMessageId.TransmissionFailed, ". " + "Failed to send telemetry with Beacon API, retried with xhrSender.");
                }
            }
            /**
             * Send XMLHttpRequest
             * @param payload {string} - The data payload to be sent.
             * @param isAsync {boolean} - Indicates if the request should be sent asynchronously
             */
            function _xhrSender(payload, isAsync) {
                var xhr = new XMLHttpRequest();
                var endPointUrl = _self._senderConfig.endpointUrl();
                try {
                    xhr[DisabledPropertyName] = true;
                }
                catch (e) {
                    // If the environment has locked down the XMLHttpRequest (preventExtensions and/or freeze), this would
                    // cause the request to fail and we no telemetry would be sent
                }
                xhr.open("POST", endPointUrl, isAsync);
                xhr.setRequestHeader("Content-type", "application/json");
                // append Sdk-Context request header only in case of breeze endpoint
                if (isInternalApplicationInsightsEndpoint(endPointUrl)) {
                    xhr.setRequestHeader(RequestHeaders.sdkContextHeader, RequestHeaders.sdkContextHeaderAppIdRequest);
                }
                arrForEach(objKeys(_headers), function (headerName) {
                    xhr.setRequestHeader(headerName, _headers[headerName]);
                });
                xhr.onreadystatechange = function () { return _self._xhrReadyStateChange(xhr, payload, payload.length); };
                xhr.onerror = function (event) { return _self._onError(payload, _formatErrorMessageXhr(xhr), event); };
                // compose an array of payloads
                var batch = _self._buffer.batchPayloads(payload);
                xhr.send(batch);
                _self._buffer.markAsSent(payload);
            }
            /**
             * Send fetch API request
             * @param payload {string} - The data payload to be sent.
             * @param isAsync {boolean} - not used
             */
            function _fetchSender(payload, isAsync) {
                var endPointUrl = _self._senderConfig.endpointUrl();
                var batch = _self._buffer.batchPayloads(payload);
                var plainTextBatch = new Blob([batch], { type: 'text/plain;charset=UTF-8' });
                var requestHeaders = new Headers();
                // append Sdk-Context request header only in case of breeze endpoint
                if (isInternalApplicationInsightsEndpoint(endPointUrl)) {
                    requestHeaders.append(RequestHeaders.sdkContextHeader, RequestHeaders.sdkContextHeaderAppIdRequest);
                }
                arrForEach(objKeys(_headers), function (headerName) {
                    requestHeaders.append(headerName, _headers[headerName]);
                });
                var init = {
                    method: "POST",
                    headers: requestHeaders,
                    body: plainTextBatch
                };
                var request = new Request(endPointUrl, init);
                fetch(request).then(function (response) {
                    /**
                     * The Promise returned from fetch() won’t reject on HTTP error status even if the response is an HTTP 404 or 500.
                     * Instead, it will resolve normally (with ok status set to false), and it will only reject on network failure
                     * or if anything prevented the request from completing.
                     */
                    if (!response.ok) {
                        throw Error(response.statusText);
                    }
                    else {
                        response.text().then(function (text) {
                            _checkResponsStatus(response.status, payload, response.url, payload.length, response.statusText, text);
                        });
                        _self._buffer.markAsSent(payload);
                    }
                })["catch"](function (error) {
                    _self._onError(payload, error.message);
                });
            }
            /**
             * Parses the response from the backend.
             * @param response - XMLHttpRequest or XDomainRequest response
             */
            function _parseResponse(response) {
                try {
                    if (response && response !== "") {
                        var result = getJSON().parse(response);
                        if (result && result.itemsReceived && result.itemsReceived >= result.itemsAccepted &&
                            result.itemsReceived - result.itemsAccepted === result.errors.length) {
                            return result;
                        }
                    }
                }
                catch (e) {
                    _self.diagLog().throwInternal(LoggingSeverity.CRITICAL, _InternalMessageId.InvalidBackendResponse, "Cannot parse the response. " + getExceptionName(e), {
                        response: response
                    });
                }
                return null;
            }
            /**
             * Resend payload. Adds payload back to the send buffer and setup a send timer (with exponential backoff).
             * @param payload
             */
            function _resendPayload(payload, linearFactor) {
                if (linearFactor === void 0) { linearFactor = 1; }
                if (!payload || payload.length === 0) {
                    return;
                }
                _self._buffer.clearSent(payload);
                _consecutiveErrors++;
                for (var _i = 0, payload_1 = payload; _i < payload_1.length; _i++) {
                    var item = payload_1[_i];
                    _self._buffer.enqueue(item);
                }
                // setup timer
                _setRetryTime(linearFactor);
                _setupTimer();
            }
            /**
             * Calculates the time to wait before retrying in case of an error based on
             * http://en.wikipedia.org/wiki/Exponential_backoff
             */
            function _setRetryTime(linearFactor) {
                var SlotDelayInSeconds = 10;
                var delayInSeconds;
                if (_consecutiveErrors <= 1) {
                    delayInSeconds = SlotDelayInSeconds;
                }
                else {
                    var backOffSlot = (Math.pow(2, _consecutiveErrors) - 1) / 2;
                    // tslint:disable-next-line:insecure-random
                    var backOffDelay = Math.floor(Math.random() * backOffSlot * SlotDelayInSeconds) + 1;
                    backOffDelay = linearFactor * backOffDelay;
                    delayInSeconds = Math.max(Math.min(backOffDelay, 3600), SlotDelayInSeconds);
                }
                // TODO: Log the backoff time like the C# version does.
                var retryAfterTimeSpan = dateNow() + (delayInSeconds * 1000);
                // TODO: Log the retry at time like the C# version does.
                _retryAt = retryAfterTimeSpan;
            }
            /**
             * Sets up the timer which triggers actually sending the data.
             */
            function _setupTimer() {
                if (!_timeoutHandle) {
                    var retryInterval = _retryAt ? Math.max(0, _retryAt - dateNow()) : 0;
                    var timerValue = Math.max(_self._senderConfig.maxBatchInterval(), retryInterval);
                    _timeoutHandle = setTimeout(function () {
                        _self.triggerSend(true, null, 1 /* NormalSchedule */);
                    }, timerValue);
                }
            }
            /**
             * Checks if the SDK should resend the payload after receiving this status code from the backend.
             * @param statusCode
             */
            function _isRetriable(statusCode) {
                return statusCode === 408 // Timeout
                    || statusCode === 429 // Too many requests.
                    || statusCode === 500 // Internal server error.
                    || statusCode === 503; // Service unavailable.
            }
            function _formatErrorMessageXhr(xhr, message) {
                if (xhr) {
                    return "XMLHttpRequest,Status:" + xhr.status + ",Response:" + _getResponseText(xhr) || xhr.response || "";
                }
                return message;
            }
            /**
             * Send XDomainRequest
             * @param payload {string} - The data payload to be sent.
             * @param isAsync {boolean} - Indicates if the request should be sent asynchronously
             *
             * Note: XDomainRequest does not support sync requests. This 'isAsync' parameter is added
             * to maintain consistency with the xhrSender's contract
             * Note: XDomainRequest does not support custom headers and we are not able to get
             * appId from the backend for the correct correlation.
             */
            function _xdrSender(payload, isAsync) {
                var _window = getWindow();
                var xdr = new XDomainRequest();
                xdr.onload = function () { return _self._xdrOnLoad(xdr, payload); };
                xdr.onerror = function (event) { return _self._onError(payload, _formatErrorMessageXdr(xdr), event); };
                // XDomainRequest requires the same protocol as the hosting page.
                // If the protocol doesn't match, we can't send the telemetry :(.
                var hostingProtocol = _window && _window.location && _window.location.protocol || "";
                if (_self._senderConfig.endpointUrl().lastIndexOf(hostingProtocol, 0) !== 0) {
                    _self.diagLog().throwInternal(LoggingSeverity.WARNING, _InternalMessageId.TransmissionFailed, ". " +
                        "Cannot send XDomain request. The endpoint URL protocol doesn't match the hosting page protocol.");
                    _self._buffer.clear();
                    return;
                }
                var endpointUrl = _self._senderConfig.endpointUrl().replace(/^(https?:)/, "");
                xdr.open('POST', endpointUrl);
                // compose an array of payloads
                var batch = _self._buffer.batchPayloads(payload);
                xdr.send(batch);
                _self._buffer.markAsSent(payload);
            }
            function _formatErrorMessageXdr(xdr, message) {
                if (xdr) {
                    return "XDomainRequest,Response:" + _getResponseText(xdr) || "";
                }
                return message;
            }
            // Using function lookups for backward compatibility as the getNotifyMgr() did not exist until after v2.5.6
            function _getNotifyMgr() {
                var func = 'getNotifyMgr';
                if (_self.core[func]) {
                    return _self.core[func]();
                }
                // using _self.core['_notificationManager'] for backward compatibility
                return _self.core['_notificationManager'];
            }
            function _notifySendRequest(sendRequest, isAsync) {
                var manager = _getNotifyMgr();
                if (manager && manager.eventsSendRequest) {
                    try {
                        manager.eventsSendRequest(sendRequest, isAsync);
                    }
                    catch (e) {
                        _self.diagLog().throwInternal(LoggingSeverity.CRITICAL, _InternalMessageId.NotificationException, "send request notification failed: " + getExceptionName(e), { exception: dumpObj(e) });
                    }
                }
            }
            /**
             * Validate UUID Format
             * Specs taken from https://tools.ietf.org/html/rfc4122 and breeze repo
             */
            function _validateInstrumentationKey(config) {
                var disableIKeyValidationFlag = isNullOrUndefined(config.disableInstrumentationKeyValidation) ? false : config.disableInstrumentationKeyValidation;
                if (disableIKeyValidationFlag) {
                    return true;
                }
                var UUID_Regex = '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$';
                var regexp = new RegExp(UUID_Regex);
                return regexp.test(config.instrumentationKey);
            }
        });
        return _this;
    }
    Sender.constructEnvelope = function (orig, iKey, logger) {
        var envelope;
        if (iKey !== orig.iKey && !isNullOrUndefined(iKey)) {
            envelope = __assignFn({}, orig, { iKey: iKey });
        }
        else {
            envelope = orig;
        }
        switch (envelope.baseType) {
            case Event.dataType:
                return EventEnvelopeCreator.EventEnvelopeCreator.Create(logger, envelope);
            case Trace.dataType:
                return TraceEnvelopeCreator.TraceEnvelopeCreator.Create(logger, envelope);
            case PageView.dataType:
                return PageViewEnvelopeCreator.PageViewEnvelopeCreator.Create(logger, envelope);
            case PageViewPerformance.dataType:
                return PageViewPerformanceEnvelopeCreator.PageViewPerformanceEnvelopeCreator.Create(logger, envelope);
            case Exception.dataType:
                return ExceptionEnvelopeCreator.ExceptionEnvelopeCreator.Create(logger, envelope);
            case Metric.dataType:
                return MetricEnvelopeCreator.MetricEnvelopeCreator.Create(logger, envelope);
            case RemoteDependencyData.dataType:
                return DependencyEnvelopeCreator.DependencyEnvelopeCreator.Create(logger, envelope);
            default:
                return EventEnvelopeCreator.EventEnvelopeCreator.Create(logger, envelope);
        }
    };
    Sender._getDefaultAppInsightsChannelConfig = function () {
        // set default values
        return {
            endpointUrl: function () { return "https://dc.services.visualstudio.com/v2/track"; },
            emitLineDelimitedJson: function () { return false; },
            maxBatchInterval: function () { return 15000; },
            maxBatchSizeInBytes: function () { return 102400; },
            disableTelemetry: function () { return false; },
            enableSessionStorageBuffer: function () { return true; },
            isRetryDisabled: function () { return false; },
            isBeaconApiDisabled: function () { return true; },
            onunloadDisableBeacon: function () { return false; },
            instrumentationKey: function () { return undefined; },
            namePrefix: function () { return undefined; },
            samplingPercentage: function () { return 100; },
            customHeaders: function () { return undefined; }
        };
    };
    Sender._getEmptyAppInsightsChannelConfig = function () {
        return {
            endpointUrl: undefined,
            emitLineDelimitedJson: undefined,
            maxBatchInterval: undefined,
            maxBatchSizeInBytes: undefined,
            disableTelemetry: undefined,
            enableSessionStorageBuffer: undefined,
            isRetryDisabled: undefined,
            isBeaconApiDisabled: undefined,
            onunloadDisableBeacon: undefined,
            instrumentationKey: undefined,
            namePrefix: undefined,
            samplingPercentage: undefined,
            customHeaders: undefined
        };
    };
// Removed Stub for Sender.prototype.pause.
// Removed Stub for Sender.prototype.resume.
// Removed Stub for Sender.prototype.flush.
// Removed Stub for Sender.prototype.onunloadFlush.
// Removed Stub for Sender.prototype.teardown.
// Removed Stub for Sender.prototype.initialize.
// Removed Stub for Sender.prototype.processTelemetry.
// Removed Stub for Sender.prototype._xhrReadyStateChange.
// Removed Stub for Sender.prototype.triggerSend.
// Removed Stub for Sender.prototype._onError.
// Removed Stub for Sender.prototype._onPartialSuccess.
// Removed Stub for Sender.prototype._onSuccess.
// Removed Stub for Sender.prototype._xdrOnLoad.
// Removed Stub for Sender.prototype.addHeader.
    return Sender;
}(BaseTelemetryPlugin));
export { Sender };//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/fe719cd3e5825bf14e14182fddeb88ee8daf044f/node_modules/@microsoft/applicationinsights-channel-js/dist-esm/Sender.js.map