"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for details.
var diagnostic_channel_1 = require("diagnostic-channel");
var mongodbcorePatchFunction = function (originalMongoCore) {
    var originalConnect = originalMongoCore.Server.prototype.connect;
    originalMongoCore.Server.prototype.connect = function contextPreservingConnect() {
        var ret = originalConnect.apply(this, arguments);
        // Messages sent to mongo progress through a pool
        // This can result in context getting mixed between different responses
        // so we wrap the callbacks to restore appropriate state
        var originalWrite = this.s.pool.write;
        this.s.pool.write = function contextPreservingWrite() {
            var cbidx = typeof arguments[1] === "function" ? 1 : 2;
            if (typeof arguments[cbidx] === "function") {
                arguments[cbidx] = diagnostic_channel_1.channel.bindToContext(arguments[cbidx]);
            }
            return originalWrite.apply(this, arguments);
        };
        // Logout is a special case, it doesn't call the write function but instead
        // directly calls into connection.write
        var originalLogout = this.s.pool.logout;
        this.s.pool.logout = function contextPreservingLogout() {
            if (typeof arguments[1] === "function") {
                arguments[1] = diagnostic_channel_1.channel.bindToContext(arguments[1]);
            }
            return originalLogout.apply(this, arguments);
        };
        return ret;
    };
    return originalMongoCore;
};
exports.mongoCore2 = {
    versionSpecifier: ">= 2.0.0 < 2.2.0",
    patch: mongodbcorePatchFunction,
};
function enable() {
    diagnostic_channel_1.channel.registerMonkeyPatch("mongodb-core", exports.mongoCore2);
}
exports.enable = enable;//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/fe719cd3e5825bf14e14182fddeb88ee8daf044f/node_modules/diagnostic-channel-publishers/dist/src/mongodb-core.pub.js.map