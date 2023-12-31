/*
 * Application Insights JavaScript SDK - Common, 2.6.4
 * Copyright (c) Microsoft and contributors. All rights reserved.
 */


import { __extendsFn } from "@microsoft/applicationinsights-shims";
import { Envelope as AIEnvelope } from '../../Interfaces/Contracts/Generated/Envelope';
import { dataSanitizeString } from './DataSanitizer';
import { toISOString } from '@microsoft/applicationinsights-core-js';
import { strNotSpecified } from '../../Constants';
var Envelope = /** @class */ (function (_super) {
    __extendsFn(Envelope, _super);
    /**
     * Constructs a new instance of telemetry data.
     */
    function Envelope(logger, data, name) {
        var _this = _super.call(this) || this;
        _this.name = dataSanitizeString(logger, name) || strNotSpecified;
        _this.data = data;
        _this.time = toISOString(new Date());
        _this.aiDataContract = {
            time: 1 /* Required */,
            iKey: 1 /* Required */,
            name: 1 /* Required */,
            sampleRate: function () {
                return (_this.sampleRate === 100) ? 4 /* Hidden */ : 1 /* Required */;
            },
            tags: 1 /* Required */,
            data: 1 /* Required */
        };
        return _this;
    }
    return Envelope;
}(AIEnvelope));
export { Envelope };//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/ee8c7def80afc00dd6e593ef12f37756d8f504ea/node_modules/@microsoft/applicationinsights-common/dist-esm/Telemetry/Common/Envelope.js.map