/*
 * Application Insights JavaScript SDK - Channel, 2.6.4
 * Copyright (c) Microsoft and contributors. All rights reserved.
 */


import { HashCodeScoreGenerator } from './HashCodeScoreGenerator';
import { ContextTagKeys } from '@microsoft/applicationinsights-common';
var SamplingScoreGenerator = /** @class */ (function () {
    function SamplingScoreGenerator() {
        this.hashCodeGeneragor = new HashCodeScoreGenerator();
        this.keys = new ContextTagKeys();
    }
    SamplingScoreGenerator.prototype.getSamplingScore = function (item) {
        var score = 0;
        if (item.tags && item.tags[this.keys.userId]) {
            score = this.hashCodeGeneragor.getHashCodeScore(item.tags[this.keys.userId]);
        }
        else if (item.ext && item.ext.user && item.ext.user.id) {
            score = this.hashCodeGeneragor.getHashCodeScore(item.ext.user.id);
        }
        else if (item.tags && item.tags[this.keys.operationId]) {
            score = this.hashCodeGeneragor.getHashCodeScore(item.tags[this.keys.operationId]);
        }
        else if (item.ext && item.ext.telemetryTrace && item.ext.telemetryTrace.traceID) {
            score = this.hashCodeGeneragor.getHashCodeScore(item.ext.telemetryTrace.traceID);
        }
        else {
            // tslint:disable-next-line:insecure-random
            score = (Math.random() * 100);
        }
        return score;
    };
    return SamplingScoreGenerator;
}());
export { SamplingScoreGenerator };//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/ee8c7def80afc00dd6e593ef12f37756d8f504ea/node_modules/@microsoft/applicationinsights-channel-js/dist-esm/TelemetryProcessors/SamplingScoreGenerators/SamplingScoreGenerator.js.map