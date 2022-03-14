"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseJSONConfig = exports.getV2rayNSubscription = void 0;
const joi_1 = __importDefault(require("joi"));
const logger_1 = require("@surgio/logger");
const assert_1 = __importDefault(require("assert"));
const types_1 = require("../types");
const utils_1 = require("../utils");
const cache_1 = require("../utils/cache");
const http_client_1 = __importDefault(require("../utils/http-client"));
const relayable_url_1 = __importDefault(require("../utils/relayable-url"));
const ss_1 = require("../utils/ss");
const Provider_1 = __importDefault(require("./Provider"));
class V2rayNSubscribeProvider extends Provider_1.default {
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
            compatibleMode: joi_1.default.bool().strict(),
            skipCertVerify: joi_1.default.bool().strict(),
        }).unknown();
        const { error } = schema.validate(config);
        // istanbul ignore next
        if (error) {
            throw error;
        }
        this._url = config.url;
        this.compatibleMode = config.compatibleMode;
        this.skipCertVerify = config.skipCertVerify;
        this.tls13 = config.tls13;
        this.udpRelay = config.udpRelay;
    }
    // istanbul ignore next
    get url() {
        return (0, relayable_url_1.default)(this._url, this.relayUrl);
    }
    getNodeList() {
        return (0, exports.getV2rayNSubscription)(this.url, this.compatibleMode, this.skipCertVerify, this.udpRelay, this.tls13);
    }
}
exports.default = V2rayNSubscribeProvider;
/**
 * @see https://github.com/2dust/v2rayN/wiki/%E5%88%86%E4%BA%AB%E9%93%BE%E6%8E%A5%E6%A0%BC%E5%BC%8F%E8%AF%B4%E6%98%8E(ver-2)
 */
const getV2rayNSubscription = async (url, isCompatibleMode, skipCertVerify, udpRelay, tls13) => {
    (0, assert_1.default)(url, '未指定订阅地址 url');
    if (isCompatibleMode) {
        logger_1.logger.warn('运行在兼容模式，请注意生成的节点是否正确。');
    }
    async function requestConfigFromRemote() {
        const response = cache_1.ConfigCache.has(url)
            ? cache_1.ConfigCache.get(url)
            : await (async () => {
                const res = await http_client_1.default.get(url);
                cache_1.ConfigCache.set(url, res.body);
                return res.body;
            })();
        const configList = (0, utils_1.fromBase64)(response)
            .split('\n')
            .filter((item) => !!item)
            .filter((item) => {
            const pick = item.startsWith('vmess://') || item.startsWith('ss://');
            if (!pick) {
                logger_1.logger.warn(`不支持读取 V2rayN 订阅中的节点 ${item}，该节点会被省略。`);
            }
            return pick;
        });
        return configList
            .map((item) => {
            if (item.startsWith('vmess://')) {
                return (0, exports.parseJSONConfig)((0, utils_1.fromBase64)(item.replace('vmess://', '')), isCompatibleMode, skipCertVerify, udpRelay, tls13);
            }
            if (item.startsWith('ss://')) {
                return Object.assign(Object.assign({}, (0, ss_1.parseSSUri)(item)), { 'udp-relay': udpRelay, skipCertVerify: skipCertVerify, tls13: tls13 });
            }
            return undefined;
        })
            .filter((item) => !!item);
    }
    return await requestConfigFromRemote();
};
exports.getV2rayNSubscription = getV2rayNSubscription;
const parseJSONConfig = (json, isCompatibleMode, skipCertVerify, udpRelay, tls13) => {
    const config = JSON.parse(json);
    // istanbul ignore next
    if (!isCompatibleMode && (!config.v || Number(config.v) !== 2)) {
        throw new Error(`该节点 ${config.ps} 可能不是一个有效的 V2rayN 节点。请参考 http://url.royli.dev/Qtrci 进行排查, 或者将解析模式改为兼容模式`);
    }
    // istanbul ignore next
    if (['kcp', 'http'].indexOf(config.net) > -1) {
        logger_1.logger.warn(`不支持读取 network 类型为 ${config.net} 的 Vmess 节点，节点 ${config.ps} 会被省略。`);
        return undefined;
    }
    return Object.assign({ nodeName: config.ps, type: types_1.NodeTypeEnum.Vmess, hostname: config.add, port: config.port, method: 'auto', uuid: config.id, alterId: config.aid || '0', network: config.net, tls: config.tls === 'tls', host: config.host, path: config.path || '/', 'udp-relay': udpRelay === true }, (config.tls === 'tls'
        ? {
            skipCertVerify: skipCertVerify !== null && skipCertVerify !== void 0 ? skipCertVerify : false,
            tls13: tls13 !== null && tls13 !== void 0 ? tls13 : false,
        }
        : null));
};
exports.parseJSONConfig = parseJSONConfig;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVjJyYXlOU3Vic2NyaWJlUHJvdmlkZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9saWIvcHJvdmlkZXIvVjJyYXlOU3Vic2NyaWJlUHJvdmlkZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsOENBQXNCO0FBQ3RCLDJDQUF3QztBQUN4QyxvREFBNEI7QUFFNUIsb0NBS2tCO0FBQ2xCLG9DQUFzQztBQUN0QywwQ0FBNkM7QUFDN0MsdUVBQThDO0FBQzlDLDJFQUFrRDtBQUNsRCxvQ0FBeUM7QUFDekMsMERBQWtDO0FBRWxDLE1BQXFCLHVCQUF3QixTQUFRLGtCQUFRO0lBUTNELFlBQVksSUFBWSxFQUFFLE1BQXFDO1FBQzdELEtBQUssQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFFcEIsTUFBTSxNQUFNLEdBQUcsYUFBRyxDQUFDLE1BQU0sQ0FBQztZQUN4QixHQUFHLEVBQUUsYUFBRyxDQUFDLE1BQU0sRUFBRTtpQkFDZCxHQUFHLENBQUM7Z0JBQ0gsTUFBTSxFQUFFLENBQUMsUUFBUSxDQUFDO2FBQ25CLENBQUM7aUJBQ0QsUUFBUSxFQUFFO1lBQ2IsUUFBUSxFQUFFLGFBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxNQUFNLEVBQUU7WUFDN0IsS0FBSyxFQUFFLGFBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxNQUFNLEVBQUU7WUFDMUIsY0FBYyxFQUFFLGFBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxNQUFNLEVBQUU7WUFDbkMsY0FBYyxFQUFFLGFBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxNQUFNLEVBQUU7U0FDcEMsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDO1FBRWIsTUFBTSxFQUFFLEtBQUssRUFBRSxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUM7UUFFMUMsdUJBQXVCO1FBQ3ZCLElBQUksS0FBSyxFQUFFO1lBQ1QsTUFBTSxLQUFLLENBQUM7U0FDYjtRQUVELElBQUks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