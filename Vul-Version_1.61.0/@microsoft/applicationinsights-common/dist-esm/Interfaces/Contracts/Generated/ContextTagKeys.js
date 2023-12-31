/*
 * Application Insights JavaScript SDK - Common, 2.6.4
 * Copyright (c) Microsoft and contributors. All rights reserved.
 */


import { __extendsFn } from "@microsoft/applicationinsights-shims";
import { createClassFromInterface } from "@microsoft/applicationinsights-core-js";
function _aiNameFunc(baseName) {
    var aiName = "ai." + baseName + ".";
    return function (name) {
        return aiName + name;
    };
}
var _aiApplication = _aiNameFunc("application");
var _aiDevice = _aiNameFunc("device");
var _aiLocation = _aiNameFunc("location");
var _aiOperation = _aiNameFunc("operation");
var _aiSession = _aiNameFunc("session");
var _aiUser = _aiNameFunc("user");
var _aiCloud = _aiNameFunc("cloud");
var _aiInternal = _aiNameFunc("internal");
var ContextTagKeys = /** @class */ (function (_super) {
    __extendsFn(ContextTagKeys, _super);
    function ContextTagKeys() {
        return _super.call(this) || this;
    }
    return ContextTagKeys;
}(createClassFromInterface({
    applicationVersion: _aiApplication("ver"),
    applicationBuild: _aiApplication("build"),
    applicationTypeId: _aiApplication("typeId"),
    applicationId: _aiApplication("applicationId"),
    applicationLayer: _aiApplication("layer"),
    deviceId: _aiDevice("id"),
    deviceIp: _aiDevice("ip"),
    deviceLanguage: _aiDevice("language"),
    deviceLocale: _aiDevice("locale"),
    deviceModel: _aiDevice("model"),
    deviceFriendlyName: _aiDevice("friendlyName"),
    deviceNetwork: _aiDevice("network"),
    deviceNetworkName: _aiDevice("networkName"),
    deviceOEMName: _aiDevice("oemName"),
    deviceOS: _aiDevice("os"),
    deviceOSVersion: _aiDevice("osVersion"),
    deviceRoleInstance: _aiDevice("roleInstance"),
    deviceRoleName: _aiDevice("roleName"),
    deviceScreenResolution: _aiDevice("screenResolution"),
    deviceType: _aiDevice("type"),
    deviceMachineName: _aiDevice("machineName"),
    deviceVMName: _aiDevice("vmName"),
    deviceBrowser: _aiDevice("browser"),
    deviceBrowserVersion: _aiDevice("browserVersion"),
    locationIp: _aiLocation("ip"),
    locationCountry: _aiLocation("country"),
    locationProvince: _aiLocation("province"),
    locationCity: _aiLocation("city"),
    operationId: _aiOperation("id"),
    operationName: _aiOperation("name"),
    operationParentId: _aiOperation("parentId"),
    operationRootId: _aiOperation("rootId"),
    operationSyntheticSource: _aiOperation("syntheticSource"),
    operationCorrelationVector: _aiOperation("correlationVector"),
    sessionId: _aiSession("id"),
    sessionIsFirst: _aiSession("isFirst"),
    sessionIsNew: _aiSession("isNew"),
    userAccountAcquisitionDate: _aiUser("accountAcquisitionDate"),
    userAccountId: _aiUser("accountId"),
    userAgent: _aiUser("userAgent"),
    userId: _aiUser("id"),
    userStoreRegion: _aiUser("storeRegion"),
    userAuthUserId: _aiUser("authUserId"),
    userAnonymousUserAcquisitionDate: _aiUser("anonUserAcquisitionDate"),
    userAuthenticatedUserAcquisitionDate: _aiUser("authUserAcquisitionDate"),
    cloudName: _aiCloud("name"),
    cloudRole: _aiCloud("role"),
    cloudRoleVer: _aiCloud("roleVer"),
    cloudRoleInstance: _aiCloud("roleInstance"),
    cloudEnvironment: _aiCloud("environment"),
    cloudLocation: _aiCloud("location"),
    cloudDeploymentUnit: _aiCloud("deploymentUnit"),
    internalNodeName: _aiInternal("nodeName"),
    internalSdkVersion: _aiInternal("sdkVersion"),
    internalAgentVersion: _aiInternal("agentVersion"),
    internalSnippet: _aiInternal("snippet"),
    internalSdkSrc: _aiInternal("sdkSrc")
})));
export { ContextTagKeys };//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/ee8c7def80afc00dd6e593ef12f37756d8f504ea/node_modules/@microsoft/applicationinsights-common/dist-esm/Interfaces/Contracts/Generated/ContextTagKeys.js.map