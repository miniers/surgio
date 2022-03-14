"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getShadowsocksSubscription = void 0;
const joi_1 = __importDefault(require("joi"));
const assert_1 = __importDefault(require("assert"));
const logger_1 = require("@surgio/logger");
const utils_1 = require("../utils");
const relayable_url_1 = __importDefault(require("../utils/relayable-url"));
const ss_1 = require("../utils/ss");
const Provider_1 = __importDefault(require("./Provider"));
const logger = (0, logger_1.createLogger)({
    service: 'surgio:ShadowsocksSubscribeProvider',
});
class ShadowsocksSubscribeProvider extends Provider_1.default {
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
        const { subscriptionUserinfo } = await (0, exports.getShadowsocksSubscription)(this.url, this.udpRelay);
        if (subscriptionUserinfo) {
            return subscriptionUserinfo;
        }
        return undefined;
    }
    async getNodeList() {
        const { nodeList } = await (0, exports.getShadowsocksSubscription)(this.url, this.udpRelay);
        return nodeList;
    }
}
exports.default = ShadowsocksSubscribeProvider;
/**
 * @see https://shadowsocks.org/en/spec/SIP002-URI-Scheme.html
 */
const getShadowsocksSubscription = async (url, udpRelay) => {
    (0, assert_1.default)(url, '未指定订阅地址 url');
    const response = await Provider_1.default.requestCacheableResource(url);
    const nodeList = (0, utils_1.fromBase64)(response.body)
        .split('\n')
        .filter((item) => !!item && item.startsWith('ss://'))
        .map((item) => {
        const nodeConfig = (0, ss_1.parseSSUri)(item);
        if (udpRelay !== void 0) {
            nodeConfig['udp-relay'] = udpRelay;
        }
        return nodeConfig;
    });
    return {
        nodeList,
        subscriptionUserinfo: response.subscriptionUserinfo,
    };
};
exports.getShadowsocksSubscription = getShadowsocksSubscription;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU2hhZG93c29ja3NTdWJzY3JpYmVQcm92aWRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi9wcm92aWRlci9TaGFkb3dzb2Nrc1N1YnNjcmliZVByb3ZpZGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLDhDQUFzQjtBQUN0QixvREFBNEI7QUFDNUIsMkNBQThDO0FBTzlDLG9DQUFzQztBQUN0QywyRUFBa0Q7QUFDbEQsb0NBQXlDO0FBQ3pDLDBEQUFrQztBQUVsQyxNQUFNLE1BQU0sR0FBRyxJQUFBLHFCQUFZLEVBQUM7SUFDMUIsT0FBTyxFQUFFLHFDQUFxQztDQUMvQyxDQUFDLENBQUM7QUFFSCxNQUFxQiw0QkFBNkIsU0FBUSxrQkFBUTtJQUloRSxZQUFZLElBQVksRUFBRSxNQUEwQztRQUNsRSxLQUFLLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBRXBCLE1BQU0sTUFBTSxHQUFHLGFBQUcsQ0FBQyxNQUFNLENBQUM7WUFDeEIsR0FBRyxFQUFFLGFBQUcsQ0FBQyxNQUFNLEVBQUU7aUJBQ2QsR0FBRyxDQUFDO2dCQUNILE1BQU0sRUFBRSxDQUFDLFFBQVEsQ0FBQzthQUNuQixDQUFDO2lCQUNELFFBQVEsRUFBRTtZQUNiLFFBQVEsRUFBRSxhQUFHLENBQUMsT0FBTyxFQUFFLENBQUMsTUFBTSxFQUFFO1NBQ2pDLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUViLE1BQU0sRUFBRSxLQUFLLEVBQUUsR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBRTFDLHVCQUF1QjtRQUN2QixJQUFJLEtBQUssRUFBRTtZQUNULE1BQU0sS0FBSyxDQUFDO1NBQ2I7UUFFRCxJQUFJLENBQUMsSUFBSSxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUM7UUFDdkIsSUFBSSxDQUFDLFFBQVEsR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDO1FBQ2hDLElBQUksQ0FBQyw4QkFBOEIsR0FBRyxJQUFJLENBQUM7SUFDN0MsQ0FBQztJQUVELHVCQUF1QjtJQUN2QixJQUFXLEdBQUc7UUFDWixPQUFPLElBQUEsdUJBQVksRUFBQyxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUNoRCxDQUFDO0lBRU0sS0FBSyxDQUFDLHVCQUF1QjtRQUdsQyxNQUFNLEVBQUUsb0JBQW9CLEVBQUUsR0FBRyxNQUFNLElBQUEsa0NBQTBCLEVBQy9ELElBQUksQ0FBQyxHQUFHLEVBQ1IsSUFBSSxDQUFDLFFBQVEsQ0FDZCxDQUFDO1FBRUYsSUFBSSxvQkFBb0IsRUFBRTtZQUN4QixPQUFPLG9CQUFvQixDQUFDO1NBQzdCO1FBQ0QsT0FBTyxTQUFTLENBQUM7SUFDbkIsQ0FBQztJQUVNLEtBQUssQ0FBQyxXQUFXO1FBQ3RCLE1BQU0sRUFBRSxRQUFRLEVBQUUsR0FBRyxNQUFNLElBQUEsa0NBQTBCLEVBQ25ELElBQUksQ0FBQyxHQUFHLEVBQ1IsSUFBSSxDQUFDLFFBQVEsQ0FDZCxDQUFDO1FBRUYsT0FBTyxRQUFRLENBQUM7SUFDbEIsQ0FBQztDQUNGO0FBdkRELCtDQXVEQztBQUVEOztHQUVHO0FBQ0ksTUFBTSwwQkFBMEIsR0FBRyxLQUFLLEVBQzdDLEdBQVcsRUFDWCxRQUFrQixFQUlqQixFQUFFO0lBQ0gsSUFBQSxnQkFBTSxFQUFDLEdBQUcsRUFBRSxhQUFhLENBQUMsQ0FBQztJQUUzQixNQUFNLFFBQVEsR0FBRyxNQUFNLGtCQUFRLENBQUMsd0JBQXdCLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDOUQsTUFBTSxRQUFRLEdBQUcsSUFBQSxrQkFBVSxFQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUM7U0FDdkMsS0FBSyxDQUFDLElBQUksQ0FBQztTQUNYLE1BQU0sQ0FBQyxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksSUFBSSxJQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1NBQ3BELEdBQUcsQ0FBQyxDQUFDLElBQUksRUFBeUIsRUFBRTtRQUNuQyxNQUFNLFVBQVUsR0FBRyxJQUFBLGVBQVUsRUFBQyxJQUFJLENBQUMsQ0FBQztRQUVwQyxJQUFJLFFBQVEsS0FBSyxLQUFLLENBQUMsRUFBRTtZQUN0QixVQUFVLENBQUMsV0FBVyxDQUFhLEdBQUcsUUFBUSxDQUFDO1NBQ2pEO1FBRUQsT0FBTyxVQUFVLENBQUM7SUFDcEIsQ0FBQyxDQUFDLENBQUM7SUFFTCxPQUFPO1FBQ0wsUUFBUTtRQUNSLG9CQUFvQixFQUFFLFFBQVEsQ0FBQyxvQkFBb0I7S0FDcEQsQ0FBQztBQUNKLENBQUMsQ0FBQztBQTNCVyxRQUFBLDBCQUEwQiw4QkEyQnJDIn0=