"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseSsdConfig = exports.getSsdSubscription = void 0;
const joi_1 = __importDefault(require("joi"));
const logger_1 = require("@surgio/logger");
const assert_1 = __importDefault(require("assert"));
const bytes_1 = __importDefault(require("bytes"));
const types_1 = require("../types");
const utils_1 = require("../utils");
const relayable_url_1 = __importDefault(require("../utils/relayable-url"));
const Provider_1 = __importDefault(require("./Provider"));
const logger = (0, logger_1.createLogger)({
    service: 'surgio:SsdProvider',
});
class SsdProvider extends Provider_1.default {
    constructor(name, config) {
        super(name, config);
        const schema = joi_1.default.object({
            url: joi_1.default.string()
                .uri({
                scheme: [/https?/],
            })
                .required(),
            udpRelay: joi_1.default.boolean().strict(),
        }).unknown();
        const { error } = schema.validate(config);
        // istanbul ignore next
        if (error) {
            throw error;
        }
        this._url = config.url;
        this.udpRelay = config.udpRelay;
        this.supportGetSubscriptionUserInfo = true;
    }
    // istanbul ignore next
    get url() {
        return (0, relayable_url_1.default)(this._url, this.relayUrl);
    }
    async getSubscriptionUserInfo() {
        const { subscriptionUserinfo } = await (0, exports.getSsdSubscription)(this.url, this.udpRelay);
        if (subscriptionUserinfo) {
            return subscriptionUserinfo;
        }
        return void 0;
    }
    async getNodeList() {
        const { nodeList } = await (0, exports.getSsdSubscription)(this.url, this.udpRelay);
        return nodeList;
    }
}
exports.default = SsdProvider;
// 协议定义：https://github.com/TheCGDF/SSD-Windows/wiki/HTTP%E8%AE%A2%E9%98%85%E5%8D%8F%E5%AE%9A
const getSsdSubscription = async (url, udpRelay) => {
    (0, assert_1.default)(url, '未指定订阅地址 url');
    const response = await Provider_1.default.requestCacheableResource(url);
    // istanbul ignore next
    if (!response.body.startsWith('ssd://')) {
        throw new Error(`暂仅支持 ssd:// 开头的订阅地址，${url} 无法处理`);
    }
    const base64 = response.body.replace('ssd://', '');
    const data = JSON.parse((0, utils_1.fromBase64)(base64));
    const { servers, traffic_used, traffic_total, expiry } = data;
    const nodeList = servers.map((server) => (0, exports.parseSsdConfig)(data, server, udpRelay));
    if (!response.subscriptionUserinfo &&
        traffic_used &&
        traffic_total &&
        expiry) {
        response.subscriptionUserinfo = {
            upload: 0,
            download: bytes_1.default.parse(`${traffic_used}GB`),
            total: bytes_1.default.parse(`${traffic_total}GB`),
            expire: Math.floor(new Date(expiry).getTime() / 1000),
        };
    }
    return {
        nodeList: nodeList.filter((item) => item !== undefined),
        subscriptionUserinfo: response.subscriptionUserinfo,
    };
};
exports.getSsdSubscription = getSsdSubscription;
const parseSsdConfig = (globalConfig, server, udpRelay) => {
    var _a, _b, _c, _d, _e, _f, _g;
    const { airport, port, encryption, password } = globalConfig;
    const plugin = (_a = server.plugin) !== null && _a !== void 0 ? _a : globalConfig.plugin;
    const pluginOptsString = (_b = server.plugin_options) !== null && _b !== void 0 ? _b : globalConfig.plugin_options;
    const pluginOpts = pluginOptsString
        ? (0, utils_1.decodeStringList)(pluginOptsString.split(';'))
        : {};
    // istanbul ignore next
    if (plugin && !['simple-obfs', 'v2ray-plugin'].includes(plugin)) {
        logger.warn(`不支持从 SSD 订阅中读取 ${plugin} 类型的 Shadowsocks 节点，节点 ${server.remarks} 会被省略`);
        return void 0;
    }
    // istanbul ignore next
    if (plugin === 'v2ray-plugin' &&
        pluginOpts.mode.toLowerCase() === 'quic') {
        logger.warn(`不支持从 SSD 订阅中读取 QUIC 模式的 Shadowsocks 节点，节点 ${server.remarks} 会被省略`);
        return void 0;
    }
    return Object.assign(Object.assign({ type: types_1.NodeTypeEnum.Shadowsocks, nodeName: (_c = server.remarks) !== null && _c !== void 0 ? _c : `${airport} ${server.server}:${(_d = server.port) !== null && _d !== void 0 ? _d : port}`, hostname: server.server, port: (_e = server.port) !== null && _e !== void 0 ? _e : port, method: (_f = server.encryption) !== null && _f !== void 0 ? _f : encryption, password: (_g = server.password) !== null && _g !== void 0 ? _g : password, 'udp-relay': udpRelay === true }, (plugin && plugin === 'simple-obfs'
        ? {
            obfs: pluginOpts.obfs,
            'obfs-host': pluginOpts['obfs-host'] || 'www.bing.com',
        }
        : null)), (plugin && plugin === 'v2ray-plugin'
        ? {
            obfs: pluginOpts.tls ? 'wss' : 'ws',
            'obfs-host': pluginOpts.host,
        }
        : null));
};
exports.parseSsdConfig = parseSsdConfig;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU3NkUHJvdmlkZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9saWIvcHJvdmlkZXIvU3NkUHJvdmlkZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsOENBQXNCO0FBQ3RCLDJDQUE4QztBQUM5QyxvREFBNEI7QUFDNUIsa0RBQTBCO0FBRTFCLG9DQUtrQjtBQUNsQixvQ0FBd0Q7QUFDeEQsMkVBQWtEO0FBQ2xELDBEQUFrQztBQUVsQyxNQUFNLE1BQU0sR0FBRyxJQUFBLHFCQUFZLEVBQUM7SUFDMUIsT0FBTyxFQUFFLG9CQUFvQjtDQUM5QixDQUFDLENBQUM7QUFFSCxNQUFxQixXQUFZLFNBQVEsa0JBQVE7SUFJL0MsWUFBWSxJQUFZLEVBQUUsTUFBeUI7UUFDakQsS0FBSyxDQUFDLElBQUksRUFBRSxNQUFNLENBQUMsQ0FBQztRQUVwQixNQUFNLE1BQU0sR0FBRyxhQUFHLENBQUMsTUFBTSxDQUFDO1lBQ3hCLEdBQUcsRUFBRSxhQUFHLENBQUMsTUFBTSxFQUFFO2lCQUNkLEdBQUcsQ0FBQztnQkFDSCxNQUFNLEVBQUUsQ0FBQyxRQUFRLENBQUM7YUFDbkIsQ0FBQztpQkFDRCxRQUFRLEVBQUU7WUFDYixRQUFRLEVBQUUsYUFBRyxDQUFDLE9BQU8sRUFBRSxDQUFDLE1BQU0sRUFBRTtTQUNqQyxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUM7UUFFYixNQUFNLEVBQUUsS0FBSyxFQUFFLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUUxQyx1QkFBdUI7UUFDdkIsSUFBSSxLQUFLLEVBQUU7WUFDVCxNQUFNLEtBQUssQ0FBQztTQUNiO1FBRUQsSUFBSSxDQUFDLElBQUksR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDO1FBQ3ZCLElBQUksQ0FBQyxRQUFRLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FBQztRQUNoQyxJQUFJLENBQUMsOEJBQThCLEdBQUcsSUFBSSxDQUFDO0lBQzdDLENBQUM7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