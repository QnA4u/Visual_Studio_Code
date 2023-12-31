/*
 * Application Insights JavaScript SDK - Properties Plugin, 2.6.4
 * Copyright (c) Microsoft and contributors. All rights reserved.
 */
/**
 * TelemetryContext.ts
 * @copyright Microsoft 2018
 */
import dynamicProto from '@microsoft/dynamicproto-js';
import { isString, objKeys, hasWindow, _InternalLogMessage, setValue, getSetValue } from '@microsoft/applicationinsights-core-js';
import { Session, _SessionManager } from './Context/Session';
import { Extensions, CtxTagKeys, PageView } from '@microsoft/applicationinsights-common';
import { Application } from './Context/Application';
import { Device } from './Context/Device';
import { Internal } from './Context/Internal';
import { User } from './Context/User';
import { Location } from './Context/Location';
import { TelemetryTrace } from './Context/TelemetryTrace';
var strExt = "ext";
var strTags = "tags";
function _removeEmpty(target, name) {
    if (target && target[name] && objKeys(target[name]).length === 0) {
        delete target[name];
    }
}
var TelemetryContext = /** @class */ (function () {
    function TelemetryContext(core, defaultConfig) {
        var _this = this;
        var logger = core.logger;
        this.appId = function () { return null; };
        dynamicProto(TelemetryContext, this, function (_self) {
            _self.application = new Application();
            _self.internal = new Internal(defaultConfig);
            if (hasWindow()) {
                _self.sessionManager = new _SessionManager(defaultConfig, core);
                _self.device = new Device();
                _self.location = new Location();
                _self.user = new User(defaultConfig, core);
                _self.telemetryTrace = new TelemetryTrace(undefined, undefined, undefined, logger);
                _self.session = new Session();
            }
            _self.applySessionContext = function (evt, itemCtx) {
                var session = _self.session;
                var sessionManager = _self.sessionManager;
                // If customer set session info, apply their context; otherwise apply context automatically generated
                if (session && isString(session.id)) {
                    setValue(getSetValue(evt.ext, Extensions.AppExt), "sesId", session.id);
                }
                else if (sessionManager && sessionManager.automaticSession) {
                    setValue(getSetValue(evt.ext, Extensions.AppExt), "sesId", sessionManager.automaticSession.id, isString);
                }
            };
            _self.applyOperatingSystemContxt = function (evt, itemCtx) {
                setValue(evt.ext, Extensions.OSExt, _self.os);
            };
            _self.applyApplicationContext = function (evt, itemCtx) {
                var application = _self.application;
                if (application) {
                    // evt.ext.app
                    var tags = getSetValue(evt, strTags);
                    setValue(tags, CtxTagKeys.applicationVersion, application.ver, isString);
                    setValue(tags, CtxTagKeys.applicationBuild, application.build, isString);
                }
            };
            _self.applyDeviceContext = function (evt, itemCtx) {
                var device = _self.device;
                if (device) {
                    // evt.ext.device
                    var extDevice = getSetValue(getSetValue(evt, strExt), Extensions.DeviceExt);
                    setValue(extDevice, "localId", device.id, isString);
                    setValue(extDevice, "ip", device.ip, isString);
                    setValue(extDevice, "model", device.model, isString);
                    setValue(extDevice, "deviceClass", device.deviceClass, isString);
                }
            };
            _self.applyInternalContext = function (evt, itemCtx) {
                var internal = _self.internal;
                if (internal) {
                    var tags = getSetValue(evt, strTags);
                    setValue(tags, CtxTagKeys.internalAgentVersion, internal.agentVersion, isString); // not mapped in CS 4.0
                    setValue(tags, CtxTagKeys.internalSdkVersion, internal.sdkVersion, isString);
                    if (evt.baseType === _InternalLogMessage.dataType || evt.baseType === PageView.dataType) {
                        setValue(tags, CtxTagKeys.internalSnippet, internal.snippetVer, isString);
                        setValue(tags, CtxTagKeys.internalSdkSrc, internal.sdkSrc, isString);
                    }
                }
            };
            _self.applyLocationContext = function (evt, itemCtx) {
                var location = _this.location;
                if (location) {
                    setValue(getSetValue(evt, strTags, []), CtxTagKeys.locationIp, location.ip, isString);
                }
            };
            _self.applyOperationContext = function (evt, itemCtx) {
                var telemetryTrace = _self.telemetryTrace;
                if (telemetryTrace) {
                    var extTrace = getSetValue(getSetValue(evt, strExt), Extensions.TraceExt, { traceID: undefined, parentID: undefined });
                    setValue(extTrace, "traceID", telemetryTrace.traceID, isString);
                    setValue(extTrace, "name", telemetryTrace.name, isString);
                    setValue(extTrace, "parentID", telemetryTrace.parentID, isString);
                }
            };
            _self.applyWebContext = function (evt, itemCtx) {
                var web = _this.web;
                if (web) {
                    setValue(getSetValue(evt, strExt), Extensions.WebExt, web);
                }
            };
            _self.applyUserContext = function (evt, itemCtx) {
                var user = _self.user;
                if (user) {
                    var tags = getSetValue(evt, strTags, []);
                    // stays in tags
                    setValue(tags, CtxTagKeys.userAccountId, user.accountId, isString);
                    // CS 4.0
                    var extUser = getSetValue(getSetValue(evt, strExt), Extensions.UserExt);
                    setValue(extUser, "id", user.id, isString);
                    setValue(extUser, "authId", user.authenticatedId, isString);
                }
            };
            _self.cleanUp = function (evt, itemCtx) {
                var ext = evt.ext;
                if (ext) {
                    _removeEmpty(ext, Extensions.DeviceExt);
                    _removeEmpty(ext, Extensions.UserExt);
                    _removeEmpty(ext, Extensions.WebExt);
                    _removeEmpty(ext, Extensions.OSExt);
                    _removeEmpty(ext, Extensions.AppExt);
                    _removeEmpty(ext, Extensions.TraceExt);
                }
            };
        });
    }
// Removed Stub for TelemetryContext.prototype.applySessionContext.
// Removed Stub for TelemetryContext.prototype.applyOperatingSystemContxt.
// Removed Stub for TelemetryContext.prototype.applyApplicationContext.
// Removed Stub for TelemetryContext.prototype.applyDeviceContext.
// Removed Stub for TelemetryContext.prototype.applyInternalContext.
// Removed Stub for TelemetryContext.prototype.applyLocationContext.
// Removed Stub for TelemetryContext.prototype.applyOperationContext.
// Removed Stub for TelemetryContext.prototype.applyWebContext.
// Removed Stub for TelemetryContext.prototype.applyUserContext.
// Removed Stub for TelemetryContext.prototype.cleanUp.
    return TelemetryContext;
}());
export { TelemetryContext };//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/ee8c7def80afc00dd6e593ef12f37756d8f504ea/node_modules/@microsoft/applicationinsights-properties-js/dist-esm/TelemetryContext.js.map