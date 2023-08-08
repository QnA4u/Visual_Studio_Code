"use strict";
/**
 * Copyright (c) 2019, Microsoft Corporation (MIT License).
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.pollUntil = void 0;
function pollUntil(cb, timeout, interval) {
    return new Promise(function (resolve, reject) {
        var intervalId = setInterval(function () {
            if (cb()) {
                clearInterval(intervalId);
                clearTimeout(timeoutId);
                resolve();
            }
        }, interval);
        var timeoutId = setTimeout(function () {
            clearInterval(intervalId);
            if (cb()) {
                resolve();
            }
            else {
                reject();
            }
        }, timeout);
    });
}
exports.pollUntil = pollUntil;//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/fe719cd3e5825bf14e14182fddeb88ee8daf044f/node_modules/node-pty/lib/testUtils.test.js.map