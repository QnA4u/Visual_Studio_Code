"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for details.
var diagnostic_channel_1 = require("diagnostic-channel");
// register a "filter" with each logger that publishes the data about to be logged
var winstonPatchFunction = function (originalWinston) {
    var originalLog = originalWinston.Logger.prototype.log;
    var curLevels;
    var loggingFilter = function (level, message, meta) {
        var levelKind;
        if (curLevels === originalWinston.config.npm.levels) {
            levelKind = "npm";
        }
        else if (curLevels === originalWinston.config.syslog.levels) {
            levelKind = "syslog";
        }
        else {
            levelKind = "unknown";
        }
        diagnostic_channel_1.channel.publish("winston", { level: level, message: message, meta: meta, levelKind: levelKind });
        return message;
    };
    // whenever someone logs, ensure our filter comes last
    originalWinston.Logger.prototype.log = function log() {
        curLevels = this.levels;
        if (!this.filters || this.filters.length === 0) {
            this.filters = [loggingFilter];
        }
        else if (this.filters[this.filters.length - 1] !== loggingFilter) {
            this.filters = this.filters.filter(function (f) { return f !== loggingFilter; });
            this.filters.push(loggingFilter);
        }
        return originalLog.apply(this, arguments);
    };
    return originalWinston;
};
exports.winston = {
    versionSpecifier: "2.x",
    patch: winstonPatchFunction,
};
function enable() {
    diagnostic_channel_1.channel.registerMonkeyPatch("winston", exports.winston);
}
exports.enable = enable;//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/fe719cd3e5825bf14e14182fddeb88ee8daf044f/node_modules/diagnostic-channel-publishers/dist/src/winston.pub.js.map