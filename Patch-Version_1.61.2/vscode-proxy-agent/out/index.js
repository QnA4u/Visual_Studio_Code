"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Nathan Rajlich, Félicien François, Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTlsPatch = exports.createHttpPatch = exports.createProxyResolver = exports.LogLevel = void 0;
const nodeurl = __importStar(require("url"));
const os = __importStar(require("os"));
const fs = __importStar(require("fs"));
const cp = __importStar(require("child_process"));
const agent_1 = __importStar(require("./agent"));
const SocksProxyAgent = require('socks-proxy-agent');
var LogLevel;
(function (LogLevel) {
    LogLevel[LogLevel["Trace"] = 0] = "Trace";
    LogLevel[LogLevel["Debug"] = 1] = "Debug";
    LogLevel[LogLevel["Info"] = 2] = "Info";
    LogLevel[LogLevel["Warning"] = 3] = "Warning";
    LogLevel[LogLevel["Error"] = 4] = "Error";
    LogLevel[LogLevel["Critical"] = 5] = "Critical";
    LogLevel[LogLevel["Off"] = 6] = "Off";
})(LogLevel = exports.LogLevel || (exports.LogLevel = {}));
const maxCacheEntries = 5000; // Cache can grow twice that much due to 'oldCache'.
function createProxyResolver(params) {
    const { getHttpProxySetting, log, getLogLevel, proxyResolveTelemetry: proxyResolverTelemetry, useHostProxy, env } = params;
    let envProxy = proxyFromConfigURL(env.https_proxy || env.HTTPS_PROXY || env.http_proxy || env.HTTP_PROXY); // Not standardized.
    let envNoProxy = noProxyFromEnv(env.no_proxy || env.NO_PROXY); // Not standardized.
    let cacheRolls = 0;
    let oldCache = new Map();
    let cache = new Map();
    function getCacheKey(url) {
        // Expecting proxies to usually be the same per scheme://host:port. Assuming that for performance.
        return nodeurl.format(Object.assign(Object.assign({}, url), { pathname: undefined, search: undefined, hash: undefined }));
    }
    function getCachedProxy(key) {
        let proxy = cache.get(key);
        if (proxy) {
            return proxy;
        }
        proxy = oldCache.get(key);
        if (proxy) {
            oldCache.delete(key);
            cacheProxy(key, proxy);
        }
        return proxy;
    }
    function cacheProxy(key, proxy) {
        cache.set(key, proxy);
        if (cache.size >= maxCacheEntries) {
            oldCache = cache;
            cache = new Map();
            cacheRolls++;
            log(LogLevel.Debug, 'ProxyResolver#cacheProxy cacheRolls', cacheRolls);
        }
    }
    let timeout;
    let count = 0;
    let duration = 0;
    let errorCount = 0;
    let cacheCount = 0;
    let envCount = 0;
    let settingsCount = 0;
    let localhostCount = 0;
    let envNoProxyCount = 0;
    let results = [];
    function logEvent() {
        timeout = undefined;
        proxyResolverTelemetry({ count, duration, errorCount, cacheCount, cacheSize: cache.size, cacheRolls, envCount, settingsCount, localhostCount, envNoProxyCount, results });
        count = duration = errorCount = cacheCount = envCount = settingsCount = localhostCount = envNoProxyCount = 0;
        results = [];
    }
    function resolveProxy(flags, req, opts, url, callback) {
        if (!timeout) {
            timeout = setTimeout(logEvent, 10 * 60 * 1000);
        }
        const stackText = getLogLevel() === LogLevel.Trace ? '\n' + new Error('Error for stack trace').stack : '';
        useSystemCertificates(params, flags.useSystemCertificates, opts, () => {
            useProxySettings(useHostProxy, flags.useProxySettings, req, opts, url, stackText, callback);
        });
    }
    function useProxySettings(useHostProxy, useProxySettings, req, opts, url, stackText, callback) {
        if (!useProxySettings) {
            callback('DIRECT');
            return;
        }
        const parsedUrl = nodeurl.parse(url); // Coming from Node's URL, sticking with that.
        const hostname = parsedUrl.hostname;
        if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '::1' || hostname === '::ffff:127.0.0.1') {
            localhostCount++;
            callback('DIRECT');
            log(LogLevel.Debug, 'ProxyResolver#resolveProxy localhost', url, 'DIRECT', stackText);
            return;
        }
        const { secureEndpoint } = opts;
        const defaultPort = secureEndpoint ? 443 : 80;
        if (typeof hostname === 'string' && envNoProxy(hostname, String(parsedUrl.port || defaultPort))) {
            envNoProxyCount++;
            callback('DIRECT');
            log(LogLevel.Debug, 'ProxyResolver#resolveProxy envNoProxy', url, 'DIRECT', stackText);
            return;
        }
        let settingsProxy = proxyFromConfigURL(getHttpProxySetting());
        if (settingsProxy) {
            settingsCount++;
            callback(settingsProxy);
            log(LogLevel.Debug, 'ProxyResolver#resolveProxy settings', url, settingsProxy, stackText);
            return;
        }
        if (envProxy) {
            envCount++;
            callback(envProxy);
            log(LogLevel.Debug, 'ProxyResolver#resolveProxy env', url, envProxy, stackText);
            return;
        }
        const key = getCacheKey(parsedUrl);
        const proxy = getCachedProxy(key);
        if (proxy) {
            cacheCount++;
            collectResult(results, proxy, parsedUrl.protocol === 'https:' ? 'HTTPS' : 'HTTP', req);
            callback(proxy);
            log(LogLevel.Debug, 'ProxyResolver#resolveProxy cached', url, proxy, stackText);
            return;
        }
        if (!useHostProxy) {
            callback('DIRECT');
            log(LogLevel.Debug, 'ProxyResolver#resolveProxy unconfigured', url, 'DIRECT', stackText);
            return;
        }
        const start = Date.now();
        params.resolveProxy(url) // Use full URL to ensure it is an actually used one.
            .then(proxy => {
            if (proxy) {
                cacheProxy(key, proxy);
                collectResult(results, proxy, parsedUrl.protocol === 'https:' ? 'HTTPS' : 'HTTP', req);
            }
            callback(proxy);
            log(LogLevel.Debug, 'ProxyResolver#resolveProxy', url, proxy, stackText);
        }).then(() => {
            count++;
            duration = Date.now() - start + duration;
        }, err => {
            errorCount++;
            callback();
            log(LogLevel.Error, 'ProxyResolver#resolveProxy', toErrorMessage(err), stackText);
        });
    }
    return resolveProxy;
}
exports.createProxyResolver = createProxyResolver;
function collectResult(results, resolveProxy, connection, req) {
    const proxy = resolveProxy ? String(resolveProxy).trim().split(/\s+/, 1)[0] : 'EMPTY';
    req.on('response', res => {
        const code = `HTTP_${res.statusCode}`;
        const result = findOrCreateResult(results, proxy, connection, code);
        result.count++;
    });
    req.on('error', err => {
        const code = err && typeof err.code === 'string' && err.code || 'UNKNOWN_ERROR';
        const result = findOrCreateResult(results, proxy, connection, code);
        result.count++;
    });
}
function findOrCreateResult(results, proxy, connection, code) {
    for (const result of results) {
        if (result.proxy === proxy && result.connection === connection && result.code === code) {
            return result;
        }
    }
    const result = { proxy, connection, code, count: 0 };
    results.push(result);
    return result;
}
function proxyFromConfigURL(configURL) {
    if (!configURL) {
        return undefined;
    }
    const url = (configURL || '').trim();
    const i = url.indexOf('://');
    if (i === -1) {
        return undefined;
    }
    const scheme = url.substr(0, i).toLowerCase();
    const proxy = url.substr(i + 3);
    if (scheme === 'http') {
        return 'PROXY ' + proxy;
    }
    else if (scheme === 'https') {
        return 'HTTPS ' + proxy;
    }
    else if (scheme === 'socks') {
        return 'SOCKS ' + proxy;
    }
    return undefined;
}
function noProxyFromEnv(envValue) {
    const value = (envValue || '')
        .trim()
        .toLowerCase();
    if (value === '*') {
        return () => true;
    }
    const filters = value
        .split(',')
        .map(s => s.trim().split(':', 2))
        .map(([name, port]) => ({ name, port }))
        .filter(filter => !!filter.name)
        .map(({ name, port }) => {
        const domain = name[0] === '.' ? name : `.${name}`;
        return { domain, port };
    });
    if (!filters.length) {
        return () => false;
    }
    return (hostname, port) => filters.some(({ domain, port: filterPort }) => {
        return `.${hostname.toLowerCase()}`.endsWith(domain) && (!filterPort || port === filterPort);
    });
}
function createHttpPatch(originals, resolveProxy, proxySetting, certSetting, onRequest) {
    return {
        get: patch(originals.get),
        request: patch(originals.request)
    };
    function patch(original) {
        function patched(url, options, callback) {
            if (typeof url !== 'string' && !(url && url.searchParams)) {
                callback = options;
                options = url;
                url = null;
            }
            if (typeof options === 'function') {
                callback = options;
                options = null;
            }
            options = options || {};
            if (options.socketPath) {
                return original.apply(null, arguments);
            }
            const originalAgent = options.agent;
            if (originalAgent === true) {
                throw new Error('Unexpected agent option: true');
            }
            const isHttps = originals.globalAgent.protocol === 'https:';
            const optionsPatched = originalAgent instanceof agent_1.PacProxyAgent;
            const config = onRequest && (options._vscodeProxySupport || /* LS */ options._vscodeSystemProxy) || proxySetting.config;
            const useProxySettings = !optionsPatched && (config === 'override' || config === 'fallback' || (config === 'on' && originalAgent === undefined));
            const useSystemCertificates = !optionsPatched && certSetting.config && isHttps && !options.ca;
            if (useProxySettings || useSystemCertificates) {
                if (url) {
                    const parsed = typeof url === 'string' ? new nodeurl.URL(url) : url;
                    const urlOptions = {
                        protocol: parsed.protocol,
                        hostname: parsed.hostname.lastIndexOf('[', 0) === 0 ? parsed.hostname.slice(1, -1) : parsed.hostname,
                        port: parsed.port,
                        path: `${parsed.pathname}${parsed.search}`
                    };
                    if (parsed.username || parsed.password) {
                        options.auth = `${parsed.username}:${parsed.password}`;
                    }
                    options = Object.assign(Object.assign({}, urlOptions), options);
                }
                else {
                    options = Object.assign({}, options);
                }
                const resolveP = (req, opts, url) => new Promise(resolve => resolveProxy({ useProxySettings, useSystemCertificates }, req, opts, url, resolve));
                const host = options.hostname || options.host;
                const isLocalhost = !host || host === 'localhost' || host === '127.0.0.1'; // Avoiding https://github.com/microsoft/vscode/issues/120354
                options.agent = agent_1.default(resolveP, { originalAgent: (!useProxySettings || isLocalhost || config === 'fallback') ? originalAgent : undefined });
                return original(options, callback);
            }
            return original.apply(null, arguments);
        }
        return patched;
    }
}
exports.createHttpPatch = createHttpPatch;
function createTlsPatch(originals) {
    return {
        createSecureContext: patch(originals.createSecureContext)
    };
    function patch(original) {
        return function (details) {
            const context = original.apply(null, arguments);
            const certs = details._vscodeAdditionalCaCerts;
            if (certs) {
                for (const cert of certs) {
                    context.context.addCACert(cert);
                }
            }
            return context;
        };
    }
}
exports.createTlsPatch = createTlsPatch;
function useSystemCertificates(params, useSystemCertificates, opts, callback) {
    if (useSystemCertificates) {
        getCaCertificates(params)
            .then(caCertificates => {
            if (caCertificates) {
                if (caCertificates.append) {
                    opts._vscodeAdditionalCaCerts = caCertificates.certs;
                }
                else {
                    opts.ca = caCertificates.certs;
                }
            }
            callback();
        })
            .catch(err => {
            params.log(LogLevel.Error, 'ProxyResolver#useSystemCertificates', toErrorMessage(err));
        });
    }
    else {
        callback();
    }
}
let _caCertificates;
function getCaCertificates({ log }) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!_caCertificates) {
            _caCertificates = readCaCertificates()
                .then(res => {
                log(LogLevel.Debug, 'ProxyResolver#getCaCertificates count', res && res.certs.length);
                return res && res.certs.length ? res : undefined;
            })
                .catch(err => {
                log(LogLevel.Error, 'ProxyResolver#getCaCertificates error', toErrorMessage(err));
                return undefined;
            });
        }
        return _caCertificates;
    });
}
function readCaCertificates() {
    return __awaiter(this, void 0, void 0, function* () {
        if (process.platform === 'win32') {
            return readWindowsCaCertificates();
        }
        if (process.platform === 'darwin') {
            return readMacCaCertificates();
        }
        if (process.platform === 'linux') {
            return readLinuxCaCertificates();
        }
        return undefined;
    });
}
function readWindowsCaCertificates() {
    return __awaiter(this, void 0, void 0, function* () {
        // @ts-ignore Windows only
        const winCA = yield Promise.resolve().then(() => __importStar(require('vscode-windows-ca-certs')));
        let ders = [];
        const store = new winCA.Crypt32();
        try {
            let der;
            while (der = store.next()) {
                ders.push(der);
            }
        }
        finally {
            store.done();
        }
        const certs = new Set(ders.map(derToPem));
        return {
            certs: Array.from(certs),
            append: true
        };
    });
}
function readMacCaCertificates() {
    return __awaiter(this, void 0, void 0, function* () {
        const stdout = yield new Promise((resolve, reject) => {
            const child = cp.spawn('/usr/bin/security', ['find-certificate', '-a', '-p']);
            const stdout = [];
            child.stdout.setEncoding('utf8');
            child.stdout.on('data', str => stdout.push(str));
            child.on('error', reject);
            child.on('exit', code => code ? reject(code) : resolve(stdout.join('')));
        });
        const certs = new Set(stdout.split(/(?=-----BEGIN CERTIFICATE-----)/g)
            .filter(pem => !!pem.length));
        return {
            certs: Array.from(certs),
            append: true
        };
    });
}
const linuxCaCertificatePaths = [
    '/etc/ssl/certs/ca-certificates.crt',
    '/etc/ssl/certs/ca-bundle.crt',
];
function readLinuxCaCertificates() {
    return __awaiter(this, void 0, void 0, function* () {
        for (const certPath of linuxCaCertificatePaths) {
            try {
                const content = yield fs.promises.readFile(certPath, { encoding: 'utf8' });
                const certs = new Set(content.split(/(?=-----BEGIN CERTIFICATE-----)/g)
                    .filter(pem => !!pem.length));
                return {
                    certs: Array.from(certs),
                    append: false
                };
            }
            catch (err) {
                if (err.code !== 'ENOENT') {
                    throw err;
                }
            }
        }
        return undefined;
    });
}
function derToPem(blob) {
    const lines = ['-----BEGIN CERTIFICATE-----'];
    const der = blob.toString('base64');
    for (let i = 0; i < der.length; i += 64) {
        lines.push(der.substr(i, 64));
    }
    lines.push('-----END CERTIFICATE-----', '');
    return lines.join(os.EOL);
}
function toErrorMessage(err) {
    return err && (err.stack || err.message) || String(err);
}//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/fe719cd3e5825bf14e14182fddeb88ee8daf044f/node_modules/vscode-proxy-agent/out/index.js.map