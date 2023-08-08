"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = require("http");
/**
 * Error subclass to use when an HTTP application error has occurred.
 */
class HTTPError extends Error {
    constructor(statusCode, message = http_1.STATUS_CODES[statusCode]) {
        super(message);
        Object.setPrototypeOf(this, new.target.prototype);
        this.statusCode = statusCode;
        this.code = `E${String(message)
            .toUpperCase()
            .replace(/\s+/g, '')}`;
    }
}
exports.default = HTTPError;//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/fe719cd3e5825bf14e14182fddeb88ee8daf044f/node_modules/get-uri/dist/http-error.js.map