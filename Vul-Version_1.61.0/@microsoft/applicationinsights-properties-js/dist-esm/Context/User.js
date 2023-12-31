/*
 * Application Insights JavaScript SDK - Properties Plugin, 2.6.4
 * Copyright (c) Microsoft and contributors. All rights reserved.
 */


import dynamicProto from "@microsoft/dynamicproto-js";
import { utlRemoveStorage } from '@microsoft/applicationinsights-common';
import { _InternalMessageId, LoggingSeverity, safeGetCookieMgr, safeGetLogger, newId, toISOString } from '@microsoft/applicationinsights-core-js';
function _validateUserInput(id) {
    // Validate:
    // 1. Id is a non-empty string.
    // 2. It does not contain special characters for cookies.
    if (typeof id !== 'string' ||
        !id ||
        id.match(/,|;|=| |\|/)) {
        return false;
    }
    return true;
}
var User = /** @class */ (function () {
    function User(config, core) {
        this.isNewUser = false;
        var _logger = safeGetLogger(core);
        var _cookieManager = safeGetCookieMgr(core);
        var _storageNamePrefix;
        dynamicProto(User, this, function (_self) {
            _self.config = config;
            var userCookiePostfix = (_self.config.userCookiePostfix && _self.config.userCookiePostfix()) ? _self.config.userCookiePostfix() : "";
            _storageNamePrefix = function () { return User.userCookieName + userCookiePostfix; };
            // get userId or create new one if none exists
            var cookie = _cookieManager.get(_storageNamePrefix());
            if (cookie) {
                _self.isNewUser = false;
                var params = cookie.split(User.cookieSeparator);
                if (params.length > 0) {
                    _self.id = params[0];
                }
            }
            if (!_self.id) {
                var theConfig = (config || {});
                var getNewId = (theConfig.getNewId ? theConfig.getNewId() : null) || newId;
                _self.id = getNewId(theConfig.idLength ? config.idLength() : 22);
                // without expiration, cookies expire at the end of the session
                // set it to 365 days from now
                // 365 * 24 * 60 * 60 = 31536000 
                var oneYear = 31536000;
                var acqStr = toISOString(new Date());
                _self.accountAcquisitionDate = acqStr;
                _self.isNewUser = true;
                var newCookie = [_self.id, acqStr];
                _cookieManager.set(_storageNamePrefix(), newCookie.join(User.cookieSeparator), oneYear);
                // If we have an config.namePrefix() + ai_session in local storage this means the user actively removed our cookies.
                // We should respect their wishes and clear ourselves from local storage
                var name_1 = config.namePrefix && config.namePrefix() ? config.namePrefix() + 'ai_session' : 'ai_session';
                utlRemoveStorage(_logger, name_1);
            }
            // We still take the account id from the ctor param for backward compatibility. 
            // But if the the customer set the accountId through the newer setAuthenticatedUserContext API, we will override it.
            _self.accountId = config.accountId ? config.accountId() : undefined;
            // Get the auth user id and account id from the cookie if exists
            // Cookie is in the pattern: <authenticatedId>|<accountId>
            var authCookie = _cookieManager.get(User.authUserCookieName);
            if (authCookie) {
                authCookie = decodeURI(authCookie);
                var authCookieString = authCookie.split(User.cookieSeparator);
                if (authCookieString[0]) {
                    _self.authenticatedId = authCookieString[0];
                }
                if (authCookieString.length > 1 && authCookieString[1]) {
                    _self.accountId = authCookieString[1];
                }
            }
            _self.setAuthenticatedUserContext = function (authenticatedUserId, accountId, storeInCookie) {
                if (storeInCookie === void 0) { storeInCookie = false; }
                // Validate inputs to ensure no cookie control characters.
                var isInvalidInput = !_validateUserInput(authenticatedUserId) || (accountId && !_validateUserInput(accountId));
                if (isInvalidInput) {
                    _logger.throwInternal(LoggingSeverity.WARNING, _InternalMessageId.SetAuthContextFailedAccountName, "Setting auth user context failed. " +
                        "User auth/account id should be of type string, and not contain commas, semi-colons, equal signs, spaces, or vertical-bars.", true);
                    return;
                }
                // Create cookie string.
                _self.authenticatedId = authenticatedUserId;
                var authCookie = _self.authenticatedId;
                if (accountId) {
                    _self.accountId = accountId;
                    authCookie = [_self.authenticatedId, _self.accountId].join(User.cookieSeparator);
                }
                if (storeInCookie) {
                    // Set the cookie. No expiration date because this is a session cookie (expires when browser closed).
                    // Encoding the cookie to handle unexpected unicode characters.
                    _cookieManager.set(User.authUserCookieName, encodeURI(authCookie));
                }
            };
            /**
             * Clears the authenticated user id and the account id from the user context.
             * @returns {}
             */
            _self.clearAuthenticatedUserContext = function () {
                _self.authenticatedId = null;
                _self.accountId = null;
                _cookieManager.del(User.authUserCookieName);
            };
        });
    }
// Removed Stub for User.prototype.setAuthenticatedUserContext.
// Removed Stub for User.prototype.clearAuthenticatedUserContext.
    User.cookieSeparator = '|';
    User.userCookieName = 'ai_user';
    User.authUserCookieName = 'ai_authUser';
    return User;
}());
export { User };//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/ee8c7def80afc00dd6e593ef12f37756d8f504ea/node_modules/@microsoft/applicationinsights-properties-js/dist-esm/Context/User.js.map