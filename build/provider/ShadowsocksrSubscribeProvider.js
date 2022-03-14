"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getShadowsocksrSubscription = void 0;
const joi_1 = __importDefault(require("joi"));
const logger_1 = require("@surgio/logger");
const assert_1 = __importDefault(require("assert"));
const utils_1 = require("../utils");
const relayable_url_1 = __importDefault(require("../utils/relayable-url"));
const subscription_1 = require("../utils/subscription");
const ssr_1 = require("../utils/ssr");
const Provider_1 = __importDefault(require("./Provider"));
const logger = (0, logger_1.createLogger)({
    service: 'surgio:ShadowsocksrSubscribeProvider',
});
class ShadowsocksrSubscribeProvider extends Provider_1.default {
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
        const { subscriptionUserinfo } = await (0, exports.getShadowsocksrSubscription)(this.url, this.udpRelay);
        if (subscriptionUserinfo) {
            return subscriptionUserinfo;
        }
        return undefined;
    }
    async getNodeList() {
        const { nodeList } = await (0, exports.getShadowsocksrSubscription)(this.url, this.udpRelay);
        return nodeList;
    }
}
exports.default = ShadowsocksrSubscribeProvider;
const getShadowsocksrSubscription = async (url, udpRelay) => {
    (0, assert_1.default)(url, '未指定订阅地址 url');
    const response = await Provider_1.default.requestCacheableResource(url);
    const nodeList = (0, utils_1.fromBase64)(response.body)
        .split('\n')
        .filter((item) => !!item && item.startsWith('ssr://'))
        .map((str) => {
        const nodeConfig = (0, ssr_1.parseSSRUri)(str);
        if (udpRelay !== void 0) {
            nodeConfig['udp-relay'] = udpRelay;
        }
        return nodeConfig;
    });
    if (!response.subscriptionUserinfo &&
        nodeList[0].nodeName.includes('剩余流量')) {
        const dataNode = nodeList[0];
        const expireNode = nodeList[1];
        response.subscriptionUserinfo = (0, subscription_1.parseSubscriptionNode)(dataNode.nodeName, expireNode.nodeName);
        logger.debug('%s received subscription node - raw: %s %s | parsed: %j', url, dataNode.nodeName, expireNode.nodeName, response.subscriptionUserinfo);
    }
    return {
        nodeList,
        subscriptionUserinfo: response.subscriptionUserinfo,
    };
};
exports.getShadowsocksrSubscription = getShadowsocksrSubscription;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU2hhZG93c29ja3NyU3Vic2NyaWJlUHJvdmlkZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9saWIvcHJvdmlkZXIvU2hhZG93c29ja3NyU3Vic2NyaWJlUHJvdmlkZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsOENBQXNCO0FBQ3RCLDJDQUE4QztBQUM5QyxvREFBNEI7QUFPNUIsb0NBQXNDO0FBQ3RDLDJFQUFrRDtBQUNsRCx3REFBOEQ7QUFDOUQsc0NBQTJDO0FBQzNDLDBEQUFrQztBQUVsQyxNQUFNLE1BQU0sR0FBRyxJQUFBLHFCQUFZLEVBQUM7SUFDMUIsT0FBTyxFQUFFLHNDQUFzQztDQUNoRCxDQUFDLENBQUM7QUFFSCxNQUFxQiw2QkFBOEIsU0FBUSxrQkFBUTtJQUlqRSxZQUFZLElBQVksRUFBRSxNQUEyQztRQUNuRSxLQUFLLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBRXBCLE1BQU0sTUFBTSxHQUFHLGFBQUcsQ0FBQyxNQUFNLENBQUM7WUFDeEIsR0FBRyxFQUFFLGFBQUcsQ0FBQyxNQUFNLEVBQUU7aUJBQ2QsR0FBRyxDQUFDO2dCQUNILE1BQU0sRUFBRSxDQUFDLFFBQVEsQ0FBQzthQUNuQixDQUFDO2lCQUNELFFBQVEsRUFBRTtZQUNiLFFBQVEsRUFBRSxhQUFHLENBQUMsT0FBTyxFQUFFLENBQUMsTUFBTSxFQUFFO1NBQ2pDLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUViLE1BQU0sRUFBRSxLQUFLLEVBQUUsR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBRTFDLHVCQUF1QjtRQUN2QixJQUFJLEtBQUssRUFBRTtZQUNULE1BQU0sS0FBSyxDQUFDO1NBQ2I7UUFFRCxJQUFJLENBQUMsSUFBSSxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUM7UUFDdkIsSUFBSSxDQUFDLFFBQVEsR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDO1FBQ2hDLElBQUks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