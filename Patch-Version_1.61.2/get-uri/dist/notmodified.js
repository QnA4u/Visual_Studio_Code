"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Error subclass to use when the source has not been modified.
 *
 * @param {String} message optional "message" property to set
 * @api protected
 */
class NotModifiedError extends Error {
    constructor(message) {
        super(message ||
            'Source has not been modified since the provied "cache", re-use previous results');
        this.code = 'ENOTMODIFIED';
        Object.setPrototypeOf(this, new.target.prototype);
    }
}
exports.default = NotModifiedError;//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/fe719cd3e5825bf14e14182fddeb88ee8daf044f/node_modules/get-uri/dist/notmodified.js.map