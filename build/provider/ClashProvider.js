"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseClashConfig = exports.getClashSubscription = void 0;
const joi_1 = __importDefault(require("joi"));
const assert_1 = __importDefault(require("assert"));
const yaml_1 = __importDefault(require("yaml"));
const lodash_1 = __importDefault(require("lodash"));
const logger_1 = require("@surgio/logger");
const types_1 = require("../types");
const utils_1 = require("../utils");
const env_flag_1 = require("../utils/env-flag");
const http_client_1 = require("../utils/http-client");
const relayable_url_1 = __importDefault(require("../utils/relayable-url"));
const Provider_1 = __importDefault(require("./Provider"));
const logger = (0, logger_1.createLogger)({
    service: 'surgio:ClashProvider',
});
class ClashProvider extends Provider_1.default {
    constructor(name, config) {
        super(name, config);
        const schema = joi_1.default.object({
            url: joi_1.default.string()
                .uri({
                scheme: [/https?/],
            })
                .required(),
            udpRelay: joi_1.default.bool().strict(),
            tls13: joi_1.default.bool().strict(),
        }).unknown();
        const { error } = schema.validate(config);
        // istanbul ignore next
        if (error) {
            throw error;
        }
        this._url = config.url;
        this.udpRelay = config.udpRelay;
        this.tls13 = config.tls13;
        this.supportGetSubscriptionUserInfo = true;
    }
    // istanbul ignore next
    get url() {
        return (0, relayable_url_1.default)(this._url, this.relayUrl);
    }
    async getSubscriptionUserInfo() {
        const { subscriptionUserinfo } = await (0, exports.getClashSubscription)(this.url, this.udpRelay, this.tls13);
        if (subscriptionUserinfo) {
            return subscriptionUserinfo;
        }
        return void 0;
    }
    async getNodeList() {
        const { nodeList } = await (0, exports.getClashSubscription)(this.url, this.udpRelay, this.tls13);
        return nodeList;
    }
}
exports.default = ClashProvider;
const getClashSubscription = async (url, udpRelay, tls13) => {
    (0, assert_1.default)(url, '未指定订阅地址 url');
    const response = await Provider_1.default.requestCacheableResource(url, {
        requestUserAgent: (0, http_client_1.getUserAgent)((0, env_flag_1.getNetworkClashUA)()),
    });
    let clashConfig;
    try {
        // eslint-disable-next-line prefer-const
        clashConfig = yaml_1.default.parse(response.body);
    }
    catch (err) /* istanbul ignore next */ {
        throw new Error(`${url} 不是一个合法的 YAML 文件`);
    }
    if (!lodash_1.default.isPlainObject(clashConfig) ||
        (!('Proxy' in clashConfig) && !('proxies' in clashConfig))) {
        throw new Error(`${url} 订阅内容有误，请检查后重试`);
    }
    const proxyList = clashConfig.Proxy || clashConfig.proxies;
    // istanbul ignore next
    if (!Array.isArray(proxyList)) {
        throw new Error(`${url} 订阅内容有误，请检查后重试`);
    }
    return {
        nodeList: (0, exports.parseClashConfig)(proxyList, udpRelay, tls13),
        subscriptionUserinfo: response.subscriptionUserinfo,
    };
};
exports.getClashSubscription = getClashSubscription;
const parseClashConfig = (proxyList, udpRelay, tls13) => {
    const nodeList = proxyList.map((item) => {
        var _a, _b, _c, _d;
        switch (item.type) {
            case 'ss': {
                // istanbul ignore next
                if (item.plugin && !['obfs', 'v2ray-plugin'].includes(item.plugin)) {
                    logger.warn(`不支持从 Clash 订阅中读取 ${item.plugin} 类型的 Shadowsocks 节点，节点 ${item.name} 会被省略`);
                    return void 0;
                }
                // istanbul ignore next
                if (item.plugin === 'v2ray-plugin' &&
                    item['plugin-opts'].mode.toLowerCase() === 'quic') {
                    logger.warn(`不支持从 Clash 订阅中读取 QUIC 模式的 Shadowsocks 节点，节点 ${item.name} 会被省略`);
                    return void 0;
                }
                const wsHeaders = (0, utils_1.lowercaseHeaderKeys)(lodash_1.default.get(item, 'plugin-opts.headers', {}));
                return Object.assign(Object.assign(Object.assign({ type: types_1.NodeTypeEnum.Shadowsocks, nodeName: item.name, hostname: item.server, port: item.port, method: item.cipher, password: item.password, 'udp-relay': resolveUdpRelay(item.udp, udpRelay) }, (item.plugin && item.plugin === 'obfs'
                    ? {
                        obfs: item['plugin-opts'].mode,
                        'obfs-host': item['plugin-opts'].host || 'www.bing.com',
                    }
                    : null)), (item.obfs
                    ? {
                        obfs: item.obfs,
                        'obfs-host': item['obfs-host'] || 'www.bing.com',
                    }
                    : null)), (item.plugin &&
                    item.plugin === 'v2ray-plugin' &&
                    item['plugin-opts'].mode === 'websocket'
                    ? Object.assign(Object.assign({ obfs: item['plugin-opts'].tls === true ? 'wss' : 'ws', 'obfs-host': item['plugin-opts'].host || item.server, 'obfs-uri': item['plugin-opts'].path || '/', wsHeaders }, (item['plugin-opts'].tls === true
                        ? {
                            skipCertVerify: item['plugin-opts']['skip-cert-verify'] === true,
                            tls13: tls13 !== null && tls13 !== void 0 ? tls13 : false,
                        }
                        : null)), (typeof item['plugin-opts'].mux === 'boolean'
                        ? {
                            mux: item['plugin-opts'].mux,
                        }
                        : null)) : null));
            }
            case 'vmess': {
                // istanbul ignore next
                if (item.network && !['tcp', 'ws'].includes(item.network)) {
                    logger.warn(`不支持从 Clash 订阅中读取 network 类型为 ${item.network} 的 Vmess 节点，节点 ${item.name} 会被省略`);
                    return void 0;
                }
                const isNewConfig = 'ws-opts' in item;
                const wsHeaders = isNewConfig
                    ? (0, utils_1.lowercaseHeaderKeys)(lodash_1.default.get(item, 'ws-opts.headers', {}))
                    : (0, utils_1.lowercaseHeaderKeys)(lodash_1.default.get(item, 'ws-headers', {}));
                const wsHost = item.servername || lodash_1.default.get(wsHeaders, 'host', item.server);
                const wsOpts = isNewConfig
                    ? lodash_1.default.get(item, 'ws-opts', {})
                    : {
                        path: lodash_1.default.get(item, 'ws-path', '/'),
                        headers: wsHeaders,
                    };
                return Object.assign(Object.assign({ type: types_1.NodeTypeEnum.Vmess, nodeName: item.name, hostname: item.server, port: item.port, uuid: item.uuid, alterId: item.alterId ? `${item.alterId}` : '0', method: item.cipher || 'auto', 'udp-relay': resolveUdpRelay(item.udp, udpRelay), tls: (_a = item.tls) !== null && _a !== void 0 ? _a : false, network: item.network || 'tcp' }, (item.network === 'ws'
                    ? {
                        host: wsHost,
                        path: lodash_1.default.get(wsOpts, 'path', '/'),
                        wsHeaders,
                    }
                    : null)), (item.tls
                    ? {
                        skipCertVerify: item['skip-cert-verify'] === true,
                        tls13: tls13 !== null && tls13 !== void 0 ? tls13 : false,
                    }
                    : null));
            }
            case 'http':
                if (!item.tls) {
                    return {
                        type: types_1.NodeTypeEnum.HTTP,
                        nodeName: item.name,
                        hostname: item.server,
                        port: item.port,
                        username: item.username /* istanbul ignore next */ || '',
                        password: item.password /* istanbul ignore next */ || '',
                    };
                }
                return {
                    type: types_1.NodeTypeEnum.HTTPS,
                    nodeName: item.name,
                    hostname: item.server,
                    port: item.port,
                    username: item.username || '',
                    password: item.password || '',
                    tls13: tls13 !== null && tls13 !== void 0 ? tls13 : false,
                    skipCertVerify: item['skip-cert-verify'] === true,
                };
            case 'snell':
                return Object.assign(Object.assign({ type: types_1.NodeTypeEnum.Snell, nodeName: item.name, hostname: item.server, port: item.port, psk: item.psk, obfs: lodash_1.default.get(item, 'obfs-opts.mode', 'http') }, (typeof ((_b = item === null || item === void 0 ? void 0 : item['obfs-opts']) === null || _b === void 0 ? void 0 : _b.host) !== 'undefined'
                    ? { 'obfs-host': item['obfs-opts'].host }
                    : null)), ('version' in item ? { version: item.version } : null));
            // istanbul ignore next
            case 'ssr':
                return {
                    type: types_1.NodeTypeEnum.Shadowsocksr,
                    nodeName: item.name,
                    hostname: item.server,
                    port: item.port,
                    password: item.password,
                    obfs: item.obfs,
                    obfsparam: (_c = item['obfs-param']) !== null && _c !== void 0 ? _c : item.obfsparam,
                    protocol: item.protocol,
                    protoparam: (_d = item['protocol-param']) !== null && _d !== void 0 ? _d : item.protocolparam,
                    method: item.cipher,
                    'udp-relay': resolveUdpRelay(item.udp, udpRelay),
                };
            case 'trojan':
                return Object.assign(Object.assign(Object.assign(Object.assign({ type: types_1.NodeTypeEnum.Trojan, nodeName: item.name, hostname: item.server, port: item.port, password: item.password }, ('skip-cert-verify' in item
                    ? { skipCertVerify: item['skip-cert-verify'] === true }
                    : null)), ('alpn' in item ? { alpn: item.alpn } : null)), ('sni' in item ? { sni: item.sni } : null)), { 'udp-relay': resolveUdpRelay(item.udp, udpRelay), tls13: tls13 !== null && tls13 !== void 0 ? tls13 : false });
            default:
                logger.warn(`不支持从 Clash 订阅中读取 ${item.type} 的节点，节点 ${item.name} 会被省略`);
                return void 0;
        }
    });
    return nodeList.filter((item) => item !== undefined);
};
exports.parseClashConfig = parseClashConfig;
function resolveUdpRelay(val, defaultVal = false) {
    if (val !== void 0) {
        return val;
    }
    return defaultVal;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ2xhc2hQcm92aWRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi9wcm92aWRlci9DbGFzaFByb3ZpZGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLDhDQUFzQjtBQUN0QixvREFBNEI7QUFDNUIsZ0RBQXdCO0FBQ3hCLG9EQUF1QjtBQUN2QiwyQ0FBOEM7QUFFOUMsb0NBV2tCO0FBQ2xCLG9DQUErQztBQUMvQyxnREFBc0Q7QUFDdEQsc0RBQW9EO0FBQ3BELDJFQUFrRDtBQUNsRCwwREFBa0M7QUFXbEMsTUFBTSxNQUFNLEdBQUcsSUFBQSxxQkFBWSxFQUFDO0lBQzFCLE9BQU8sRUFBRSxzQkFBc0I7Q0FDaEMsQ0FBQyxDQUFDO0FBRUgsTUFBcUIsYUFBYyxTQUFRLGtCQUFRO0lBS2pELFlBQVksSUFBWSxFQUFFLE1BQTJCO1FBQ25ELEtBQUssQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFFcEIsTUFBTSxNQUFNLEdBQUcsYUFBRyxDQUFDLE1BQU0sQ0FBQztZQUN4QixHQUFHLEVBQUUsYUFBRyxDQUFDLE1BQU0sRUFBRTtpQkFDZCxHQUFHLENBQUM7Z0JBQ0gsTUFBTSxFQUFFLENBQUMsUUFBUSxDQUFDO2FBQ25CLENBQUM7aUJBQ0QsUUFBUSxFQUFFO1lBQ2IsUUFBUSxFQUFFLGFBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxNQUFNLEVBQUU7WUFDN0IsS0FBSyxFQUFFLGFBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxNQUFNLEVBQUU7U0FDM0IsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDO1FBRWIsTUFBTSxFQUFFLEtBQUssRUFBRSxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUM7UUFFMUMsdUJBQXVCO1FBQ3ZCLElBQUksS0FBSyxFQUFFO1lBQ1QsTUFBTSxLQUFLLENBQUM7U0FDYjtRQUVELElBQUksQ0FBQyxJQUFJLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQztR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