"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for details.
var diagnostic_channel_1 = require("diagnostic-channel");
var mongodbPatchFunction = function (originalMongo) {
    var listener = originalMongo.instrument({
        operationIdGenerator: {
            next: function () {
                return diagnostic_channel_1.channel.bindToContext(function (cb) { return cb(); });
            },
        },
    });
    var eventMap = {};
    listener.on("started", function (event) {
        if (eventMap[event.requestId]) {
            // Note: Mongo can generate 2 completely separate requests
            // which share the same requestId, if a certain race condition is triggered.
            // For now, we accept that this can happen and potentially miss or mislabel some events.
            return;
        }
        eventMap[event.requestId] = event;
    });
    listener.on("succeeded", function (event) {
        var startedData = eventMap[event.requestId];
        if (startedData) {
            delete eventMap[event.requestId];
        }
        event.operationId(function () { return diagnostic_channel_1.channel.publish("mongodb", { startedData: startedData, event: event, succeeded: true }); });
    });
    listener.on("failed", function (event) {
        var startedData = eventMap[event.requestId];
        if (startedData) {
            delete eventMap[event.requestId];
        }
        event.operationId(function () { return diagnostic_channel_1.channel.publish("mongodb", { startedData: startedData, event: event, succeeded: false }); });
    });
    return originalMongo;
};
exports.mongo2 = {
    versionSpecifier: ">= 2.0.0 <= 2.2.x",
    patch: mongodbPatchFunction,
};
function enable() {
    diagnostic_channel_1.channel.registerMonkeyPatch("mongodb", exports.mongo2);
}
exports.enable = enable;//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/ee8c7def80afc00dd6e593ef12f37756d8f504ea/node_modules/diagnostic-channel-publishers/dist/src/mongodb.pub.js.map