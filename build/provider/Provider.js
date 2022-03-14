"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = require("@surgio/logger");
const joi_1 = __importDefault(require("joi"));
const types_1 = require("../types");
const cache_1 = require("../utils/cache");
const http_client_1 = __importDefault(require("../utils/http-client"));
const subscription_1 = require("../utils/subscription");
const logger = (0, logger_1.createLogger)({
    service: 'surgio:Provider',
});
class Provider {
    constructor(name, config) {
        this.name = name;
        const schema = joi_1.default.object({
            type: joi_1.default.string()
                .valid(...Object.values(types_1.SupportProviderEnum))
                .required(),
            nodeFilter: joi_1.default.any().allow(joi_1.default.function(), joi_1.default.object({
                filter: joi_1.default.function(),
                supportSort: joi_1.default.boolean().strict(),
            })),
            netflixFilter: joi_1.default.any().allow(joi_1.default.function(), joi_1.default.object({
                filter: joi_1.default.function(),
                supportSort: joi_1.default.boolean().strict(),
            })),
            youtubePremiumFilter: joi_1.default.any().allow(joi_1.default.function(), joi_1.default.object({
                filter: joi_1.default.function(),
                supportSort: joi_1.default.boolean().strict(),
            })),
            customFilters: joi_1.default.object().pattern(joi_1.default.string(), joi_1.default.any().allow(joi_1.default.function(), joi_1.default.object({
                filter: joi_1.default.function(),
                supportSort: joi_1.default.boolean().strict(),
            }))),
            addFlag: joi_1.default.boolean().strict(),
            removeExistingFlag: joi_1.default.boolean().strict(),
            mptcp: joi_1.default.boolean().strict(),
            tfo: joi_1.default.boolean().strict(),
            startPort: joi_1.default.number().integer().min(1024).max(65535),
            relayUrl: [joi_1.default.boolean().strict(), joi_1.default.string()],
            renameNode: joi_1.default.function(),
        }).unknown();
        const { error } = schema.validate(config);
        // istanbul ignore next
        if (error) {
            throw error;
        }
        this.supportGetSubscriptionUserInfo = false;
        [
            'type',
            'nodeFilter',
            'netflixFilter',
            'youtubePremiumFilter',
            'customFilters',
            'addFlag',
            'removeExistingFlag',
            'tfo',
            'mptcp',
            'startPort',
            'renameNode',
            'relayUrl',
        ].forEach((key) => {
            this[key] = config[key];
        });
    }
    static async requestCacheableResource(url, options = {}) {
        return cache_1.SubscriptionCache.has(url)
            ? cache_1.SubscriptionCache.get(url)
            : await (async () => {
                const headers = {};
                if (options.requestUserAgent) {
                    headers['user-agent'] = options.requestUserAgent;
                }
                const res = await http_client_1.default.get(url, {
                    responseType: 'text',
                    headers,
                });
                const subsciptionCacheItem = {
                    body: res.body,
                };
                if (res.headers['subscription-userinfo']) {
                    subsciptionCacheItem.subscriptionUserinfo =
                        (0, subscription_1.parseSubscriptionUserInfo)(res.headers['subscription-userinfo']);
                    logger.debug('%s received subscription userinfo - raw: %s | parsed: %j', url, res.headers['subscription-userinfo'], subsciptionCacheItem.subscriptionUserinfo);
                }
                cache_1.SubscriptionCache.set(url, subsciptionCacheItem);
                return subsciptionCacheItem;
            })();
    }
    get nextPort() {
        if (this.startPort) {
            return this.startPort++;
        }
        return 0;
    }
    // istanbul ignore next
    async getSubscriptionUserInfo() {
        throw new Error('此 Provider 不支持该功能');
    }
    // istanbul ignore next
    getNodeList() {
        return Promise.resolve([]);
    }
}
exports.default = Provider;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUHJvdmlkZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9saWIvcHJvdmlkZXIvUHJvdmlkZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSwyQ0FBOEM7QUFDOUMsOENBQXNCO0FBRXRCLG9DQUtrQjtBQUNsQiwwQ0FBeUU7QUFDekUsdUVBQThDO0FBQzlDLHdEQUFrRTtBQUVsRSxNQUFNLE1BQU0sR0FBRyxJQUFBLHFCQUFZLEVBQUM7SUFDMUIsT0FBTyxFQUFFLGlCQUFpQjtDQUMzQixDQUFDLENBQUM7QUFFSCxNQUFxQixRQUFRO0lBaUIzQixZQUFtQixJQUFZLEVBQUUsTUFBc0I7UUFBcEMsU0FBSSxHQUFKLElBQUksQ0FBUTtRQUM3QixNQUFNLE1BQU0sR0FBRyxhQUFHLENBQUMsTUFBTSxDQUFDO1lBQ3hCLElBQUksRUFBRSxhQUFHLENBQUMsTUFBTSxFQUFFO2lCQUNmLEtBQUssQ0FBQyxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQVMsMkJBQW1CLENBQUMsQ0FBQztpQkFDcEQsUUFBUSxFQUFFO1lBQ2IsVUFBVSxFQUFFLGFBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxLQUFLLENBQ3pCLGFBQUcsQ0FBQyxRQUFRLEVBQUUsRUFDZCxhQUFHLENBQUMsTUFBTSxDQUFDO2dCQUNULE1BQU0sRUFBRSxhQUFHLENBQUMsUUFBUSxFQUFFO2dCQUN0QixXQUFXLEVBQUUsYUFBRyxDQUFDLE9BQU8sRUFBRSxDQUFDLE1BQU0sRUFBRTthQUNwQyxDQUFDLENBQ0g7WUFDRCxhQUFhLEVBQUUsYUFBRyxDQUFDLEdBQUcsRUFBRSxDQUFDLEtBQUssQ0FDNUIsYUFBRyxDQUFDLFFBQVEsRUFBRSxFQUNkLGFBQUcsQ0FBQyxNQUFNLENBQUM7Z0JBQ1QsTUFBTSxFQUFFLGFBQUcsQ0FBQyxRQUFRLEVBQUU7Z0JBQ3RCLFdBQVcsRUFBRSxhQUFHLENBQUMsT0FBTyxFQUFFLENBQUMsTUFBTSxFQUFFO2FBQ3BDLENBQUMsQ0FDSDtZ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