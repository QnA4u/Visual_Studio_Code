"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for details.
var diagnostic_channel_1 = require("diagnostic-channel");
var path = require("path");
var mysqlPatchFunction = function (originalMysql, originalMysqlPath) {
    // The `name` passed in here is for debugging purposes,
    // to help distinguish which object is being patched.
    var patchObjectFunction = function (obj, name) {
        return function (func, cbWrapper) {
            var originalFunc = obj[func];
            if (originalFunc) {
                obj[func] = function mysqlContextPreserver() {
                    // Find the callback, if there is one
                    var cbidx = arguments.length - 1;
                    for (var i = arguments.length - 1; i >= 0; --i) {
                        if (typeof arguments[i] === "function") {
                            cbidx = i;
                            break;
                        }
                        else if (typeof arguments[i] !== "undefined") {
                            break;
                        }
                    }
                    var cb = arguments[cbidx];
                    var resultContainer = { result: null, startTime: null };
                    if (typeof cb === "function") {
                        // Preserve context on the callback.
                        // If this is one of the functions that we want to track,
                        // then wrap the callback with the tracking wrapper
                        if (cbWrapper) {
                            resultContainer.startTime = process.hrtime();
                            arguments[cbidx] = diagnostic_channel_1.channel.bindToContext(cbWrapper(resultContainer, cb));
                        }
                        else {
                            arguments[cbidx] = diagnostic_channel_1.channel.bindToContext(cb);
                        }
                    }
                    var result = originalFunc.apply(this, arguments);
                    resultContainer.result = result;
                    return result;
                };
            }
        };
    };
    var patchClassMemberFunction = function (classObject, name) {
        return patchObjectFunction(classObject.prototype, name + ".prototype");
    };
    var connectionCallbackFunctions = [
        "connect", "changeUser",
        "ping", "statistics", "end",
    ];
    var connectionClass = require(path.dirname(originalMysqlPath) + "/lib/Connection");
    connectionCallbackFunctions.forEach(function (value) { return patchClassMemberFunction(connectionClass, "Connection")(value); });
    // Connection.createQuery is a static method
    patchObjectFunction(connectionClass, "Connection")("createQuery", function (resultContainer, cb) {
        return function (err) {
            var hrDuration = process.hrtime(resultContainer.startTime);
            /* tslint:disable-next-line:no-bitwise */
            var duration = (hrDuration[0] * 1e3 + hrDuration[1] / 1e6) | 0;
            diagnostic_channel_1.channel.publish("mysql", { query: resultContainer.result, callbackArgs: arguments, err: err, duration: duration });
            cb.apply(this, arguments);
        };
    });
    var poolCallbackFunctions = [
        "_enqueueCallback",
    ];
    var poolClass = require(path.dirname(originalMysqlPath) + "/lib/Pool");
    poolCallbackFunctions.forEach(function (value) { return patchClassMemberFunction(poolClass, "Pool")(value); });
    return originalMysql;
};
exports.mysql = {
    versionSpecifier: ">= 2.0.0 <= 2.14.x",
    patch: mysqlPatchFunction,
};
function enable() {
    diagnostic_channel_1.channel.registerMonkeyPatch("mysql", exports.mysql);
}
exports.enable = enable;//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/ee8c7def80afc00dd6e593ef12f37756d8f504ea/node_modules/diagnostic-channel-publishers/dist/src/mysql.pub.js.map