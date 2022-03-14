"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isRailway = exports.isPkgBundle = exports.isGitLabCI = exports.isGitHubActions = exports.isHeroku = exports.isVercel = exports.isNow = exports.isIp = exports.lowercaseHeaderKeys = exports.applyFilter = exports.formatV2rayConfig = exports.ensureConfigFolder = exports.normalizeClashProxyGroupConfig = exports.decodeStringList = exports.pickAndFormatStringList = exports.toYaml = exports.generateClashProxyGroup = exports.getClashNodeNames = exports.getNodeNames = exports.getShadowsocksNodesJSON = exports.getQuantumultXNodes = exports.getQuantumultNodes = exports.getV2rayNNodes = exports.getShadowsocksrNodes = exports.getShadowsocksNodes = exports.fromBase64 = exports.toBase64 = exports.fromUrlSafeBase64 = exports.toUrlSafeBase64 = exports.getMellowNodes = exports.getClashNodes = exports.getSurgeExtend = exports.getSurgeNodes = exports.getShadowsocksJSONConfig = exports.getUrl = exports.getDownloadUrl = void 0;
const logger_1 = require("@surgio/logger");
const assert_1 = __importDefault(require("assert"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const lodash_1 = __importDefault(require("lodash"));
const os_1 = __importDefault(require("os"));
const path_1 = require("path");
const query_string_1 = __importDefault(require("query-string"));
const url_1 = require("url");
const urlsafe_base64_1 = __importDefault(require("urlsafe-base64"));
const yaml_1 = __importDefault(require("yaml"));
const net_1 = __importDefault(require("net"));
const types_1 = require("../types");
const cache_1 = require("./cache");
const constant_1 = require("../constant");
const filter_1 = require("./filter");
const http_client_1 = __importDefault(require("./http-client"));
const v2ray_1 = require("./v2ray");
const logger = (0, logger_1.createLogger)({ service: 'surgio:utils' });
const getDownloadUrl = (baseUrl = '/', artifactName, inline = true, accessToken) => {
    let urlSearchParams;
    let name;
    if (artifactName.includes('?')) {
        urlSearchParams = new url_1.URLSearchParams(artifactName.split('?')[1]);
        name = artifactName.split('?')[0];
    }
    else {
        urlSearchParams = new url_1.URLSearchParams();
        name = artifactName;
    }
    if (accessToken) {
        urlSearchParams.set('access_token', accessToken);
    }
    if (!inline) {
        urlSearchParams.set('dl', '1');
    }
    const query = urlSearchParams.toString();
    return `${baseUrl}${name}${query ? '?' + query : ''}`;
};
exports.getDownloadUrl = getDownloadUrl;
const getUrl = (baseUrl, path, accessToken) => {
    path = path.replace(/^\//, '');
    const url = new url_1.URL(path, baseUrl);
    if (accessToken) {
        url.searchParams.set('access_token', accessToken);
    }
    return url.toString();
};
exports.getUrl = getUrl;
const getShadowsocksJSONConfig = async (url, udpRelay) => {
    (0, assert_1.default)(url, '未指定订阅地址 url');
    async function requestConfigFromRemote() {
        const response = cache_1.ConfigCache.has(url)
            ? JSON.parse(cache_1.ConfigCache.get(url))
            : await (async () => {
                const res = await http_client_1.default.get(url);
                cache_1.ConfigCache.set(url, res.body);
                return JSON.parse(res.body);
            })();
        return response.configs.map((item) => {
            const nodeConfig = {
                nodeName: item.remarks,
                type: types_1.NodeTypeEnum.Shadowsocks,
                hostname: item.server,
                port: item.server_port,
                method: item.method,
                password: item.password,
            };
            if (typeof udpRelay === 'boolean') {
                nodeConfig['udp-relay'] = udpRelay;
            }
            if (item.plugin === 'obfs-local') {
                const obfs = item.plugin_opts.match(/obfs=(\w+)/);
                const obfsHost = item.plugin_opts.match(/obfs-host=(.+)$/);
                if (obfs) {
                    nodeConfig.obfs = obfs[1];
                    nodeConfig['obfs-host'] = obfsHost ? obfsHost[1] : 'www.bing.com';
                }
            }
            return nodeConfig;
        });
    }
    return await requestConfigFromRemote();
};
exports.getShadowsocksJSONConfig = getShadowsocksJSONConfig;
/**
 * @see https://manual.nssurge.com/policy/proxy.html
 */
const getSurgeNodes = function (list, filter) {
    // istanbul ignore next
    if (arguments.length === 2 && typeof filter === 'undefined') {
        throw new Error(constant_1.ERR_INVALID_FILTER);
    }
    const result = (0, exports.applyFilter)(list, filter)
        .map((nodeConfig) => {
        var _a, _b, _c, _d, _e;
        switch (nodeConfig.type) {
            case types_1.NodeTypeEnum.Shadowsocks: {
                const config = nodeConfig;
                if (config.obfs && ['ws', 'wss'].includes(config.obfs)) {
                    logger.warn(`不支持为 Surge 生成 v2ray-plugin 的 Shadowsocks 节点，节点 ${nodeConfig.nodeName} 会被省略`);
                    return void 0;
                }
                // Native support for Shadowsocks
                if (((_a = nodeConfig === null || nodeConfig === void 0 ? void 0 : nodeConfig.surgeConfig) === null || _a === void 0 ? void 0 : _a.shadowsocksFormat) === 'ss') {
                    return [
                        config.nodeName,
                        [
                            'ss',
                            config.hostname,
                            config.port,
                            'encrypt-method=' + config.method,
                            ...(0, exports.pickAndFormatStringList)(config, [
                                'password',
                                'udp-relay',
                                'obfs',
                                'obfs-host',
                                'tfo',
                                'mptcp',
                            ]),
                            ...(typeof config.testUrl === 'string'
                                ? [`test-url=${config.testUrl}`]
                                : []),
                            ...(typeof config.underlyingProxy === 'string'
                                ? [`underlying-proxy=${config.underlyingProxy}`]
                                : []),
                        ].join(', '),
                    ].join(' = ');
                }
                // Using custom format
                return [
                    config.nodeName,
                    [
                        'custom',
                        config.hostname,
                        config.port,
                        config.method,
                        config.password,
                        'https://raw.githubusercontent.com/ConnersHua/SSEncrypt/master/SSEncrypt.module',
                        ...(0, exports.pickAndFormatStringList)(config, [
                            'udp-relay',
                            'obfs',
                            'obfs-host',
                            'tfo',
                            'mptcp',
                        ]),
                        ...(typeof config.testUrl === 'string'
                            ? [`test-url=${config.testUrl}`]
                            : []),
                        ...(typeof config.underlyingProxy === 'string'
                            ? [`underlying-proxy=${config.underlyingProxy}`]
                            : []),
                    ].join(', '),
                ].join(' = ');
            }
            case types_1.NodeTypeEnum.HTTPS: {
                const config = nodeConfig;
                return [
                    config.nodeName,
                    [
                        'https',
                        config.hostname,
                        config.port,
                        config.username,
                        config.password,
                        ...(typeof config.skipCertVerify === 'boolean'
                            ? [`skip-cert-verify=${config.skipCertVerify}`]
                            : []),
                        ...(typeof config.underlyingProxy === 'string'
                            ? [`underlying-proxy=${config.underlyingProxy}`]
                            : []),
                        ...(typeof config.testUrl === 'string'
                            ? [`test-url=${config.testUrl}`]
                            : []),
                        ...(0, exports.pickAndFormatStringList)(config, [
                            'sni',
                            'tfo',
                            'mptcp',
                            'tls13',
                        ]),
                    ].join(', '),
                ].join(' = ');
            }
            case types_1.NodeTypeEnum.HTTP: {
                const config = nodeConfig;
                return [
                    config.nodeName,
                    [
                        'http',
                        config.hostname,
                        config.port,
                        config.username,
                        config.password,
                        ...(typeof config.underlyingProxy === 'string'
                            ? [`underlying-proxy=${config.underlyingProxy}`]
                            : []),
                        ...(typeof config.testUrl === 'string'
                            ? [`test-url=${config.testUrl}`]
                            : []),
                        ...(0, exports.pickAndFormatStringList)(config, ['tfo', 'mptcp']),
                    ].join(', '),
                ].join(' = ');
            }
            case types_1.NodeTypeEnum.Snell: {
                const config = nodeConfig;
                return [
                    config.nodeName,
                    [
                        'snell',
                        config.hostname,
                        config.port,
                        ...(typeof config.underlyingProxy === 'string'
                            ? [`underlying-proxy=${config.underlyingProxy}`]
                            : []),
                        ...(typeof config.testUrl === 'string'
                            ? [`test-url=${config.testUrl}`]
                            : []),
                        ...(0, exports.pickAndFormatStringList)(config, [
                            'psk',
                            'obfs',
                            'obfs-host',
                            'version',
                            'tfo',
                            'mptcp',
                        ]),
                    ].join(', '),
                ].join(' = ');
            }
            case types_1.NodeTypeEnum.Wireguard: {
                const config = nodeConfig;
                return [
                    config.nodeName,
                    [
                        'wireguard',
                        `section-name=wg_${config.nodeName}`
                    ].join(', '),
                ].join(' = ');
            }
            case types_1.NodeTypeEnum.Shadowsocksr: {
                const config = nodeConfig;
                // istanbul ignore next
                if (!config.binPath) {
                    throw new Error('请按照文档 http://url.royli.dev/vdGh2 添加 Shadowsocksr 二进制文件路径');
                }
                const args = [
                    '-s',
                    config.hostname,
                    '-p',
                    `${config.port}`,
                    '-m',
                    config.method,
                    '-o',
                    config.obfs,
                    '-O',
                    config.protocol,
                    '-k',
                    config.password,
                    '-l',
                    `${config.localPort}`,
                    '-b',
                    '127.0.0.1',
                ];
                if (config.protoparam) {
                    args.push('-G', config.protoparam);
                }
                if (config.obfsparam) {
                    args.push('-g', config.obfsparam);
                }
                const configString = [
                    'external',
                    `exec = ${JSON.stringify(config.binPath)}`,
                    ...args.map((arg) => `args = ${JSON.stringify(arg)}`),
                    `local-port = ${config.localPort}`,
                ];
                if (config.localPort === 0) {
                    throw new Error(`为 Surge 生成 SSR 配置时必须为 Provider ${(_b = config.provider) === null || _b === void 0 ? void 0 : _b.name} 设置 startPort，参考 http://url.royli.dev/bWcpe`);
                }
                if (config.hostnameIp && config.hostnameIp.length) {
                    configString.push(...config.hostnameIp.map((item) => `addresses = ${item}`));
                }
                if ((0, exports.isIp)(config.hostname)) {
                    configString.push(`addresses = ${config.hostname}`);
                }
                return [config.nodeName, configString.join(', ')].join(' = ');
            }
            case types_1.NodeTypeEnum.Vmess: {
                const config = nodeConfig;
                if (((_c = nodeConfig === null || nodeConfig === void 0 ? void 0 : nodeConfig.surgeConfig) === null || _c === void 0 ? void 0 : _c.v2ray) === 'native') {
                    // Native support for vmess
                    const configList = [
                        'vmess',
                        config.hostname,
                        config.port,
                        `username=${config.uuid}`,
                    ];
                    if (['chacha20-ietf-poly1305', 'aes-128-gcm'].includes(config.method)) {
                        configList.push(`encrypt-method=${config.method}`);
                    }
                    function getHeader(wsHeaders) {
                        return Object.keys(wsHeaders)
                            .map((headerKey) => `${headerKey}:${wsHeaders[headerKey]}`)
                            .join('|');
                    }
                    if (config.network === 'ws') {
                        configList.push('ws=true');
                        configList.push(`ws-path=${config.path}`);
                        configList.push('ws-headers=' +
                            JSON.stringify(getHeader(Object.assign({ host: config.host || config.hostname, 'user-agent': constant_1.OBFS_UA }, lodash_1.default.omit(config.wsHeaders, ['host'])))));
                    }
                    if (config.tls) {
                        configList.push('tls=true', ...(typeof config.tls13 === 'boolean'
                            ? [`tls13=${config.tls13}`]
                            : []), ...(typeof config.skipCertVerify === 'boolean'
                            ? [`skip-cert-verify=${config.skipCertVerify}`]
                            : []), ...(config.host ? [`sni=${config.host}`] : []));
                    }
                    if (typeof config.tfo === 'boolean') {
                        configList.push(`tfo=${config.tfo}`);
                    }
                    if (typeof config.mptcp === 'boolean') {
                        configList.push(`mptcp=${config.mptcp}`);
                    }
                    if (config['underlyingProxy']) {
                        configList.push(`underlying-proxy=${config['underlyingProxy']}`);
                    }
                    if (config['testUrl']) {
                        configList.push(`test-url=${config['testUrl']}`);
                    }
                    if ((_d = nodeConfig === null || nodeConfig === void 0 ? void 0 : nodeConfig.surgeConfig) === null || _d === void 0 ? void 0 : _d.vmessAEAD) {
                        configList.push('vmess-aead=true');
                    }
                    else {
                        configList.push('vmess-aead=false');
                    }
                    return [config.nodeName, configList.join(', ')].join(' = ');
                }
                else {
                    // Using external provider
                    // istanbul ignore next
                    if (!config.binPath) {
                        throw new Error('请按照文档 http://url.royli.dev/vdGh2 添加 V2Ray 二进制文件路径');
                    }
                    if (config.localPort === 0) {
                        throw new Error(`为 Surge 生成 Vmess 配置时必须为 Provider ${(_e = config.provider) === null || _e === void 0 ? void 0 : _e.name} 设置 startPort，参考 http://url.royli.dev/bWcpe`);
                    }
                    const jsonFileName = `v2ray_${config.localPort}_${config.hostname}_${config.port}.json`;
                    const jsonFilePath = (0, path_1.join)((0, exports.ensureConfigFolder)(), jsonFileName);
                    const jsonFile = (0, exports.formatV2rayConfig)(config.localPort, nodeConfig);
                    const args = [
                        '--config',
                        jsonFilePath.replace(os_1.default.homedir(), '$HOME'),
                    ];
                    const configString = [
                        'external',
                        `exec = ${JSON.stringify(config.binPath)}`,
                        ...args.map((arg) => `args = ${JSON.stringify(arg)}`),
                        `local-port = ${config.localPort}`,
                    ];
                    if (config.hostnameIp && config.hostnameIp.length) {
                        configString.push(...config.hostnameIp.map((item) => `addresses = ${item}`));
                    }
                    if ((0, exports.isIp)(config.hostname)) {
                        configString.push(`addresses = ${config.hostname}`);
                    }
                    // istanbul ignore next
                    if (process.env.NODE_ENV !== 'test') {
                        fs_extra_1.default.writeJSONSync(jsonFilePath, jsonFile);
                    }
                    return [config.nodeName, configString.join(', ')].join(' = ');
                }
            }
            case types_1.NodeTypeEnum.Trojan: {
                const configList = [
                    'trojan',
                    nodeConfig.hostname,
                    `${nodeConfig.port}`,
                    `password=${nodeConfig.password}`,
                    ...(0, exports.pickAndFormatStringList)(nodeConfig, [
                        'tfo',
                        'mptcp',
                        'sni',
                        'tls13',
                    ]),
                    ...(typeof nodeConfig.testUrl === 'string'
                        ? [`test-url=${nodeConfig.testUrl}`]
                        : []),
                    ...(typeof nodeConfig.underlyingProxy === 'string'
                        ? [`underlying-proxy=${nodeConfig.underlyingProxy}`]
                        : []),
                    ...(typeof nodeConfig.skipCertVerify === 'boolean'
                        ? [`skip-cert-verify=${nodeConfig.skipCertVerify}`]
                        : []),
                ];
                return [nodeConfig.nodeName, configList.join(', ')].join(' = ');
            }
            case types_1.NodeTypeEnum.Socks5: {
                const config = [
                    nodeConfig.tls === true ? 'socks5-tls' : 'socks5',
                    nodeConfig.hostname,
                    nodeConfig.port,
                    ...(typeof nodeConfig.underlyingProxy === 'string'
                        ? [`underlying-proxy=${nodeConfig.underlyingProxy}`]
                        : []),
                    ...(typeof nodeConfig.testUrl === 'string'
                        ? [`test-url=${nodeConfig.testUrl}`]
                        : []),
                    ...(0, exports.pickAndFormatStringList)(nodeConfig, [
                        'username',
                        'password',
                        'sni',
                        'tfo',
                        'mptcp',
                        'tls13',
                    ]),
                ];
                if (nodeConfig.tls === true) {
                    config.push(...(typeof nodeConfig.skipCertVerify === 'boolean'
                        ? [`skip-cert-verify=${nodeConfig.skipCertVerify}`]
                        : []), ...(typeof nodeConfig.clientCert === 'string'
                        ? [`client-cert=${nodeConfig.clientCert}`]
                        : []));
                }
                return [nodeConfig.nodeName, config.join(', ')].join(' = ');
            }
            // istanbul ignore next
            default:
                logger.warn(`不支持为 Surge 生成 ${nodeConfig.type} 的节点，节点 ${nodeConfig.nodeName} 会被省略`);
                return void 0;
        }
    })
        .filter((item) => item !== undefined);
    return result.join('\n');
};
exports.getSurgeNodes = getSurgeNodes;
const getSurgeExtend = function (list, filter) {
    // istanbul ignore next
    if (arguments.length === 2 && typeof filter === 'undefined') {
        throw new Error(constant_1.ERR_INVALID_FILTER);
    }
    const result = (0, exports.applyFilter)(list, filter)
        .map((nodeConfig) => {
        switch (nodeConfig.type) {
            case types_1.NodeTypeEnum.Wireguard: {
                const config = nodeConfig;
                return [
                    `[WireGuard wg_${config.nodeName}]`,
                    `private-key = ${config.privateKey}`,
                    `self-ip = ${config.selfIp}`,
                    `dns-server = ${config.dns}`,
                    `mtu = ${config.mtu}`,
                    `peer = (public-key = ${config.publicKey}, allowed-ips = 0.0.0.0/0, endpoint = ${config.hostname})`
                ].join('\n');
            }
            // istanbul ignore next
            default:
                return void 0;
        }
    })
        .filter((item) => item !== undefined);
    return result.join('\n');
};
exports.getSurgeExtend = getSurgeExtend;
const getClashNodes = function (list, filter) {
    // istanbul ignore next
    if (arguments.length === 2 && typeof filter === 'undefined') {
        throw new Error(constant_1.ERR_INVALID_FILTER);
    }
    return (0, exports.applyFilter)(list, filter)
        .map((nodeConfig) => {
        var _a, _b, _c, _d, _e;
        // istanbul ignore next
        if (nodeConfig.enable === false) {
            return null;
        }
        switch (nodeConfig.type) {
            case types_1.NodeTypeEnum.Shadowsocks:
                return Object.assign(Object.assign({ type: 'ss', cipher: nodeConfig.method, name: nodeConfig.nodeName, password: nodeConfig.password, port: nodeConfig.port, server: nodeConfig.hostname, udp: nodeConfig['udp-relay'] === true }, (nodeConfig.obfs && ['tls', 'http'].includes(nodeConfig.obfs)
                    ? {
                        plugin: 'obfs',
                        'plugin-opts': {
                            mode: nodeConfig.obfs,
                            host: nodeConfig['obfs-host'],
                        },
                    }
                    : null)), (nodeConfig.obfs && ['ws', 'wss'].includes(nodeConfig.obfs)
                    ? {
                        plugin: 'v2ray-plugin',
                        'plugin-opts': Object.assign(Object.assign({ mode: 'websocket', tls: nodeConfig.obfs === 'wss' }, (typeof nodeConfig.skipCertVerify === 'boolean' &&
                            nodeConfig.obfs === 'wss'
                            ? {
                                'skip-cert-verify': nodeConfig.skipCertVerify,
                            }
                            : null)), { host: nodeConfig['obfs-host'], path: nodeConfig['obfs-uri'] || '/', mux: typeof nodeConfig.mux === 'boolean'
                                ? nodeConfig.mux
                                : false, headers: lodash_1.default.omit(nodeConfig.wsHeaders || {}, ['host']) }),
                    }
                    : null));
            case types_1.NodeTypeEnum.Vmess:
                return Object.assign(Object.assign(Object.assign(Object.assign({ type: 'vmess', cipher: nodeConfig.method, name: nodeConfig.nodeName, server: nodeConfig.hostname, port: nodeConfig.port, udp: nodeConfig['udp-relay'] === true, uuid: nodeConfig.uuid, alterId: nodeConfig.alterId }, (nodeConfig.network === 'tcp'
                    ? null
                    : {
                        network: nodeConfig.network,
                    })), { tls: nodeConfig.tls }), (typeof nodeConfig.skipCertVerify === 'boolean' && nodeConfig.tls
                    ? {
                        'skip-cert-verify': nodeConfig.skipCertVerify,
                    }
                    : null)), (nodeConfig.network === 'ws'
                    ? {
                        'ws-opts': {
                            path: nodeConfig.path,
                            headers: Object.assign(Object.assign({}, (nodeConfig.host ? { host: nodeConfig.host } : null)), lodash_1.default.omit(nodeConfig.wsHeaders, ['host'])),
                        },
                    }
                    : null));
            case types_1.NodeTypeEnum.Shadowsocksr: {
                const ssrFormat = (_a = nodeConfig === null || nodeConfig === void 0 ? void 0 : nodeConfig.clashConfig) === null || _a === void 0 ? void 0 : _a.ssrFormat;
                return Object.assign(Object.assign({ type: 'ssr', name: nodeConfig.nodeName, server: nodeConfig.hostname, port: nodeConfig.port, password: nodeConfig.password, obfs: nodeConfig.obfs, protocol: nodeConfig.protocol, cipher: nodeConfig.method }, (ssrFormat === 'native'
                    ? {
                        'obfs-param': (_b = nodeConfig.obfsparam) !== null && _b !== void 0 ? _b : '',
                        'protocol-param': (_c = nodeConfig.protoparam) !== null && _c !== void 0 ? _c : '',
                    }
                    : {
                        obfsparam: (_d = nodeConfig.obfsparam) !== null && _d !== void 0 ? _d : '',
                        protocolparam: (_e = nodeConfig.protoparam) !== null && _e !== void 0 ? _e : '',
                    })), { udp: nodeConfig['udp-relay'] === true });
            }
            case types_1.NodeTypeEnum.Snell:
                return Object.assign({ type: 'snell', name: nodeConfig.nodeName, server: nodeConfig.hostname, port: nodeConfig.port, psk: nodeConfig.psk, 'obfs-opts': Object.assign({ mode: nodeConfig.obfs }, (nodeConfig['obfs-host']
                        ? {
                            host: nodeConfig['obfs-host'],
                        }
                        : null)) }, (nodeConfig.version
                    ? {
                        version: nodeConfig.version,
                    }
                    : null));
            case types_1.NodeTypeEnum.HTTPS:
                return {
                    type: 'http',
                    name: nodeConfig.nodeName,
                    server: nodeConfig.hostname,
                    port: nodeConfig.port,
                    username: nodeConfig.username /* istanbul ignore next */ || '',
                    password: nodeConfig.password /* istanbul ignore next */ || '',
                    tls: true,
                    'skip-cert-verify': nodeConfig.skipCertVerify === true,
                };
            case types_1.NodeTypeEnum.HTTP:
                return {
                    type: 'http',
                    name: nodeConfig.nodeName,
                    server: nodeConfig.hostname,
                    port: nodeConfig.port,
                    username: nodeConfig.username /* istanbul ignore next */ || '',
                    password: nodeConfig.password /* istanbul ignore next */ || '',
                };
            case types_1.NodeTypeEnum.Trojan:
                return Object.assign(Object.assign(Object.assign(Object.assign({ type: 'trojan', name: nodeConfig.nodeName, server: nodeConfig.hostname, port: nodeConfig.port, password: nodeConfig.password }, (nodeConfig['udp-relay']
                    ? { udp: nodeConfig['udp-relay'] }
                    : null)), (nodeConfig.alpn ? { alpn: nodeConfig.alpn } : null)), (nodeConfig.sni ? { sni: nodeConfig.sni } : null)), { 'skip-cert-verify': nodeConfig.skipCertVerify === true });
            case types_1.NodeTypeEnum.Socks5: {
                return Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({ type: 'socks5', name: nodeConfig.nodeName, server: nodeConfig.hostname, port: nodeConfig.port }, (nodeConfig.username ? { username: nodeConfig.username } : null)), (nodeConfig.password ? { password: nodeConfig.password } : null)), (typeof nodeConfig.tls === 'boolean'
                    ? { tls: nodeConfig.tls }
                    : null)), (typeof nodeConfig.skipCertVerify === 'boolean'
                    ? { 'skip-cert-verify': nodeConfig.skipCertVerify }
                    : null)), (typeof nodeConfig.udpRelay === 'boolean'
                    ? { udp: nodeConfig.udpRelay }
                    : null));
            }
            // istanbul ignore next
            default:
                logger.warn(`不支持为 Clash 生成 ${nodeConfig.type} 的节点，节点 ${nodeConfig.nodeName} 会被省略`);
                return null;
        }
    })
        .filter((item) => item !== null);
};
exports.getClashNodes = getClashNodes;
const getMellowNodes = function (list, filter) {
    // istanbul ignore next
    if (arguments.length === 2 && typeof filter === 'undefined') {
        throw new Error(constant_1.ERR_INVALID_FILTER);
    }
    const result = (0, exports.applyFilter)(list, filter)
        .map((nodeConfig) => {
        switch (nodeConfig.type) {
            case types_1.NodeTypeEnum.Vmess: {
                const uri = (0, v2ray_1.formatVmessUri)(nodeConfig, { isMellow: true });
                return [
                    nodeConfig.nodeName,
                    'vmess1',
                    uri.trim().replace('vmess://', 'vmess1://'),
                ].join(', ');
            }
            case types_1.NodeTypeEnum.Shadowsocks: {
                const uri = (0, exports.getShadowsocksNodes)([nodeConfig]);
                return [nodeConfig.nodeName, 'ss', uri.trim()].join(', ');
            }
            // istanbul ignore next
            default:
                logger.warn(`不支持为 Mellow 生成 ${nodeConfig.type} 的节点，节点 ${nodeConfig.nodeName} 会被省略`);
                return null;
        }
    })
        .filter((item) => !!item);
    return result.join('\n');
};
exports.getMellowNodes = getMellowNodes;
// istanbul ignore next
const toUrlSafeBase64 = (str) => urlsafe_base64_1.default.encode(Buffer.from(str, 'utf8'));
exports.toUrlSafeBase64 = toUrlSafeBase64;
// istanbul ignore next
const fromUrlSafeBase64 = (str) => {
    if (urlsafe_base64_1.default.validate(str)) {
        return urlsafe_base64_1.default.decode(str).toString();
    }
    return (0, exports.fromBase64)(str);
};
exports.fromUrlSafeBase64 = fromUrlSafeBase64;
// istanbul ignore next
const toBase64 = (str) => Buffer.from(str, 'utf8').toString('base64');
exports.toBase64 = toBase64;
// istanbul ignore next
const fromBase64 = (str) => Buffer.from(str, 'base64').toString('utf8');
exports.fromBase64 = fromBase64;
/**
 * @see https://github.com/shadowsocks/shadowsocks-org/wiki/SIP002-URI-Scheme
 */
const getShadowsocksNodes = (list, groupName = 'Surgio') => {
    const result = list
        .map((nodeConfig) => {
        // istanbul ignore next
        if (nodeConfig.enable === false) {
            return null;
        }
        switch (nodeConfig.type) {
            case types_1.NodeTypeEnum.Shadowsocks: {
                const config = lodash_1.default.cloneDeep(nodeConfig);
                const query = Object.assign(Object.assign({}, (config.obfs
                    ? {
                        plugin: `${encodeURIComponent(`obfs-local;obfs=${config.obfs};obfs-host=${config['obfs-host']}`)}`,
                    }
                    : null)), (groupName ? { group: encodeURIComponent(groupName) } : null));
                return [
                    'ss://',
                    (0, exports.toUrlSafeBase64)(`${config.method}:${config.password}`),
                    '@',
                    config.hostname,
                    ':',
                    config.port,
                    '/?',
                    query_string_1.default.stringify(query, {
                        encode: false,
                        sort: false,
                    }),
                    '#',
                    encodeURIComponent(config.nodeName),
                ].join('');
            }
            // istanbul ignore next
            default:
                logger.warn(`在生成 Shadowsocks 节点时出现了 ${nodeConfig.type} 节点，节点 ${nodeConfig.nodeName} 会被省略`);
                return null;
        }
    })
        .filter((item) => !!item);
    return result.join('\n');
};
exports.getShadowsocksNodes = getShadowsocksNodes;
const getShadowsocksrNodes = (list, groupName) => {
    const result = list
        .map((nodeConfig) => {
        // istanbul ignore next
        if (nodeConfig.enable === false) {
            return void 0;
        }
        switch (nodeConfig.type) {
            case types_1.NodeTypeEnum.Shadowsocksr: {
                const baseUri = [
                    nodeConfig.hostname,
                    nodeConfig.port,
                    nodeConfig.protocol,
                    nodeConfig.method,
                    nodeConfig.obfs,
                    (0, exports.toUrlSafeBase64)(nodeConfig.password),
                ].join(':');
                const query = {
                    obfsparam: (0, exports.toUrlSafeBase64)(nodeConfig.obfsparam),
                    protoparam: (0, exports.toUrlSafeBase64)(nodeConfig.protoparam),
                    remarks: (0, exports.toUrlSafeBase64)(nodeConfig.nodeName),
                    group: (0, exports.toUrlSafeBase64)(groupName),
                    udpport: 0,
                    uot: 0,
                };
                return ('ssr://' +
                    (0, exports.toUrlSafeBase64)([
                        baseUri,
                        '/?',
                        query_string_1.default.stringify(query, {
                            encode: false,
                        }),
                    ].join('')));
            }
            // istanbul ignore next
            default:
                logger.warn(`在生成 Shadowsocksr 节点时出现了 ${nodeConfig.type} 节点，节点 ${nodeConfig.nodeName} 会被省略`);
                return void 0;
        }
    })
        .filter((item) => item !== undefined);
    return result.join('\n');
};
exports.getShadowsocksrNodes = getShadowsocksrNodes;
const getV2rayNNodes = (list) => {
    const result = list
        .map((nodeConfig) => {
        // istanbul ignore next
        if (nodeConfig.enable === false) {
            return void 0;
        }
        switch (nodeConfig.type) {
            case types_1.NodeTypeEnum.Vmess: {
                const json = {
                    v: '2',
                    ps: nodeConfig.nodeName,
                    add: nodeConfig.hostname,
                    port: `${nodeConfig.port}`,
                    id: nodeConfig.uuid,
                    aid: nodeConfig.alterId,
                    net: nodeConfig.network,
                    type: 'none',
                    host: nodeConfig.host,
                    path: nodeConfig.path,
                    tls: nodeConfig.tls ? 'tls' : '',
                };
                return 'vmess://' + (0, exports.toBase64)(JSON.stringify(json));
            }
            // istanbul ignore next
            default:
                logger.warn(`在生成 V2Ray 节点时出现了 ${nodeConfig.type} 节点，节点 ${nodeConfig.nodeName} 会被省略`);
                return void 0;
        }
    })
        .filter((item) => item !== undefined);
    return result.join('\n');
};
exports.getV2rayNNodes = getV2rayNNodes;
const getQuantumultNodes = function (list, groupName = 'Surgio', filter) {
    // istanbul ignore next
    if (arguments.length === 3 && typeof filter === 'undefined') {
        throw new Error(constant_1.ERR_INVALID_FILTER);
    }
    function getHeader(wsHeaders) {
        return Object.keys(wsHeaders)
            .map((headerKey) => `${headerKey}:${wsHeaders[headerKey]}`)
            .join('[Rr][Nn]');
    }
    const result = (0, exports.applyFilter)(list, filter)
        .map((nodeConfig) => {
        switch (nodeConfig.type) {
            case types_1.NodeTypeEnum.Vmess: {
                const config = [
                    'vmess',
                    nodeConfig.hostname,
                    nodeConfig.port,
                    nodeConfig.method === 'auto'
                        ? 'chacha20-ietf-poly1305'
                        : nodeConfig.method,
                    JSON.stringify(nodeConfig.uuid),
                    nodeConfig.alterId,
                    `group=${groupName}`,
                    `over-tls=${nodeConfig.tls === true ? 'true' : 'false'}`,
                    `certificate=1`,
                    `obfs=${nodeConfig.network}`,
                    `obfs-path=${JSON.stringify(nodeConfig.path || '/')}`,
                    `obfs-header=${JSON.stringify(getHeader(Object.assign({ host: nodeConfig.host || nodeConfig.hostname, 'user-agent': constant_1.OBFS_UA }, lodash_1.default.omit(nodeConfig.wsHeaders, ['host']))))}`,
                ]
                    .filter((value) => !!value)
                    .join(',');
                return ('vmess://' + (0, exports.toBase64)([nodeConfig.nodeName, config].join(' = ')));
            }
            case types_1.NodeTypeEnum.Shadowsocks: {
                return (0, exports.getShadowsocksNodes)([nodeConfig], groupName);
            }
            case types_1.NodeTypeEnum.Shadowsocksr:
                return (0, exports.getShadowsocksrNodes)([nodeConfig], groupName);
            case types_1.NodeTypeEnum.HTTPS: {
                const config = [
                    nodeConfig.nodeName,
                    [
                        'http',
                        `upstream-proxy-address=${nodeConfig.hostname}`,
                        `upstream-proxy-port=${nodeConfig.port}`,
                        'upstream-proxy-auth=true',
                        `upstream-proxy-username=${nodeConfig.username}`,
                        `upstream-proxy-password=${nodeConfig.password}`,
                        'over-tls=true',
                        'certificate=1',
                    ].join(', '),
                ].join(' = ');
                return 'http://' + (0, exports.toBase64)(config);
            }
            // istanbul ignore next
            default:
                logger.warn(`不支持为 Quantumult 生成 ${nodeConfig.type} 的节点，节点 ${nodeConfig.nodeName} 会被省略`);
                return void 0;
        }
    })
        .filter((item) => item !== undefined);
    return result.join('\n');
};
exports.getQuantumultNodes = getQuantumultNodes;
/**
 * @see https://github.com/crossutility/Quantumult-X/blob/master/sample.conf
 */
const getQuantumultXNodes = function (list, filter) {
    // istanbul ignore next
    if (arguments.length === 2 && typeof filter === 'undefined') {
        throw new Error(constant_1.ERR_INVALID_FILTER);
    }
    const result = (0, exports.applyFilter)(list, filter)
        .map((nodeConfig) => {
        var _a;
        switch (nodeConfig.type) {
            case types_1.NodeTypeEnum.Vmess: {
                const config = [
                    `${nodeConfig.hostname}:${nodeConfig.port}`,
                    // method 为 auto 时 qx 会无法识别
                    nodeConfig.method === 'auto'
                        ? `method=chacha20-ietf-poly1305`
                        : `method=${nodeConfig.method}`,
                    `password=${nodeConfig.uuid}`,
                    ...(nodeConfig['udp-relay'] ? ['udp-relay=true'] : []),
                    ...(nodeConfig.tfo ? ['fast-open=true'] : []),
                    ...(((_a = nodeConfig.quantumultXConfig) === null || _a === void 0 ? void 0 : _a.vmessAEAD)
                        ? ['aead=true']
                        : ['aead=false']),
                ];
                switch (nodeConfig.network) {
                    case 'ws':
                        if (nodeConfig.tls) {
                            config.push(`obfs=wss`);
                        }
                        else {
                            config.push(`obfs=ws`);
                        }
                        config.push(`obfs-uri=${nodeConfig.path || '/'}`);
                        config.push(`obfs-host=${nodeConfig.host || nodeConfig.hostname}`);
                        // istanbul ignore next
                        if (nodeConfig.tls13) {
                            config.push(`tls13=true`);
                        }
                        break;
                    case 'tcp':
                        if (nodeConfig.tls) {
                            config.push(`obfs=over-tls`);
                        }
                        // istanbul ignore next
                        if (nodeConfig.tls13) {
                            config.push(`tls13=true`);
                        }
                        break;
                    default:
                    // do nothing
                }
                config.push(`tag=${nodeConfig.nodeName}`);
                // istanbul ignore next
                if (nodeConfig.wsHeaders &&
                    Object.keys(nodeConfig.wsHeaders).length > 1) {
                    logger.warn(`Quantumult X 不支持自定义额外的 Header 字段，节点 ${nodeConfig.nodeName} 可能不可用`);
                }
                return `vmess=${config.join(', ')}`;
            }
            case types_1.NodeTypeEnum.Shadowsocks: {
                const config = [
                    `${nodeConfig.hostname}:${nodeConfig.port}`,
                    ...(0, exports.pickAndFormatStringList)(nodeConfig, ['method', 'password']),
                    ...(nodeConfig.obfs && ['http', 'tls'].includes(nodeConfig.obfs)
                        ? [
                            `obfs=${nodeConfig.obfs}`,
                            `obfs-host=${nodeConfig['obfs-host']}`,
                        ]
                        : []),
                    ...(nodeConfig.obfs && ['ws', 'wss'].includes(nodeConfig.obfs)
                        ? [
                            `obfs=${nodeConfig.obfs}`,
                            `obfs-host=${nodeConfig['obfs-host'] || nodeConfig.hostname}`,
                            `obfs-uri=${nodeConfig['obfs-uri'] || '/'}`,
                        ]
                        : []),
                    ...(nodeConfig['udp-relay'] ? [`udp-relay=true`] : []),
                    ...(nodeConfig.tfo ? [`fast-open=${nodeConfig.tfo}`] : []),
                    ...(nodeConfig.tls13 ? [`tls13=${nodeConfig.tls13}`] : []),
                    `tag=${nodeConfig.nodeName}`,
                ].join(', ');
                // istanbul ignore next
                if (nodeConfig.wsHeaders &&
                    Object.keys(nodeConfig.wsHeaders).length > 1) {
                    logger.warn(`Quantumult X 不支持自定义额外的 Header 字段，节点 ${nodeConfig.nodeName} 可能不可用`);
                }
                return `shadowsocks=${config}`;
            }
            case types_1.NodeTypeEnum.Shadowsocksr: {
                const config = [
                    `${nodeConfig.hostname}:${nodeConfig.port}`,
                    ...(0, exports.pickAndFormatStringList)(nodeConfig, ['method', 'password']),
                    `ssr-protocol=${nodeConfig.protocol}`,
                    `ssr-protocol-param=${nodeConfig.protoparam}`,
                    `obfs=${nodeConfig.obfs}`,
                    `obfs-host=${nodeConfig.obfsparam}`,
                    ...(nodeConfig['udp-relay'] ? [`udp-relay=true`] : []),
                    ...(nodeConfig.tfo ? [`fast-open=${nodeConfig.tfo}`] : []),
                    `tag=${nodeConfig.nodeName}`,
                ].join(', ');
                return `shadowsocks=${config}`;
            }
            case types_1.NodeTypeEnum.HTTP:
            case types_1.NodeTypeEnum.HTTPS: {
                const config = [
                    `${nodeConfig.hostname}:${nodeConfig.port}`,
                    ...(0, exports.pickAndFormatStringList)(nodeConfig, ['username', 'password']),
                    ...(nodeConfig.tfo ? [`fast-open=${nodeConfig.tfo}`] : []),
                ];
                if (nodeConfig.type === types_1.NodeTypeEnum.HTTPS) {
                    config.push('over-tls=true', `tls-verification=${nodeConfig.skipCertVerify !== true}`, ...(nodeConfig.tls13 ? [`tls13=${nodeConfig.tls13}`] : []));
                }
                config.push(`tag=${nodeConfig.nodeName}`);
                return `http=${config.join(', ')}`;
            }
            case types_1.NodeTypeEnum.Trojan: {
                const config = [
                    `${nodeConfig.hostname}:${nodeConfig.port}`,
                    ...(0, exports.pickAndFormatStringList)(nodeConfig, ['password']),
                    'over-tls=true',
                    `tls-verification=${nodeConfig.skipCertVerify !== true}`,
                    ...(nodeConfig.sni ? [`tls-host=${nodeConfig.sni}`] : []),
                    ...(nodeConfig.tfo ? [`fast-open=${nodeConfig.tfo}`] : []),
                    ...(nodeConfig['udp-relay'] ? [`udp-relay=true`] : []),
                    ...(nodeConfig.tls13 ? [`tls13=${nodeConfig.tls13}`] : []),
                    `tag=${nodeConfig.nodeName}`,
                ];
                return `trojan=${config.join(', ')}`;
            }
            // istanbul ignore next
            default:
                logger.warn(`不支持为 QuantumultX 生成 ${nodeConfig.type} 的节点，节点 ${nodeConfig.nodeName} 会被省略`);
                return void 0;
        }
    })
        .filter((item) => item !== undefined);
    return result.join('\n');
};
exports.getQuantumultXNodes = getQuantumultXNodes;
// istanbul ignore next
const getShadowsocksNodesJSON = (list) => {
    const nodes = list
        .map((nodeConfig) => {
        // istanbul ignore next
        if (nodeConfig.enable === false) {
            return null;
        }
        switch (nodeConfig.type) {
            case types_1.NodeTypeEnum.Shadowsocks: {
                const useObfs = Boolean(nodeConfig.obfs && nodeConfig['obfs-host']);
                return Object.assign({ remarks: nodeConfig.nodeName, server: nodeConfig.hostname, server_port: nodeConfig.port, method: nodeConfig.method, remarks_base64: (0, exports.toUrlSafeBase64)(nodeConfig.nodeName), password: nodeConfig.password, tcp_over_udp: false, udp_over_tcp: false, enable: true }, (useObfs
                    ? {
                        plugin: 'obfs-local',
                        'plugin-opts': `obfs=${nodeConfig.obfs};obfs-host=${nodeConfig['obfs-host']}`,
                    }
                    : null));
            }
            // istanbul ignore next
            default:
                logger.warn(`在生成 Shadowsocks 节点时出现了 ${nodeConfig.type} 节点，节点 ${nodeConfig.nodeName} 会被省略`);
                return undefined;
        }
    })
        .filter((item) => item !== undefined);
    return JSON.stringify(nodes, null, 2);
};
exports.getShadowsocksNodesJSON = getShadowsocksNodesJSON;
const getNodeNames = function (list, filter, separator) {
    // istanbul ignore next
    if (arguments.length === 2 && typeof filter === 'undefined') {
        throw new Error(constant_1.ERR_INVALID_FILTER);
    }
    return (0, exports.applyFilter)(list, filter)
        .map((item) => item.nodeName)
        .join(separator || ', ');
};
exports.getNodeNames = getNodeNames;
const getClashNodeNames = function (list, filter, existingProxies) {
    // istanbul ignore next
    if (arguments.length === 2 && typeof filter === 'undefined') {
        throw new Error(constant_1.ERR_INVALID_FILTER);
    }
    let result = [];
    if (existingProxies) {
        result = result.concat(existingProxies);
    }
    result = result.concat((0, exports.applyFilter)(list, filter).map((item) => item.nodeName));
    return result;
};
exports.getClashNodeNames = getClashNodeNames;
const generateClashProxyGroup = (ruleName, ruleType, nodeNameList, options) => {
    let proxies;
    if (options.existingProxies) {
        if (options.filter) {
            const nodes = (0, exports.applyFilter)(nodeNameList, options.filter);
            proxies = [].concat(options.existingProxies, nodes.map((item) => item.nodeName));
        }
        else {
            proxies = options.existingProxies;
        }
    }
    else {
        const nodes = (0, exports.applyFilter)(nodeNameList, options.filter);
        proxies = nodes.map((item) => item.nodeName);
    }
    return Object.assign({ type: ruleType, name: ruleName, proxies }, (['url-test', 'fallback', 'load-balance'].includes(ruleType)
        ? {
            url: options.proxyTestUrl,
            interval: options.proxyTestInterval,
        }
        : null));
};
exports.generateClashProxyGroup = generateClashProxyGroup;
const toYaml = (obj) => yaml_1.default.stringify(obj);
exports.toYaml = toYaml;
const pickAndFormatStringList = (obj, keyList) => {
    const result = [];
    keyList.forEach((key) => {
        if (obj.hasOwnProperty(key)) {
            result.push(`${key}=${obj[key]}`);
        }
    });
    return result;
};
exports.pickAndFormatStringList = pickAndFormatStringList;
const decodeStringList = (stringList) => {
    const result = {};
    stringList.forEach((item) => {
        if (item.includes('=')) {
            const match = item.match(/^(.*?)=(.*?)$/);
            if (match) {
                result[match[1].trim()] = match[2].trim() || true;
            }
        }
        else {
            result[item.trim()] = true;
        }
    });
    return result;
};
exports.decodeStringList = decodeStringList;
const normalizeClashProxyGroupConfig = (nodeList, customFilters, proxyGroupModifier, options = {}) => {
    const proxyGroup = proxyGroupModifier(nodeList, customFilters);
    return proxyGroup.map((item) => {
        if (item.hasOwnProperty('filter')) {
            // istanbul ignore next
            if (!item.filter || !(0, filter_1.validateFilter)(item.filter)) {
                throw new Error(`过滤器 ${item.filter} 无效，请检查 proxyGroupModifier`);
            }
            return (0, exports.generateClashProxyGroup)(item.name, item.type, nodeList, {
                filter: item.filter,
                existingProxies: item.proxies,
                proxyTestUrl: options.proxyTestUrl,
                proxyTestInterval: options.proxyTestInterval,
            });
        }
        else {
            return (0, exports.generateClashProxyGroup)(item.name, item.type, nodeList, {
                existingProxies: item.proxies,
                proxyTestUrl: options.proxyTestUrl,
                proxyTestInterval: options.proxyTestInterval,
            });
        }
    });
};
exports.normalizeClashProxyGroupConfig = normalizeClashProxyGroupConfig;
const ensureConfigFolder = (dir = os_1.default.homedir()) => {
    let baseDir;
    try {
        fs_extra_1.default.accessSync(dir, fs_extra_1.default.constants.W_OK);
        baseDir = dir;
    }
    catch (err) {
        // if the user do not have write permission
        // istanbul ignore next
        baseDir = '/tmp';
    }
    const configDir = (0, path_1.join)(baseDir, '.config/surgio');
    fs_extra_1.default.mkdirpSync(configDir);
    return configDir;
};
exports.ensureConfigFolder = ensureConfigFolder;
const formatV2rayConfig = (localPort, nodeConfig) => {
    const config = {
        log: {
            loglevel: 'warning',
        },
        inbound: {
            port: Number(localPort),
            listen: '127.0.0.1',
            protocol: 'socks',
            settings: {
                auth: 'noauth',
            },
        },
        outbound: {
            protocol: 'vmess',
            settings: {
                vnext: [
                    {
                        address: nodeConfig.hostname,
                        port: Number(nodeConfig.port),
                        users: [
                            {
                                id: nodeConfig.uuid,
                                alterId: Number(nodeConfig.alterId),
                                security: nodeConfig.method,
                                level: 0,
                            },
                        ],
                    },
                ],
            },
            streamSettings: {
                security: 'none',
            },
        },
    };
    if (nodeConfig.tls) {
        config.outbound.streamSettings = Object.assign(Object.assign({}, config.outbound.streamSettings), { security: 'tls', tlsSettings: Object.assign(Object.assign({ serverName: nodeConfig.host || nodeConfig.hostname }, (typeof nodeConfig.skipCertVerify === 'boolean'
                ? {
                    allowInsecure: nodeConfig.skipCertVerify,
                }
                : null)), (typeof nodeConfig.tls13 === 'boolean'
                ? {
                    allowInsecureCiphers: !nodeConfig.tls13,
                }
                : null)) });
    }
    if (nodeConfig.network === 'ws') {
        config.outbound.streamSettings = Object.assign(Object.assign({}, config.outbound.streamSettings), { network: nodeConfig.network, wsSettings: {
                path: nodeConfig.path,
                headers: {
                    Host: nodeConfig.host,
                    'User-Agent': constant_1.OBFS_UA,
                },
            } });
    }
    return config;
};
exports.formatV2rayConfig = formatV2rayConfig;
const applyFilter = (nodeList, filter) => {
    // istanbul ignore next
    if (filter && !(0, filter_1.validateFilter)(filter)) {
        throw new Error(`使用了无效的过滤器 ${filter}`);
    }
    let nodes = nodeList.filter((item) => {
        const result = item.enable !== false;
        if (filter && typeof filter === 'function') {
            return filter(item) && result;
        }
        return result;
    });
    if (filter &&
        typeof filter === 'object' &&
        typeof filter.filter === 'function') {
        nodes = filter.filter(nodes);
    }
    return nodes;
};
exports.applyFilter = applyFilter;
const lowercaseHeaderKeys = (headers) => {
    const wsHeaders = {};
    Object.keys(headers).forEach((key) => {
        wsHeaders[key.toLowerCase()] = headers[key];
    });
    return wsHeaders;
};
exports.lowercaseHeaderKeys = lowercaseHeaderKeys;
// istanbul ignore next
const isIp = (str) => net_1.default.isIPv4(str) || net_1.default.isIPv6(str);
exports.isIp = isIp;
// istanbul ignore next
const isNow = () => typeof process.env.NOW_REGION !== 'undefined' ||
    typeof process.env.VERCEL_REGION !== 'undefined';
exports.isNow = isNow;
// istanbul ignore next
const isVercel = () => (0, exports.isNow)();
exports.isVercel = isVercel;
// istanbul ignore next
const isHeroku = () => typeof process.env.DYNO !== 'undefined';
exports.isHeroku = isHeroku;
// istanbul ignore next
const isGitHubActions = () => typeof process.env.GITHUB_ACTIONS !== 'undefined';
exports.isGitHubActions = isGitHubActions;
// istanbul ignore next
const isGitLabCI = () => typeof process.env.GITLAB_CI !== 'undefined';
exports.isGitLabCI = isGitLabCI;
// istanbul ignore next
const isPkgBundle = () => __dirname.startsWith('/snapshot');
exports.isPkgBundle = isPkgBundle;
// istanbul ignore next
const isRailway = () => typeof process.env.RAILWAY_STATIC_URL !== 'undefined';
exports.isRailway = isRailway;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9saWIvdXRpbHMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsMkNBQThDO0FBQzlDLG9EQUE0QjtBQUM1Qix3REFBMEI7QUFDMUIsb0RBQXVCO0FBQ3ZCLDRDQUFvQjtBQUNwQiwrQkFBNEI7QUFDNUIsZ0VBQXVDO0FBRXZDLDZCQUEyQztBQUMzQyxvRUFBMkM7QUFDM0MsZ0RBQXdCO0FBQ3hCLDhDQUFzQjtBQUV0QixvQ0FnQmtCO0FBQ2xCLG1DQUFzQztBQUN0QywwQ0FBMEQ7QUFDMUQscUNBQTBDO0FBQzFDLGdFQUF1QztBQUN2QyxtQ0FBeUM7QUFFekMsTUFBTSxNQUFNLEdBQUcsSUFBQSxxQkFBWSxFQUFDLEVBQUUsT0FBTyxFQUFFLGNBQWMsRUFBRSxDQUFDLENBQUM7QUFFbEQsTUFBTSxjQUFjLEdBQUcsQ0FDNUIsT0FBTyxHQUFHLEdBQUcsRUFDYixZQUFvQixFQUNwQixNQUFNLEdBQUcsSUFBSSxFQUNiLFdBQW9CLEVBQ1osRUFBRTtJQUNWLElBQUksZUFBZ0MsQ0FBQztJQUNyQyxJQUFJLElBQVksQ0FBQztJQUVqQixJQUFJLFlBQVksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLEVBQUU7UUFDOUIsZUFBZSxHQUFHLElBQUkscUJBQWUsQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDbEUsSUFBSSxHQUFHLFlBQVksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7S0FDbkM7U0FBTTtRQUNMLGVBQWUsR0FBRyxJQUFJLHFCQUFlLEVBQUUsQ0FBQztRQUN4QyxJQUFJLEdBQUcsWUFBWSxDQUFDO0tBQ3JCO0lBRUQsSUFBSSxXQUFXLEVBQUU7UUFDZixlQUFlLENBQUMsR0FBRyxDQUFDLGNBQWMsRUFBRSxXQUFXLENBQUMsQ0FBQztLQUNsRDtJ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