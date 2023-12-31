/*
 * Application Insights JavaScript SDK - Channel, 2.6.4
 * Copyright (c) Microsoft and contributors. All rights reserved.
 */


import { SamplingScoreGenerator } from './SamplingScoreGenerators/SamplingScoreGenerator';
import { Metric } from '@microsoft/applicationinsights-common';
import { _InternalMessageId, LoggingSeverity, safeGetLogger } from '@microsoft/applicationinsights-core-js';
var Sample = /** @class */ (function () {
    function Sample(sampleRate, logger) {
        // We're using 32 bit math, hence max value is (2^31 - 1)
        this.INT_MAX_VALUE = 2147483647;
        this._logger = logger || safeGetLogger(null);
        if (sampleRate > 100 || sampleRate < 0) {
            this._logger.throwInternal(LoggingSeverity.WARNING, _InternalMessageId.SampleRateOutOfRange, "Sampling rate is out of range (0..100). Sampling will be disabled, you may be sending too much data which may affect your AI service level.", { samplingRate: sampleRate }, true);
            sampleRate = 100;
        }
        this.sampleRate = sampleRate;
        this.samplingScoreGenerator = new SamplingScoreGenerator();
    }
    /**
     * Determines if an envelope is sampled in (i.e. will be sent) or not (i.e. will be dropped).
     */
    Sample.prototype.isSampledIn = function (envelope) {
        var samplingPercentage = this.sampleRate; // 0 - 100
        var isSampledIn = false;
        if (samplingPercentage === null || samplingPercentage === undefined || samplingPercentage >= 100) {
            return true;
        }
        else if (envelope.baseType === Metric.dataType) {
            // exclude MetricData telemetry from sampling
            return true;
        }
        isSampledIn = this.samplingScoreGenerator.getSamplingScore(envelope) < samplingPercentage;
        return isSampledIn;
    };
    return Sample;
}());
export { Sample };//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/fe719cd3e5825bf14e14182fddeb88ee8daf044f/node_modules/@microsoft/applicationinsights-channel-js/dist-esm/TelemetryProcessors/Sample.js.map