"use strict";
// istanbul ignore file
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const assert_1 = __importDefault(require("assert"));
const types_1 = require("../types");
const cache_1 = require("../utils/cache");
const http_client_1 = __importDefault(require("../utils/http-client"));
const Provider_1 = __importDefault(require("./Provider"));
class BlackSSLProvider extends Provider_1.default {
    constructor(name, config) {
        super(name, config);
        const schema = joi_1.default.object({
            username: joi_1.default.string().required(),
            password: joi_1.default.string().required(),
        }).unknown();
        const { error } = schema.validate(config);
        // istanbul ignore next
        if (error) {
            throw error;
        }
        this.username = config.username;
        this.password = config.password;
        this.supportGetSubscriptionUserInfo = true;
    }
    async getSubscriptionUserInfo() {
        const { subscriptionUserinfo } = await this.getBlackSSLConfig(this.username, this.password);
        if (subscriptionUserinfo) {
            return subscriptionUserinfo;
        }
        return void 0;
    }
    async getNodeList() {
        const { nodeList } = await this.getBlackSSLConfig(this.username, this.password);
        return nodeList;
    }
    // istanbul ignore next
    async getBlackSSLConfig(username, password) {
        (0, assert_1.default)(username, '未指定 BlackSSL username.');
        (0, assert_1.default)(password, '未指定 BlackSSL password.');
        const key = `blackssl_${username}`;
        const response = cache_1.ConfigCache.has(key)
            ? JSON.parse(cache_1.ConfigCache.get(key))
            : await (async () => {
                const res = await http_client_1.default.get('https://api.darkssl.com/v1/service/ssl_info', {
                    searchParams: {
                        username,
                        password,
                    },
                    headers: {
                        'user-agent': 'GoAgentX/774 CFNetwork/901.1 Darwin/17.6.0 (x86_64)',
                    },
                });
                cache_1.ConfigCache.set(key, res.body);
                return JSON.parse(res.body);
            })();
        return {
            nodeList: response.ssl_nodes.map((item) => ({
                nodeName: item.name,
                type: types_1.NodeTypeEnum.HTTPS,
                hostname: item.server,
                port: item.port,
                username,
                password,
            })),
            subscriptionUserinfo: {
                upload: 0,
                download: response.transfer_used,
                total: response.transfer_enable,
                expire: response.expired_at,
            },
        };
    }
}
exports.default = BlackSSLProvider;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQmxhY2tTU0xQcm92aWRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi9wcm92aWRlci9CbGFja1NTTFByb3ZpZGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSx1QkFBdUI7Ozs7O0FBRXZCLDhDQUFzQjtBQUN0QixvREFBNEI7QUFFNUIsb0NBS2tCO0FBQ2xCLDBDQUE2QztBQUM3Qyx1RUFBOEM7QUFDOUMsMERBQWtDO0FBRWxDLE1BQXFCLGdCQUFpQixTQUFRLGtCQUFRO0lBSXBELFlBQVksSUFBWSxFQUFFLE1BQThCO1FBQ3RELEtBQUssQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFFcEIsTUFBTSxNQUFNLEdBQUcsYUFBRyxDQUFDLE1BQU0sQ0FBQztZQUN4QixRQUFRLEVBQUUsYUFBRyxDQUFDLE1BQU0sRUFBRSxDQUFDLFFBQVEsRUFBRTtZQUNqQyxRQUFRLEVBQUUsYUFBRyxDQUFDLE1BQU0sRUFBRSxDQUFDLFFBQVEsRUFBRTtTQUNsQyxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUM7UUFFYixNQUFNLEVBQUUsS0FBSyxFQUFFLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUUxQyx1QkFBdUI7UUFDdkIsSUFBSSxLQUFLLEVBQUU7WUFDVCxNQUFNLEtBQUssQ0FBQztTQUNiO1FBRUQsSUFBSSxDQUFDLFFBQVEsR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDO1FBQ2hDLElBQUksQ0FBQyxRQUFRLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FBQztRQUNoQyxJQUFJLENBQUMsOEJBQThCLEdBQUcsSUFBSSxDQUFDO0lBQzdDLENBQUM7SUFFTSxLQUFLLENBQUMsdUJBQXVCO1FBR2xDLE1BQU0sRUFBRSxvQkFBb0IsRUFBRSxHQUFHLE1BQU0sSUFBSSxDQUFDLGlCQUFpQixDQUMzRCxJQUFJLENBQUMsUUFBUSxFQUNiLElBQUksQ0FBQyxRQUFRLENBQ2QsQ0FBQztRQUVGLElBQUksb0JBQW9CLEVBQUU7WUFDeEIsT0FBTyxvQkFBb0IsQ0FBQztTQUM3QjtRQUNELE9BQU8sS0FBSyxDQUFDLENBQUM7SUFDaEIsQ0FBQztJQUVNLEtBQUssQ0FBQyxXQUFXO1FBQ3RCLE1BQU0sRUFBRSxRQUFRLEVBQUUsR0FBRyxNQUFNLElBQUksQ0FBQyxpQkFBaUIsQ0FDL0MsSUFBSSxDQUFDLFFBQVEsRUFDYixJQUFJLENBQUMsUUFBUSxDQUNkLENBQUM7UUFDRixPQUFPLFFBQVEsQ0FBQztJQUNsQixDQUFDO0lBRUQsdUJBQXVCO0lBQ2YsS0FBSyxDQUFDLGlCQUFpQixDQUM3QixRQUFnQixFQUNoQixRQUFnQjtRQUtoQixJQUFBLGdCQUFNLEVBQUMsUUFBUSxFQUFFLHdCQUF3QixDQUFDLENBQUM7UUFDM0MsSUFBQSxnQkFBTSxFQUFDLFFBQVEsRUFBRSx3QkFBd0IsQ0FBQyxDQUFDO1FBRTNDLE1BQU0sR0FBRyxHQUFHLFlBQVksUUFBUSxFQUFFLENBQUM7UUFFbkMsTUFBTSxRQUFRLEdBQUcsbUJBQVcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDO1lBQ25DLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLG1CQUFXLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBVyxDQUFDO1lBQzVDLENBQUMsQ0FBQyxNQUFNLENBQUMsS0FBSyxJQUFJLEVBQUU7Z0JBQ2hCLE1BQU0sR0FBRyxHQUFHLE1BQU0scUJBQVUsQ0FBQyxHQUFHLENBQzlCLDZDQUE2QyxFQUM3QztvQkFDRSxZQUFZLEVBQUU7d0JBQ1osUUFBUTt3QkFDUixRQUFRO3FCQUNUO29CQUNELE9BQU8sRUFBRTt3QkFDUCxZQUFZLEVBQ1YscURBQXFEO3FCQUN4RDtpQkFDRixDQUNGLENBQUM7Z0JBRUYsbUJBQVcsQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFFL0IsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUM5QixDQUFDLENBQUMsRUFBRSxDQUFDO1FBRVQsT0FBTztZQUNMLFFBQVEsRUFBRyxRQUFRLENBQUMsU0FBNEIsQ0FBQyxHQUFHLENBQ2xELENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxDQUFDO2dCQUNULFFBQVEsRUFBRSxJQUFJLENBQUMsSUFBSTtnQkFDbkIsSUFBSSxFQUFFLG9CQUFZLENBQUMsS0FBSztnQkFDeEIsUUFBUSxFQUFFLElBQUksQ0FBQyxNQUFNO2dCQUNyQixJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUk7Z0JBQ2YsUUFBUTtnQkFDUixRQUFRO2FBQ1QsQ0FBQyxDQUNIO1lBQ0Qsb0JBQW9CLEVBQUU7Z0JBQ3BCLE1BQU0sRUFBRSxDQUFDO2dCQUNULFFBQVEsRUFBRSxRQUFRLENBQUMsYUFBYTtnQkFDaEMsS0FBSyxFQUFFLFFBQVEsQ0FBQyxlQUFlO2dCQUMvQixNQUFNLEVBQUUsUUFBUSxDQUFDLFVBQVU7YUFDNUI7U0FDRixDQUFDO0lBQ0osQ0FBQztDQUNGO0FBcEdELG1DQW9HQyJ9