"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTrojanSubscription = void 0;
const joi_1 = __importDefault(require("joi"));
const assert_1 = __importDefault(require("assert"));
const logger_1 = require("@surgio/logger");
const utils_1 = require("../utils");
const relayable_url_1 = __importDefault(require("../utils/relayable-url"));
const trojan_1 = require("../utils/trojan");
const Provider_1 = __importDefault(require("./Provider"));
const logger = (0, logger_1.createLogger)({
    service: 'surgio:TrojanProvider',
});
class TrojanProvider extends Provider_1.default {
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
        const { subscriptionUserinfo } = await (0, exports.getTrojanSubscription)(this.url, this.udpRelay, this.tls13);
        if (subscriptionUserinfo) {
            return subscriptionUserinfo;
        }
        return void 0;
    }
    async getNodeList() {
        const { nodeList } = await (0, exports.getTrojanSubscription)(this.url, this.udpRelay, this.tls13);
        return nodeList;
    }
}
exports.default = TrojanProvider;
/**
 * @see https://github.com/trojan-gfw/trojan-url/blob/master/trojan-url.py
 */
const getTrojanSubscription = async (url, udpRelay, tls13) => {
    (0, assert_1.default)(url, '未指定订阅地址 url');
    const response = await Provider_1.default.requestCacheableResource(url, {
        requestUserAgent: 'shadowrocket',
    });
    const config = (0, utils_1.fromBase64)(response.body);
    const nodeList = config
        .split('\n')
        .filter((item) => !!item && item.startsWith('trojan://'))
        .map((item) => {
        const nodeConfig = (0, trojan_1.parseTrojanUri)(item);
        return Object.assign(Object.assign({}, nodeConfig), { 'udp-relay': udpRelay, tls13 });
    });
    return {
        nodeList,
        subscriptionUserinfo: response.subscriptionUserinfo,
    };
};
exports.getTrojanSubscription = getTrojanSubscription;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVHJvamFuUHJvdmlkZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9saWIvcHJvdmlkZXIvVHJvamFuUHJvdmlkZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsOENBQXNCO0FBQ3RCLG9EQUE0QjtBQUM1QiwyQ0FBOEM7QUFPOUMsb0NBQXNDO0FBQ3RDLDJFQUFrRDtBQUNsRCw0Q0FBaUQ7QUFDakQsMERBQWtDO0FBRWxDLE1BQU0sTUFBTSxHQUFHLElBQUEscUJBQVksRUFBQztJQUMxQixPQUFPLEVBQUUsdUJBQXVCO0NBQ2pDLENBQUMsQ0FBQztBQUVILE1BQXFCLGNBQWUsU0FBUSxrQkFBUTtJQUtsRCxZQUFZLElBQVksRUFBRSxNQUE0QjtRQUNwRCxLQUFLLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBRXBCLE1BQU0sTUFBTSxHQUFHLGFBQUcsQ0FBQyxNQUFNLENBQUM7WUFDeEIsR0FBRyxFQUFFLGFBQUcsQ0FBQyxNQUFNLEVBQUU7aUJBQ2QsR0FBRyxDQUFDO2dCQUNILE1BQU0sRUFBRSxDQUFDLFFBQVEsQ0FBQzthQUNuQixDQUFDO2lCQUNELFFBQVEsRUFBRTtZQUNiLFFBQVEsRUFBRSxhQUFHLENBQUMsSUFBSSxFQUFFLENBQUMsTUFBTSxFQUFFO1lBQzdCLEtBQUssRUFBRSxhQUFHLENBQUMsSUFBSSxFQUFFLENBQUMsTUFBTSxFQUFFO1NBQzNCLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUViLE1BQU0sRUFBRSxLQUFLLEVBQUUsR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBRTFDLHVCQUF1QjtRQUN2QixJQUFJLEtBQUssRUFBRTtZQUNULE1BQU0sS0FBSyxDQUFDO1NBQ2I7UUFFRCxJQUFJLENBQUMsSUFBSSxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUM7UUFDdkIsSUFBSSxDQUFDLFFBQVEsR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDO1FBQ2hDLElBQUksQ0FBQyxLQUFLLEdBQUcsTUFBTSxDQUFDLEtBQUssQ0FBQztRQUMxQixJQUFJLENBQUMsOEJBQThCLEdBQUcsSUFBSSxDQUFDO0lBQzdDLENBQUM7SUFFRCx1QkFBdUI7SUFDdkIsSUFBVyxHQUFHO1FBQ1osT0FBTyxJQUFBLHVCQUFZLEVBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDaEQsQ0FBQztJQUVNLEtBQUssQ0FBQyx1QkFBdUI7UUFHbEMsTUFBTSxFQUFFLG9CQUFvQixFQUFFLEdBQUcsTUFBTSxJQUFBLDZCQUFxQixFQUMxRCxJQUFJLENBQUMsR0FBRyxFQUNSLElBQUksQ0FBQyxRQUFRLEVBQ2IsSUFBSSxDQUFDLEtBQUssQ0FDWCxDQUFDO1FBRUYsSUFBSSxvQkFBb0IsRUFBRTtZQUN4QixPQUFPLG9CQUFvQixDQUFDO1NBQzdCO1FBQ0QsT0FBTyxLQUFLLENBQUMsQ0FBQztJQUNoQixDQUFDO0lBRU0sS0FBSyxDQUFDLFdBQVc7UUFDdEIsTUFBTSxFQUFFLFFBQVEsRUFBRSxHQUFHLE1BQU0sSUFBQSw2QkFBcUIsRUFDOUMsSUFBSSxDQUFDLEdBQUcsRUFDUixJQUFJLENBQUMsUUFBUSxFQUNiLElBQUksQ0FBQyxLQUFLLENBQ1gsQ0FBQztRQUVGLE9BQU8sUUFBUSxDQUFDO0lBQ2xCLENBQUM7Q0FDRjtBQTVERCxpQ0E0REM7QUFFRDs7R0FFRztBQUNJLE1BQU0scUJBQXFCLEdBQUcsS0FBSyxFQUN4QyxHQUFXLEVBQ1gsUUFBa0IsRUFDbEIsS0FBZSxFQUlkLEVBQUU7SUFDSCxJQUFBLGdCQUFNLEVBQUMsR0FBRyxFQUFFLGFBQWEsQ0FBQyxDQUFDO0lBRTNCLE1BQU0sUUFBUSxHQUFHLE1BQU0sa0JBQVEsQ0FBQyx3QkFBd0IsQ0FBQyxHQUFHLEVBQUU7UUFDNUQsZ0JBQWdCLEVBQUUsY0FBYztLQUNqQyxDQUFDLENBQUM7SUFDSCxNQUFNLE1BQU0sR0FBRyxJQUFBLGtCQUFVLEVBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3pDLE1BQU0sUUFBUSxHQUFHLE1BQU07U0FDcEIsS0FBSyxDQUFDLElBQUksQ0FBQztTQUNYLE1BQU0sQ0FBQyxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksSUFBSSxJQUFJLENBQUMsVUFBVSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1NBQ3hELEdBQUcsQ0FBQyxDQUFDLElBQUksRUFBb0IsRUFBRTtRQUM5QixNQUFNLFVBQVUsR0FBRyxJQUFBLHVCQUFjLEVBQUMsSUFBSSxDQUFDLENBQUM7UUFFeEMsdUNBQ0ssVUFBVSxLQUNiLFdBQVcsRUFBRSxRQUFRLEVBQ3JCLEtBQUssSUFDTDtJQUNKLENBQUMsQ0FBQyxDQUFDO0lBRUwsT0FBTztRQUNMLFFBQVE7UUFDUixvQkFBb0IsRUFBRSxRQUFRLENBQUMsb0JBQW9CO0tBQ3BELENBQUM7QUFDSixDQUFDLENBQUM7QUEvQlcsUUFBQSxxQkFBcUIseUJBK0JoQyJ9