/*
 * Application Insights JavaScript SDK - Properties Plugin, 2.6.4
 * Copyright (c) Microsoft and contributors. All rights reserved.
 */


import dynamicProto from '@microsoft/dynamicproto-js';
import { utlCanUseLocalStorage, utlGetLocalStorage, utlSetLocalStorage } from '@microsoft/applicationinsights-common';
import { _InternalMessageId, LoggingSeverity, safeGetCookieMgr, isFunction, newId, dumpObj, getExceptionName, dateNow, safeGetLogger } from '@microsoft/applicationinsights-core-js';
var cookieNameConst = 'ai_session';
var Session = /** @class */ (function () {
    function Session() {
    }
    return Session;
}());
export { Session };
var _SessionManager = /** @class */ (function () {
    function _SessionManager(config, core) {
        var self = this;
        var _storageNamePrefix;
        var _cookieUpdatedTimestamp;
        var _logger = safeGetLogger(core);
        var _cookieManager = safeGetCookieMgr(core);
        dynamicProto(_SessionManager, self, function (_self) {
            if (!config) {
                config = {};
            }
            if (!isFunction(config.sessionExpirationMs)) {
                config.sessionExpirationMs = function () { return _SessionManager.acquisitionSpan; };
            }
            if (!isFunction(config.sessionRenewalMs)) {
                config.sessionRenewalMs = function () { return _SessionManager.renewalSpan; };
            }
            _self.config = config;
            // sessionCookiePostfix takes the preference if it is configured, otherwise takes namePrefix if configured.
            var sessionCookiePostfix = (_self.config.sessionCookiePostfix && _self.config.sessionCookiePostfix()) ?
                _self.config.sessionCookiePostfix() :
                ((_self.config.namePrefix && _self.config.namePrefix()) ? _self.config.namePrefix() : "");
            _storageNamePrefix = function () { return cookieNameConst + sessionCookiePostfix; };
            _self.automaticSession = new Session();
            _self.update = function () {
                // Always using Date getTime() as there is a bug in older IE instances that causes the performance timings to have the hi-bit set eg 0x800000000 causing
                // the number to be incorrect.
                var nowMs = dateNow();
                var isExpired = false;
                var session = _self.automaticSession;
                if (!session.id) {
                    isExpired = !_initializeAutomaticSession(session, nowMs);
                }
                var sessionExpirationMs = _self.config.sessionExpirationMs();
                if (!isExpired && sessionExpirationMs > 0) {
                    var sessionRenewalMs = _self.config.sessionRenewalMs();
                    var timeSinceAcqMs = nowMs - session.acquisitionDate;
                    var timeSinceRenewalMs = nowMs - session.renewalDate;
                    isExpired = timeSinceAcqMs < 0 || timeSinceRenewalMs < 0; // expired if the acquisition or last renewal are in the future
                    isExpired = isExpired || timeSinceAcqMs > sessionExpirationMs; // expired if the time since acquisition is more than session Expiration
                    isExpired = isExpired || timeSinceRenewalMs > sessionRenewalMs; // expired if the time since last renewal is more than renewal period
                }
                // renew if acquisitionSpan or renewalSpan has elapsed
                if (isExpired) {
                    // update automaticSession so session state has correct id
                    _renew(nowMs);
                }
                else {
                    // do not update the cookie more often than cookieUpdateInterval
                    if (!_cookieUpdatedTimestamp || nowMs - _cookieUpdatedTimestamp > _SessionManager.cookieUpdateInterval) {
                        _setCookie(session, nowMs);
                    }
                }
            };
            /**
             *  Record the current state of the automatic session and store it in our cookie string format
             *  into the browser's local storage. This is used to restore the session data when the cookie
             *  expires.
             */
            _self.backup = function () {
                var session = _self.automaticSession;
                _setStorage(session.id, session.acquisitionDate, session.renewalDate);
            };
            /**
             * Use config.namePrefix + ai_session cookie data or local storage data (when the cookie is unavailable) to
             * initialize the automatic session.
             * @returns true if values set otherwise false
             */
            function _initializeAutomaticSession(session, now) {
                var isValid = false;
                var cookieValue = _cookieManager.get(_storageNamePrefix());
                if (cookieValue && isFunction(cookieValue.split)) {
                    isValid = _initializeAutomaticSessionWithData(session, cookieValue);
                }
                else {
                    // There's no cookie, but we might have session data in local storage
                    // This can happen if the session expired or the user actively deleted the cookie
                    // We only want to recover data if the cookie is missing from expiry. We should respect the user's wishes if the cookie was deleted actively.
                    // The User class handles this for us and deletes our local storage object if the persistent user cookie was removed.
                    var storageValue = utlGetLocalStorage(_logger, _storageNamePrefix());
                    if (storageValue) {
                        isValid = _initializeAutomaticSessionWithData(session, storageValue);
                    }
                }
                return isValid || !!session.id;
            }
            /**
             * Extract id, acquisitionDate, and renewalDate from an ai_session payload string and
             * use this data to initialize automaticSession.
             *
             * @param {string} sessionData - The string stored in an ai_session cookie or local storage backup
             * @returns true if values set otherwise false
             */
            function _initializeAutomaticSessionWithData(session, sessionData) {
                var isValid = false;
                var sessionReset = ", session will be reset";
                var tokens = sessionData.split("|");
                if (tokens.length >= 2) {
                    try {
                        var acqMs = +tokens[1] || 0;
                        var renewalMs = +tokens[2] || 0;
                        if (isNaN(acqMs) || acqMs <= 0) {
                            _logger.throwInternal(LoggingSeverity.WARNING, _InternalMessageId.SessionRenewalDateIsZero, "AI session acquisition date is 0" + sessionReset);
                        }
                        else if (isNaN(renewalMs) || renewalMs <= 0) {
                            _logger.throwInternal(LoggingSeverity.WARNING, _InternalMessageId.SessionRenewalDateIsZero, "AI session renewal date is 0" + sessionReset);
                        }
                        else if (tokens[0]) {
                            // Everything looks valid so set the values
                            session.id = tokens[0];
                            session.acquisitionDate = acqMs;
                            session.renewalDate = renewalMs;
                            isValid = true;
                        }
                    }
                    catch (e) {
                        _logger.throwInternal(LoggingSeverity.CRITICAL, _InternalMessageId.ErrorParsingAISessionCookie, "Error parsing ai_session value [" + (sessionData || "") + "]" + sessionReset + " - " + getExceptionName(e), { exception: dumpObj(e) });
                    }
                }
                return isValid;
            }
            function _renew(nowMs) {
                var theConfig = (_self.config || {});
                var getNewId = (theConfig.getNewId ? theConfig.getNewId() : null) || newId;
                _self.automaticSession.id = getNewId(theConfig.idLength ? theConfig.idLength() : 22);
                _self.automaticSession.acquisitionDate = nowMs;
                _setCookie(_self.automaticSession, nowMs);
                // If this browser does not support local storage, fire an internal log to keep track of it at this point
                if (!utlCanUseLocalStorage()) {
                    _logger.throwInternal(LoggingSeverity.WARNING, _InternalMessageId.BrowserDoesNotSupportLocalStorage, "Browser does not support local storage. Session durations will be inaccurate.");
                }
            }
            function _setCookie(session, nowMs) {
                var acq = session.acquisitionDate;
                session.renewalDate = nowMs;
                var config = _self.config;
                var renewalPeriodMs = config.sessionRenewalMs();
                // Set cookie to expire after the session expiry time passes or the session renewal deadline, whichever is sooner
                // Expiring the cookie will cause the session to expire even if the user isn't on the page
                var acqTimeLeftMs = (acq + config.sessionExpirationMs()) - nowMs;
                var cookie = [session.id, acq, nowMs];
                var maxAgeSec = 0;
                if (acqTimeLeftMs < renewalPeriodMs) {
                    maxAgeSec = acqTimeLeftMs / 1000;
                }
                else {
                    maxAgeSec = renewalPeriodMs / 1000;
                }
                var cookieDomain = config.cookieDomain ? config.cookieDomain() : null;
                // if sessionExpirationMs is set to 0, it means the expiry is set to 0 for this session cookie
                // A cookie with 0 expiry in the session cookie will never expire for that browser session.  If the browser is closed the cookie expires.  
                // Depending on the browser, another instance does not inherit this cookie, however, another tab will
                _cookieManager.set(_storageNamePrefix(), cookie.join('|'), config.sessionExpirationMs() > 0 ? maxAgeSec : null, cookieDomain);
                _cookieUpdatedTimestamp = nowMs;
            }
            function _setStorage(guid, acq, renewal) {
                // Keep data in local storage to retain the last session id, allowing us to cleanly end the session when it expires
                // Browsers that don't support local storage won't be able to end sessions cleanly from the client
                // The server will notice this and end the sessions itself, with loss of accurate session duration
                utlSetLocalStorage(_logger, _storageNamePrefix(), [guid, acq, renewal].join('|'));
            }
        });
    }
// Removed Stub for _SessionManager.prototype.update.
// Removed Stub for _SessionManager.prototype.backup.
    _SessionManager.acquisitionSpan = 86400000; // 24 hours in ms
    _SessionManager.renewalSpan = 1800000; // 30 minutes in ms
    _SessionManager.cookieUpdateInterval = 60000; // 1 minute in ms
    return _SessionManager;
}());
export { _SessionManager };//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/fe719cd3e5825bf14e14182fddeb88ee8daf044f/node_modules/@microsoft/applicationinsights-properties-js/dist-esm/Context/Session.js.map