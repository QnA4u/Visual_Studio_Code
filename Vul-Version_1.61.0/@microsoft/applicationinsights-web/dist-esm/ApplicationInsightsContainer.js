/*
 * Application Insights JavaScript SDK - Web, 2.6.4
 * Copyright (c) Microsoft and contributors. All rights reserved.
 */
import { AppInsightsDeprecated } from "./ApplicationInsightsDeprecated";
import { Initialization as ApplicationInsights } from "./Initialization";
import { _legacyCookieMgr } from "@microsoft/applicationinsights-core-js";
var ApplicationInsightsContainer = /** @class */ (function () {
    function ApplicationInsightsContainer() {
    }
    ApplicationInsightsContainer.getAppInsights = function (snippet, version) {
        var initialization = new ApplicationInsights(snippet);
        var legacyMode = version !== 2.0 ? true : false;
        // Side effect is to create, initialize and listen to the CoreUtils._canUseCookies changes
        // Called here to support backward compatibility
        _legacyCookieMgr();
        // Two target scenarios:
        // 1. Customer runs v1 snippet + runtime. If customer updates just cdn location to new SDK, it will run in compat mode so old apis work
        // 2. Customer updates to new snippet (that uses cdn location to new SDK. This is same as a new customer onboarding
        // and all api signatures are expected to map to new SDK. Note new snippet specifies version
        if (version === 2.0) {
            initialization.updateSnippetDefinitions(snippet);
            initialization.loadAppInsights(legacyMode);
            return initialization; // default behavior with new snippet
        }
        else {
            var legacy = new AppInsightsDeprecated(snippet, initialization); // target scenario old snippet + updated endpoint
            legacy.updateSnippetDefinitions(snippet);
            initialization.loadAppInsights(legacyMode);
            return legacy;
        }
    };
    return ApplicationInsightsContainer;
}());
export { ApplicationInsightsContainer };//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/ee8c7def80afc00dd6e593ef12f37756d8f504ea/node_modules/@microsoft/applicationinsights-web/dist-esm/ApplicationInsightsContainer.js.map