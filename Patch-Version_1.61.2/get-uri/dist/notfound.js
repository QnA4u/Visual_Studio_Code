"use strict";
/**
 * Error subclass to use when the source does not exist at the specified endpoint.
 *
 * @param {String} message optional "message" property to set
 * @api protected
 */
Object.defineProperty(exports, "__esModule", { value: true });
class NotFoundError extends Error {
    constructor(message) {
        super(message || 'File does not exist at the specified endpoint');
        this.code = 'ENOTFOUND';
        Object.setPrototypeOf(this, new.target.prototype);
    }
}
exports.default = NotFoundError;//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/fe719cd3e5825bf14e14182fddeb88ee8daf044f/node_modules/get-uri/dist/notfound.js.map