/*
 * Application Insights JavaScript SDK - Properties Plugin, 2.6.4
 * Copyright (c) Microsoft and contributors. All rights reserved.
 */
/**
 * PropertiesPlugin.ts
 * @copyright Microsoft 2018
 */
import { __extendsFn } from "@microsoft/applicationinsights-shims";
import dynamicProto from "@microsoft/dynamicproto-js";
import { BaseTelemetryPlugin, isNullOrUndefined, _InternalLogMessage, LoggingSeverity, _InternalMessageId, getNavigator, objForEachKey, getSetValue } from '@microsoft/applicationinsights-core-js';
import { TelemetryContext } from './TelemetryContext';
import { PageView, BreezeChannelIdentifier, PropertiesPluginIdentifier, getExtensionByName } from '@microsoft/applicationinsights-common';
var PropertiesPlugin = /** @class */ (function (_super) {
    __extendsFn(PropertiesPlugin, _super);
    function PropertiesPlugin() {
        var _this = _super.call(this) || this;
        _this.priority = 110;
        _this.identifier = PropertiesPluginIdentifier;
        var _breezeChannel; // optional. If exists, grab appId from it
        var _extensionConfig;
        dynamicProto(PropertiesPlugin, _this, function (_self, _base) {
            _self.initialize = function (config, core, extensions, pluginChain) {
                _base.initialize(config, core, extensions, pluginChain);
                var ctx = _self._getTelCtx();
                var identifier = _self.identifier;
                var defaultConfig = PropertiesPlugin.getDefaultConfig();
                _extensionConfig = _extensionConfig || {};
                objForEachKey(defaultConfig, function (field, value) {
                    _extensionConfig[field] = function () { return ctx.getConfig(identifier, field, value()); };
                });
                _self.context = new TelemetryContext(core, _extensionConfig);
                _breezeChannel = getExtensionByName(extensions, BreezeChannelIdentifier);
                _self.context.appId = function () { return _breezeChannel ? _breezeChannel["_appId"] : null; };
                // Test hook to allow accessing the internal values -- explicitly not defined as an available property on the class
                _self["_extConfig"] = _extensionConfig;
            };
            /**
             * Add Part A fields to the event
             * @param event The event that needs to be processed
             */
            _self.processTelemetry = function (event, itemCtx) {
                if (isNullOrUndefined(event)) {
                    // TODO(barustum): throw an internal event once we have support for internal logging
                }
                else {
                    itemCtx = _self._getTelCtx(itemCtx);
                    // If the envelope is PageView, reset the internal message count so that we can send internal telemetry for the new page.
                    if (event.name === PageView.envelopeType) {
                        itemCtx.diagLog().resetInternalMessageCount();
                    }
                    var theContext = (_self.context || {});
                    if (theContext.session) {
                        // If customer did not provide custom session id update the session manager
                        if (typeof _self.context.session.id !== "string" && theContext.sessionManager) {
                            theContext.sessionManager.update();
                        }
                    }
                    _processTelemetryInternal(event, itemCtx);
                    if (theContext.user && theContext.user.isNewUser) {
                        theContext.user.isNewUser = false;
                        var message = new _InternalLogMessage(_InternalMessageId.SendBrowserInfoOnUserInit, ((getNavigator() || {}).userAgent || ""));
                        itemCtx.diagLog().logInternalMessage(LoggingSeverity.CRITICAL, message);
                    }
                    _self.processNext(event, itemCtx);
                }
            };
            function _processTelemetryInternal(evt, itemCtx) {
                // Set Part A fields
                getSetValue(evt, "tags", []);
                getSetValue(evt, "ext", {});
                var ctx = _self.context;
                ctx.applySessionContext(evt, itemCtx);
                ctx.applyApplicationContext(evt, itemCtx);
                ctx.applyDeviceContext(evt, itemCtx);
                ctx.applyOperationContext(evt, itemCtx);
                ctx.applyUserContext(evt, itemCtx);
                ctx.applyOperatingSystemContxt(evt, itemCtx);
                ctx.applyWebContext(evt, itemCtx);
                ctx.applyLocationContext(evt, itemCtx); // legacy tags
                ctx.applyInternalContext(evt, itemCtx); // legacy tags
                ctx.cleanUp(evt, itemCtx);
            }
        });
        return _this;
    }
    PropertiesPlugin.getDefaultConfig = function () {
        var defaultConfig = {
            instrumentationKey: function () { return undefined; },
            accountId: function () { return null; },
            sessionRenewalMs: function () { return 30 * 60 * 1000; },
            samplingPercentage: function () { return 100; },
            sessionExpirationMs: function () { return 24 * 60 * 60 * 1000; },
            cookieDomain: function () { return null; },
            sdkExtension: function () { return null; },
            isBrowserLinkTrackingEnabled: function () { return false; },
            appId: function () { return null; },
            namePrefix: function () { return undefined; },
            sessionCookiePostfix: function () { return undefined; },
            userCookiePostfix: function () { return undefined; },
            idLength: function () { return 22; },
            getNewId: function () { return null; }
        };
        return defaultConfig;
    };
// Removed Stub for PropertiesPlugin.prototype.initialize.
// Removed Stub for PropertiesPlugin.prototype.processTelemetry.
    return PropertiesPlugin;
}(BaseTelemetryPlugin));
export default PropertiesPlugin;//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/fe719cd3e5825bf14e14182fddeb88ee8daf044f/node_modules/@microsoft/applicationinsights-properties-js/dist-esm/PropertiesPlugin.js.map