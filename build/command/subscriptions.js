"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
// istanbul ignore file
const common_bin_1 = __importDefault(require("common-bin"));
const fs_1 = require("fs");
const path_1 = require("path");
const logger_1 = require("@surgio/logger");
const config_1 = require("../utils/config");
const provider_1 = require("../provider");
const error_helper_1 = require("../utils/error-helper");
const subscription_1 = require("../utils/subscription");
const logger = (0, logger_1.createLogger)({
    service: 'surgio:SubscriptionsCommand',
});
class SubscriptionsCommand extends common_bin_1.default {
    constructor(rawArgv) {
        super(rawArgv);
        this.usage = '使用方法: surgio subscriptions';
        this.options = {
            c: {
                alias: 'config',
                demandOption: false,
                describe: 'Surgio 配置文件',
                default: './surgio.conf.js',
                type: 'string',
            },
        };
    }
    async run(ctx) {
        this.config = (0, config_1.loadConfig)(ctx.cwd, ctx.argv.config);
        const providerList = await this.listProviders();
        for (const provider of providerList) {
            if (provider.supportGetSubscriptionUserInfo) {
                const userInfo = await provider.getSubscriptionUserInfo();
                if (userInfo) {
                    const format = (0, subscription_1.formatSubscriptionUserInfo)(userInfo);
                    console.log('🤟 %s 已用流量：%s 剩余流量：%s 有效期至：%s', provider.name, format.used, format.left, format.expire);
                }
                else {
                    console.log('⚠️  无法查询 %s 的流量信息', provider.name);
                }
            }
            else {
                console.log('⚠️  无法查询 %s 的流量信息', provider.name);
            }
        }
    }
    // istanbul ignore next
    get description() {
        return '查询订阅流量';
    }
    // istanbul ignore next
    errorHandler(err) {
        error_helper_1.errorHandler.call(this, err);
    }
    async listProviders() {
        const files = await fs_1.promises.readdir(this.config.providerDir, {
            encoding: 'utf8',
        });
        const providerList = [];
        async function readProvider(path) {
            let provider;
            try {
                const providerName = (0, path_1.basename)(path, '.js');
                logger.debug('read %s %s', providerName, path);
                // eslint-disable-next-line prefer-const
                provider = await (0, provider_1.getProvider)(providerName, require(path));
            }
            catch (err) {
                logger.debug(`${path} 不是一个合法的模块`);
                return undefined;
            }
            if (!(provider === null || provider === void 0 ? void 0 : provider.type)) {
                logger.debug(`${path} 不是一个 Provider`);
                return undefined;
            }
            logger.debug('got provider %j', provider);
            return provider;
        }
        for (const file of files) {
            const result = await readProvider((0, path_1.join)(this.config.providerDir, file));
            if (result) {
                providerList.push(result);
            }
        }
        return providerList;
    }
}
module.exports = SubscriptionsCommand;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3Vic2NyaXB0aW9ucy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi9jb21tYW5kL3N1YnNjcmlwdGlvbnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLHVCQUF1QjtBQUN2Qiw0REFBaUM7QUFDakMsMkJBQXFDO0FBQ3JDLCtCQUFzQztBQUN0QywyQ0FBOEM7QUFVOUMsNENBQTZDO0FBQzdDLDBDQUEwQztBQUMxQyx3REFBcUQ7QUFDckQsd0RBQW1FO0FBRW5FLE1BQU0sTUFBTSxHQUFHLElBQUEscUJBQVksRUFBQztJQUMxQixPQUFPLEVBQUUsNkJBQTZCO0NBQ3ZDLENBQUMsQ0FBQztBQVVILE1BQU0sb0JBQXFCLFNBQVEsb0JBQU87SUFHeEMsWUFBWSxPQUFrQjtRQUM1QixLQUFLLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDZixJQUFJLENBQUMsS0FBSyxHQUFHLDRCQUE0QixDQUFDO1FBQzFDLElBQUksQ0FBQyxPQUFPLEdBQUc7WUFDYixDQUFDLEVBQUU7Z0JBQ0QsS0FBSyxFQUFFLFFBQVE7Z0JBQ2YsWUFBWSxFQUFFLEtBQUs7Z0JBQ25CLFFBQVEsRUFBRSxhQUFhO2dCQUN2QixPQUFPLEVBQUUsa0JBQWtCO2dCQUMzQixJQUFJLEVBQUUsUUFBUTthQUNmO1NBQ0YsQ0FBQztJQUNKLENBQUM7SUFFTSxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUc7UUFDbEIsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFBLG1CQUFVLEVBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBRW5ELE1BQU0sWUFBWSxHQUFHLE1BQU0sSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDO1FBRWhELEtBQUssTUFBTSxRQUFRLElBQUksWUFBWSxFQUFFO1lBQ25DLElBQUksUUFBUSxDQUFDLDhCQUE4QixFQUFFO2dCQUMzQyxNQUFNLFFBQVEsR0FBRyxNQUFNLFFBQVEsQ0FBQyx1QkFB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