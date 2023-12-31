/*
 * Application Insights JavaScript SDK - Common, 2.6.4
 * Copyright (c) Microsoft and contributors. All rights reserved.
 */


import { dataSanitizeString } from "./Telemetry/Common/DataSanitizer";
import { objForEachKey, isNullOrUndefined, toISOString } from "@microsoft/applicationinsights-core-js";
import { strNotSpecified } from "./Constants";
var TelemetryItemCreator = /** @class */ (function () {
    function TelemetryItemCreator() {
    }
    /**
     * Create a telemetry item that the 1DS channel understands
     * @param item domain specific properties; part B
     * @param baseType telemetry item type. ie PageViewData
     * @param envelopeName name of the envelope. ie Microsoft.ApplicationInsights.<instrumentation key>.PageView
     * @param customProperties user defined custom properties; part C
     * @param systemProperties system properties that are added to the context; part A
     * @returns ITelemetryItem that is sent to channel
     */
    TelemetryItemCreator.create = function (item, baseType, envelopeName, logger, customProperties, systemProperties) {
        envelopeName = dataSanitizeString(logger, envelopeName) || strNotSpecified;
        if (isNullOrUndefined(item) ||
            isNullOrUndefined(baseType) ||
            isNullOrUndefined(envelopeName)) {
            throw Error("Input doesn't contain all required fields");
        }
        var telemetryItem = {
            name: envelopeName,
            time: toISOString(new Date()),
            iKey: "",
            ext: systemProperties ? systemProperties : {},
            tags: [],
            data: {},
            baseType: baseType,
            baseData: item // Part B
        };
        // Part C
        if (!isNullOrUndefined(customProperties)) {
            objForEachKey(customProperties, function (prop, value) {
                telemetryItem.data[prop] = value;
            });
        }
        return telemetryItem;
    };
    return TelemetryItemCreator;
}());
export { TelemetryItemCreator };//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/ee8c7def80afc00dd6e593ef12f37756d8f504ea/node_modules/@microsoft/applicationinsights-common/dist-esm/TelemetryItemCreator.js.map