"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProvider = void 0;
const types_1 = require("../types");
const BlackSSLProvider_1 = __importDefault(require("./BlackSSLProvider"));
const ClashProvider_1 = __importDefault(require("./ClashProvider"));
const CustomProvider_1 = __importDefault(require("./CustomProvider"));
const ShadowsocksJsonSubscribeProvider_1 = __importDefault(require("./ShadowsocksJsonSubscribeProvider"));
const ShadowsocksrSubscribeProvider_1 = __importDefault(require("./ShadowsocksrSubscribeProvider"));
const ShadowsocksSubscribeProvider_1 = __importDefault(require("./ShadowsocksSubscribeProvider"));
const SsdProvider_1 = __importDefault(require("./SsdProvider"));
const TrojanProvider_1 = __importDefault(require("./TrojanProvider"));
const V2rayNSubscribeProvider_1 = __importDefault(require("./V2rayNSubscribeProvider"));
async function getProvider(name, config) {
    // 函数形式，需要先获取到返回值
    if (typeof config === 'function') {
        config = await config();
    }
    switch (config.type) {
        case types_1.SupportProviderEnum.BlackSSL:
            return new BlackSSLProvider_1.default(name, config);
        case types_1.SupportProviderEnum.ShadowsocksJsonSubscribe:
            return new ShadowsocksJsonSubscribeProvider_1.default(name, config);
        case types_1.SupportProviderEnum.ShadowsocksSubscribe:
            return new ShadowsocksSubscribeProvider_1.default(name, config);
        case types_1.SupportProviderEnum.ShadowsocksrSubscribe:
            return new ShadowsocksrSubscribeProvider_1.default(name, config);
        case types_1.SupportProviderEnum.Custom: {
            return new CustomProvider_1.default(name, config);
        }
        case types_1.SupportProviderEnum.V2rayNSubscribe:
            return new V2rayNSubscribeProvider_1.default(name, config);
        case types_1.SupportProviderEnum.Clash:
            return new ClashProvider_1.default(name, config);
        case types_1.SupportProviderEnum.Ssd:
            return new SsdProvider_1.default(name, config);
        case types_1.SupportProviderEnum.Trojan:
            return new TrojanProvider_1.default(name, config);
        default:
            throw new Error(`Unsupported provider type: ${config.type}`);
    }
}
exports.getProvider = getProvider;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9saWIvcHJvdmlkZXIvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsb0NBQStDO0FBQy9DLDBFQUFrRDtBQUNsRCxvRUFBNEM7QUFDNUMsc0VBQThDO0FBQzlDLDBHQUFrRjtBQUNsRixvR0FBNEU7QUFDNUUsa0dBQTBFO0FBQzFFLGdFQUF3QztBQUN4QyxzRUFBOEM7QUFFOUMsd0ZBQWdFO0FBSXpELEtBQUssVUFBVSxXQUFXLENBQy9CLElBQVksRUFDWixNQUFXO0lBRVgsaUJBQWlCO0lBQ2pCLElBQUksT0FBTyxNQUFNLEtBQUssVUFBVSxFQUFFO1FBQ2hDLE1BQU0sR0FBRyxNQUFNLE1BQU0sRUFBRSxDQUFDO0tBQ3pCO0lBRUQsUUFBUSxNQUFNLENBQUMsSUFBSSxFQUFFO1FBQ25CLEtBQUssMkJBQW1CLENBQUMsUUFBUTtZQUMvQixPQUFPLElBQUksMEJBQWdCLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBRTVDLEtBQUssMkJBQW1CLENBQUMsd0JBQXdCO1lBQy9DLE9BQU8sSUFBSSwwQ0FBZ0MsQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFFNUQsS0FBSywyQkFBbUIsQ0FBQyxvQkFBb0I7WUFDM0MsT0FBTyxJQUFJLHNDQUE0QixDQUFDLElBQUksRUFBRSxNQUFNLENBQUMsQ0FBQztRQUV4RCxLQUFLLDJCQUFtQixDQUFDLHFCQUFxQjtZQUM1QyxPQUFPLElBQUksdUNBQTZCLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBRXpELEtBQUssMkJBQW1CLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDL0IsT0FBTyxJQUFJLHdCQUFjLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1NBQ3pDO1FBRUQsS0FBSywyQkFBbUIsQ0FBQyxlQUFlO1lBQ3RDLE9BQU8sSUFBSSxpQ0FBdUIsQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFFbkQsS0FBSywyQkFBbUIsQ0FBQyxLQUFLO1lBQzVCLE9BQU8sSUFBSSx1QkFBYSxDQUFDLElBQUksRUFBRSxNQUFNLENBQUMsQ0FBQztRQUV6QyxLQUFLLDJCQUFtQixDQUFDLEdBQUc7WUFDMUIsT0FBTyxJQUFJLHFCQUFXLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBRXZDLEtBQUssMkJBQW1CLENBQUMsTUFBTTtZQUM3QixPQUFPLElBQUksd0JBQWMsQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFFMUM7WUFDRSxNQUFNLElBQUksS0FBSyxDQUFDLDhCQUE4QixNQUFNLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQztLQUNoRTtBQUNILENBQUM7QUF6Q0Qsa0NBeUNDIn0=