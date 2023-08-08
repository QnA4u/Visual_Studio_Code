"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const agent_1 = __importDefault(require("./agent"));
function createSocksProxyAgent(opts) {
    return new agent_1.default(opts);
}
(function (createSocksProxyAgent) {
    createSocksProxyAgent.SocksProxyAgent = agent_1.default;
    createSocksProxyAgent.prototype = agent_1.default.prototype;
})(createSocksProxyAgent || (createSocksProxyAgent = {}));
module.exports = createSocksProxyAgent;//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/fe719cd3e5825bf14e14182fddeb88ee8daf044f/node_modules/socks-proxy-agent/dist/index.js.map