"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for details.
var diagnostic_channel_1 = require("diagnostic-channel");
function postgresPool1PatchFunction(originalPgPool) {
    var originalConnect = originalPgPool.prototype.connect;
    originalPgPool.prototype.connect = function connect(callback) {
        if (callback) {
            arguments[0] = diagnostic_channel_1.channel.bindToContext(callback);
        }
        originalConnect.apply(this, arguments);
    };
    return originalPgPool;
}
exports.postgresPool1 = {
    versionSpecifier: "1.x",
    patch: postgresPool1PatchFunction,
};
function enable() {
    diagnostic_channel_1.channel.registerMonkeyPatch("pg-pool", exports.postgresPool1);
}
exports.enable = enable;//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/ee8c7def80afc00dd6e593ef12f37756d8f504ea/node_modules/diagnostic-channel-publishers/dist/src/pg-pool.pub.js.map