/*
 * Application Insights JavaScript SDK - Channel, 2.6.4
 * Copyright (c) Microsoft and contributors. All rights reserved.
 */


var HashCodeScoreGenerator = /** @class */ (function () {
    function HashCodeScoreGenerator() {
    }
    HashCodeScoreGenerator.prototype.getHashCodeScore = function (key) {
        var score = this.getHashCode(key) / HashCodeScoreGenerator.INT_MAX_VALUE;
        return score * 100;
    };
    HashCodeScoreGenerator.prototype.getHashCode = function (input) {
        if (input === "") {
            return 0;
        }
        while (input.length < HashCodeScoreGenerator.MIN_INPUT_LENGTH) {
            input = input.concat(input);
        }
        // 5381 is a magic number: http://stackoverflow.com/questions/10696223/reason-for-5381-number-in-djb-hash-function
        var hash = 5381;
        for (var i = 0; i < input.length; ++i) {
            hash = ((hash << 5) + hash) + input.charCodeAt(i);
            // 'hash' is of number type which means 53 bit integer (http://www.ecma-international.org/ecma-262/6.0/#sec-ecmascript-language-types-number-type)
            // 'hash & hash' will keep it 32 bit integer - just to make it clearer what the result is.
            hash = hash & hash;
        }
        return Math.abs(hash);
    };
    // We're using 32 bit math, hence max value is (2^31 - 1)
    HashCodeScoreGenerator.INT_MAX_VALUE = 2147483647;
    // (Magic number) DJB algorithm can't work on shorter strings (results in poor distribution
    HashCodeScoreGenerator.MIN_INPUT_LENGTH = 8;
    return HashCodeScoreGenerator;
}());
export { HashCodeScoreGenerator };//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/ee8c7def80afc00dd6e593ef12f37756d8f504ea/node_modules/@microsoft/applicationinsights-channel-js/dist-esm/TelemetryProcessors/SamplingScoreGenerators/HashCodeScoreGenerator.js.map