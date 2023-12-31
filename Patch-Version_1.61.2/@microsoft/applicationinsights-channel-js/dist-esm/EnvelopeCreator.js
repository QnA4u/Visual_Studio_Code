/*
 * Application Insights JavaScript SDK - Channel, 2.6.4
 * Copyright (c) Microsoft and contributors. All rights reserved.
 */
import { __assignFn, __extendsFn } from "@microsoft/applicationinsights-shims";
import { Data, Envelope, RemoteDependencyData, Event, Exception, Metric, PageView, Trace, PageViewPerformance, CtxTagKeys, HttpMethod, SampleRate, } from '@microsoft/applicationinsights-common';
import { LoggingSeverity, _InternalMessageId, hasJSON, getJSON, objForEachKey, isNullOrUndefined, isNumber, isString, toISOString, setValue, isTruthy, optimizeObject } from '@microsoft/applicationinsights-core-js';
// these two constants are used to filter out properties not needed when trying to extract custom properties and measurements from the incoming payload
var strBaseType = 'baseType';
var strBaseData = 'baseData';
var strProperties = 'properties';
var strTrue = 'true';
function _setValueIf(target, field, value) {
    return setValue(target, field, value, isTruthy);
}
var EnvelopeCreator = /** @class */ (function () {
    function EnvelopeCreator() {
    }
    EnvelopeCreator.extractPropsAndMeasurements = function (data, properties, measurements) {
        if (!isNullOrUndefined(data)) {
            objForEachKey(data, function (key, value) {
                if (isNumber(value)) {
                    measurements[key] = value;
                }
                else if (isString(value)) {
                    properties[key] = value;
                }
                else if (hasJSON()) {
                    properties[key] = getJSON().stringify(value);
                }
            });
        }
    };
    // TODO: Do we want this to take logger as arg or use this._logger as nonstatic?
    EnvelopeCreator.createEnvelope = function (logger, envelopeType, telemetryItem, data) {
        var envelope = new Envelope(logger, data, envelopeType);
        _setValueIf(envelope, 'sampleRate', telemetryItem[SampleRate]);
        if ((telemetryItem[strBaseData] || {}).startTime) {
            envelope.time = toISOString(telemetryItem[strBaseData].startTime);
        }
        envelope.iKey = telemetryItem.iKey;
        var iKeyNoDashes = telemetryItem.iKey.replace(/-/g, "");
        envelope.name = envelope.name.replace("{0}", iKeyNoDashes);
        // extract all extensions from ctx
        EnvelopeCreator.extractPartAExtensions(telemetryItem, envelope);
        // loop through the envelope tags (extension of Part A) and pick out the ones that should go in outgoing envelope tags
        telemetryItem.tags = telemetryItem.tags || [];
        return optimizeObject(envelope);
    };
    /*
     * Maps Part A data from CS 4.0
     */
    EnvelopeCreator.extractPartAExtensions = function (item, env) {
        // todo: switch to keys from common in this method
        var envTags = env.tags = env.tags || {};
        var itmExt = item.ext = item.ext || {};
        var itmTags = item.tags = item.tags || [];
        var extUser = itmExt.user;
        if (extUser) {
            _setValueIf(envTags, CtxTagKeys.userAuthUserId, extUser.authId);
            _setValueIf(envTags, CtxTagKeys.userId, extUser.id || extUser.localId);
        }
        var extApp = itmExt.app;
        if (extApp) {
            _setValueIf(envTags, CtxTagKeys.sessionId, extApp.sesId);
        }
        var extDevice = itmExt.device;
        if (extDevice) {
            _setValueIf(envTags, CtxTagKeys.deviceId, extDevice.id || extDevice.localId);
            _setValueIf(envTags, CtxTagKeys.deviceType, extDevice.deviceClass);
            _setValueIf(envTags, CtxTagKeys.deviceIp, extDevice.ip);
            _setValueIf(envTags, CtxTagKeys.deviceModel, extDevice.model);
            _setValueIf(envTags, CtxTagKeys.deviceType, extDevice.deviceType);
        }
        var web = item.ext.web;
        if (web) {
            _setValueIf(envTags, CtxTagKeys.deviceLanguage, web.browserLang);
            _setValueIf(envTags, CtxTagKeys.deviceBrowserVersion, web.browserVer);
            _setValueIf(envTags, CtxTagKeys.deviceBrowser, web.browser);
            var envData = env.data = env.data || {};
            var envBaseData = envData[strBaseData] = envData[strBaseData] || {};
            var envProps = envBaseData[strProperties] = envBaseData[strProperties] || {};
            _setValueIf(envProps, 'domain', web.domain);
            _setValueIf(envProps, 'isManual', web.isManual ? strTrue : null);
            _setValueIf(envProps, 'screenRes', web.screenRes);
            _setValueIf(envProps, 'userConsent', web.userConsent ? strTrue : null);
        }
        var extOs = itmExt.os;
        if (extOs) {
            _setValueIf(envTags, CtxTagKeys.deviceOS, extOs.name);
        }
        // No support for mapping Trace.traceState to 2.0 as it is currently empty
        var extTrace = itmExt.trace;
        if (extTrace) {
            _setValueIf(envTags, CtxTagKeys.operationParentId, extTrace.parentID);
            _setValueIf(envTags, CtxTagKeys.operationName, extTrace.name);
            _setValueIf(envTags, CtxTagKeys.operationId, extTrace.traceID);
        }
        // Sample 4.0 schema
        //  {
        //     "time" : "2018-09-05T22:51:22.4936Z",
        //     "name" : "MetricWithNamespace",
        //     "iKey" : "ABC-5a4cbd20-e601-4ef5-a3c6-5d6577e4398e",
        //     "ext": {  "cloud": {
        //          "role": "WATSON3",
        //          "roleInstance": "CO4AEAP00000260"
        //      },
        //      "device": {}, "correlation": {} },
        //      "tags": [
        //        { "amazon.region" : "east2" },
        //        { "os.expid" : "wp:02df239" }
        //     ]
        //   }
        var tgs = {};
        // deals with tags.push({object})
        for (var i = itmTags.length - 1; i >= 0; i--) {
            var tg = itmTags[i];
            objForEachKey(tg, function (key, value) {
                tgs[key] = value;
            });
            itmTags.splice(i, 1);
        }
        // deals with tags[key]=value (and handles hasOwnProperty)
        objForEachKey(itmTags, function (tg, value) {
            tgs[tg] = value;
        });
        var theTags = __assignFn({}, envTags, tgs);
        if (!theTags[CtxTagKeys.internalSdkVersion]) {
            // Append a version in case it is not already set
            theTags[CtxTagKeys.internalSdkVersion] = "javascript:" + EnvelopeCreator.Version;
        }
        env.tags = optimizeObject(theTags);
    };
    EnvelopeCreator.prototype.Init = function (logger, telemetryItem) {
        this._logger = logger;
        if (isNullOrUndefined(telemetryItem[strBaseData])) {
            this._logger.throwInternal(LoggingSeverity.CRITICAL, _InternalMessageId.TelemetryEnvelopeInvalid, "telemetryItem.baseData cannot be null.");
        }
    };
    EnvelopeCreator.Version = "2.6.4";
    return EnvelopeCreator;
}());
export { EnvelopeCreator };
var DependencyEnvelopeCreator = /** @class */ (function (_super) {
    __extendsFn(DependencyEnvelopeCreator, _super);
    function DependencyEnvelopeCreator() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DependencyEnvelopeCreator.prototype.Create = function (logger, telemetryItem) {
        _super.prototype.Init.call(this, logger, telemetryItem);
        var customMeasurements = telemetryItem[strBaseData].measurements || {};
        var customProperties = telemetryItem[strBaseData][strProperties] || {};
        EnvelopeCreator.extractPropsAndMeasurements(telemetryItem.data, customProperties, customMeasurements);
        var bd = telemetryItem[strBaseData];
        if (isNullOrUndefined(bd)) {
            logger.warnToConsole("Invalid input for dependency data");
            return null;
        }
        var method = bd[strProperties] && bd[strProperties][HttpMethod] ? bd[strProperties][HttpMethod] : "GET";
        var remoteDepData = new RemoteDependencyData(logger, bd.id, bd.target, bd.name, bd.duration, bd.success, bd.responseCode, method, bd.type, bd.correlationContext, customProperties, customMeasurements);
        var data = new Data(RemoteDependencyData.dataType, remoteDepData);
        return EnvelopeCreator.createEnvelope(logger, RemoteDependencyData.envelopeType, telemetryItem, data);
    };
    DependencyEnvelopeCreator.DependencyEnvelopeCreator = new DependencyEnvelopeCreator();
    return DependencyEnvelopeCreator;
}(EnvelopeCreator));
export { DependencyEnvelopeCreator };
var EventEnvelopeCreator = /** @class */ (function (_super) {
    __extendsFn(EventEnvelopeCreator, _super);
    function EventEnvelopeCreator() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    EventEnvelopeCreator.prototype.Create = function (logger, telemetryItem) {
        _super.prototype.Init.call(this, logger, telemetryItem);
        var customProperties = {};
        var customMeasurements = {};
        if (telemetryItem[strBaseType] !== Event.dataType) {
            customProperties['baseTypeSource'] = telemetryItem[strBaseType]; // save the passed in base type as a property
        }
        if (telemetryItem[strBaseType] === Event.dataType) {
            customProperties = telemetryItem[strBaseData][strProperties] || {};
            customMeasurements = telemetryItem[strBaseData].measurements || {};
        }
        else {
            if (telemetryItem[strBaseData]) {
                EnvelopeCreator.extractPropsAndMeasurements(telemetryItem[strBaseData], customProperties, customMeasurements);
            }
        }
        // Extract root level properties from part C telemetryItem.data
        EnvelopeCreator.extractPropsAndMeasurements(telemetryItem.data, customProperties, customMeasurements);
        var eventName = telemetryItem[strBaseData].name;
        var eventData = new Event(logger, eventName, customProperties, customMeasurements);
        var data = new Data(Event.dataType, eventData);
        return EnvelopeCreator.createEnvelope(logger, Event.envelopeType, telemetryItem, data);
    };
    EventEnvelopeCreator.EventEnvelopeCreator = new EventEnvelopeCreator();
    return EventEnvelopeCreator;
}(EnvelopeCreator));
export { EventEnvelopeCreator };
var ExceptionEnvelopeCreator = /** @class */ (function (_super) {
    __extendsFn(ExceptionEnvelopeCreator, _super);
    function ExceptionEnvelopeCreator() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ExceptionEnvelopeCreator.prototype.Create = function (logger, telemetryItem) {
        _super.prototype.Init.call(this, logger, telemetryItem);
        // Extract root level properties from part C telemetryItem.data
        var customMeasurements = telemetryItem[strBaseData].measurements || {};
        var customProperties = telemetryItem[strBaseData][strProperties] || {};
        EnvelopeCreator.extractPropsAndMeasurements(telemetryItem.data, customProperties, customMeasurements);
        var bd = telemetryItem[strBaseData];
        var exData = Exception.CreateFromInterface(logger, bd, customProperties, customMeasurements);
        var data = new Data(Exception.dataType, exData);
        return EnvelopeCreator.createEnvelope(logger, Exception.envelopeType, telemetryItem, data);
    };
    ExceptionEnvelopeCreator.ExceptionEnvelopeCreator = new ExceptionEnvelopeCreator();
    return ExceptionEnvelopeCreator;
}(EnvelopeCreator));
export { ExceptionEnvelopeCreator };
var MetricEnvelopeCreator = /** @class */ (function (_super) {
    __extendsFn(MetricEnvelopeCreator, _super);
    function MetricEnvelopeCreator() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MetricEnvelopeCreator.prototype.Create = function (logger, telemetryItem) {
        _super.prototype.Init.call(this, logger, telemetryItem);
        var baseData = telemetryItem[strBaseData];
        var props = baseData[strProperties] || {};
        var measurements = baseData.measurements || {};
        EnvelopeCreator.extractPropsAndMeasurements(telemetryItem.data, props, measurements);
        var baseMetricData = new Metric(logger, baseData.name, baseData.average, baseData.sampleCount, baseData.min, baseData.max, props, measurements);
        var data = new Data(Metric.dataType, baseMetricData);
        return EnvelopeCreator.createEnvelope(logger, Metric.envelopeType, telemetryItem, data);
    };
    MetricEnvelopeCreator.MetricEnvelopeCreator = new MetricEnvelopeCreator();
    return MetricEnvelopeCreator;
}(EnvelopeCreator));
export { MetricEnvelopeCreator };
var PageViewEnvelopeCreator = /** @class */ (function (_super) {
    __extendsFn(PageViewEnvelopeCreator, _super);
    function PageViewEnvelopeCreator() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PageViewEnvelopeCreator.prototype.Create = function (logger, telemetryItem) {
        _super.prototype.Init.call(this, logger, telemetryItem);
        // Since duration is not part of the domain properties in Common Schema, extract it from part C
        var strDuration = "duration";
        var duration;
        var baseData = telemetryItem[strBaseData];
        if (!isNullOrUndefined(baseData) &&
            !isNullOrUndefined(baseData[strProperties]) &&
            !isNullOrUndefined(baseData[strProperties][strDuration])) {
            duration = baseData[strProperties][strDuration];
            delete baseData[strProperties][strDuration];
        }
        else if (!isNullOrUndefined(telemetryItem.data) &&
            !isNullOrUndefined(telemetryItem.data[strDuration])) {
            duration = telemetryItem.data[strDuration];
            delete telemetryItem.data[strDuration];
        }
        var bd = telemetryItem[strBaseData];
        // special case: pageview.id is grabbed from current operation id. Analytics plugin is decoupled from properties plugin, so this is done here instead. This can be made a default telemetry intializer instead if needed to be decoupled from channel
        var currentContextId;
        if (((telemetryItem.ext || {}).trace || {}).traceID) {
            currentContextId = telemetryItem.ext.trace.traceID;
        }
        var id = bd.id || currentContextId;
        var name = bd.name;
        var url = bd.uri;
        var properties = bd[strProperties] || {};
        var measurements = bd.measurements || {};
        // refUri is a field that Breeze still does not recognize as part of Part B. For now, put it in Part C until it supports it as a domain property
        if (!isNullOrUndefined(bd.refUri)) {
            properties["refUri"] = bd.refUri;
        }
        // pageType is a field that Breeze still does not recognize as part of Part B. For now, put it in Part C until it supports it as a domain property
        if (!isNullOrUndefined(bd.pageType)) {
            properties["pageType"] = bd.pageType;
        }
        // isLoggedIn is a field that Breeze still does not recognize as part of Part B. For now, put it in Part C until it supports it as a domain property
        if (!isNullOrUndefined(bd.isLoggedIn)) {
            properties["isLoggedIn"] = bd.isLoggedIn.toString();
        }
        // pageTags is a field that Breeze still does not recognize as part of Part B. For now, put it in Part C until it supports it as a domain property
        if (!isNullOrUndefined(bd[strProperties])) {
            var pageTags = bd[strProperties];
            objForEachKey(pageTags, function (key, value) {
                properties[key] = value;
            });
        }
        EnvelopeCreator.extractPropsAndMeasurements(telemetryItem.data, properties, measurements);
        var pageViewData = new PageView(logger, name, url, duration, properties, measurements, id);
        var data = new Data(PageView.dataType, pageViewData);
        return EnvelopeCreator.createEnvelope(logger, PageView.envelopeType, telemetryItem, data);
    };
    PageViewEnvelopeCreator.PageViewEnvelopeCreator = new PageViewEnvelopeCreator();
    return PageViewEnvelopeCreator;
}(EnvelopeCreator));
export { PageViewEnvelopeCreator };
var PageViewPerformanceEnvelopeCreator = /** @class */ (function (_super) {
    __extendsFn(PageViewPerformanceEnvelopeCreator, _super);
    function PageViewPerformanceEnvelopeCreator() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PageViewPerformanceEnvelopeCreator.prototype.Create = function (logger, telemetryItem) {
        _super.prototype.Init.call(this, logger, telemetryItem);
        var bd = telemetryItem[strBaseData];
        var name = bd.name;
        var url = bd.uri || bd.url;
        var properties = bd[strProperties] || {};
        var measurements = bd.measurements || {};
        EnvelopeCreator.extractPropsAndMeasurements(telemetryItem.data, properties, measurements);
        var baseData = new PageViewPerformance(logger, name, url, undefined, properties, measurements, bd);
        var data = new Data(PageViewPerformance.dataType, baseData);
        return EnvelopeCreator.createEnvelope(logger, PageViewPerformance.envelopeType, telemetryItem, data);
    };
    PageViewPerformanceEnvelopeCreator.PageViewPerformanceEnvelopeCreator = new PageViewPerformanceEnvelopeCreator();
    return PageViewPerformanceEnvelopeCreator;
}(EnvelopeCreator));
export { PageViewPerformanceEnvelopeCreator };
var TraceEnvelopeCreator = /** @class */ (function (_super) {
    __extendsFn(TraceEnvelopeCreator, _super);
    function TraceEnvelopeCreator() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TraceEnvelopeCreator.prototype.Create = function (logger, telemetryItem) {
        _super.prototype.Init.call(this, logger, telemetryItem);
        var message = telemetryItem[strBaseData].message;
        var severityLevel = telemetryItem[strBaseData].severityLevel;
        var props = telemetryItem[strBaseData][strProperties] || {};
        var measurements = telemetryItem[strBaseData].measurements || {};
        EnvelopeCreator.extractPropsAndMeasurements(telemetryItem.data, props, measurements);
        var baseData = new Trace(logger, message, severityLevel, props, measurements);
        var data = new Data(Trace.dataType, baseData);
        return EnvelopeCreator.createEnvelope(logger, Trace.envelopeType, telemetryItem, data);
    };
    TraceEnvelopeCreator.TraceEnvelopeCreator = new TraceEnvelopeCreator();
    return TraceEnvelopeCreator;
}(EnvelopeCreator));
export { TraceEnvelopeCreator };//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/fe719cd3e5825bf14e14182fddeb88ee8daf044f/node_modules/@microsoft/applicationinsights-channel-js/dist-esm/EnvelopeCreator.js.map