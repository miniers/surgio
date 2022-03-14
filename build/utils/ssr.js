"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseSSRUri = void 0;
const debug_1 = __importDefault(require("debug"));
const types_1 = require("../types");
const index_1 = require("./index");
const debug = (0, debug_1.default)('surgio:utils:ssr');
/**
 * 协议：https://github.com/shadowsocksr-backup/shadowsocks-rss/wiki/SSR-QRcode-scheme
 * ssr://xxx:xxx:xxx:xxx:xxx:xxx/?a=1&b=2
 * ssr://xxx:xxx:xxx:xxx:xxx:xxx
 */
const parseSSRUri = (str) => {
    var _a, _b;
    const scheme = (0, index_1.fromUrlSafeBase64)(str.replace('ssr://', ''));
    const configArray = scheme.split('/');
    const basicInfo = configArray[0].split(':');
    debug('SSR URI', scheme);
    // 去除首部分
    configArray.shift();
    const extraString = configArray.join('/');
    const extras = extraString ? getUrlParameters(extraString) : {};
    const password = (0, index_1.fromUrlSafeBase64)(basicInfo.pop());
    const obfs = basicInfo.pop();
    const method = basicInfo.pop();
    const protocol = basicInfo.pop();
    const port = basicInfo.pop();
    const hostname = basicInfo.join(':');
    const nodeName = extras.remarks
        ? (0, index_1.fromUrlSafeBase64)(extras.remarks)
        : `${hostname}:${port}`;
    return {
        type: types_1.NodeTypeEnum.Shadowsocksr,
        nodeName,
        hostname,
        port,
        protocol,
        method,
        obfs,
        password,
        protoparam: (0, index_1.fromUrlSafeBase64)((_a = extras.protoparam) !== null && _a !== void 0 ? _a : '').replace(/\s/g, ''),
        obfsparam: (0, index_1.fromUrlSafeBase64)((_b = extras.obfsparam) !== null && _b !== void 0 ? _b : '').replace(/\s/g, ''),
    };
};
exports.parseSSRUri = parseSSRUri;
function getUrlParameters(url) {
    const result = {};
    url.replace(/[?&]+([^=&]+)=([^&#]*)/gi, (origin, k, v) => {
        result[k] = v;
        return origin;
    });
    return result;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3NyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vbGliL3V0aWxzL3Nzci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxrREFBMEI7QUFFMUIsb0NBQWdFO0FBQ2hFLG1DQUE0QztBQUU1QyxNQUFNLEtBQUssR0FBRyxJQUFBLGVBQUssRUFBQyxrQkFBa0IsQ0FBQyxDQUFDO0FBRXhDOzs7O0dBSUc7QUFDSSxNQUFNLFdBQVcsR0FBRyxDQUFDLEdBQVcsRUFBMEIsRUFBRTs7SUFDakUsTUFBTSxNQUFNLEdBQUcsSUFBQSx5QkFBaUIsRUFBQyxHQUFHLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQzVELE1BQU0sV0FBVyxHQUFHLE1BQU0sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDdEMsTUFBTSxTQUFTLEdBQUcsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUU1QyxLQUFLLENBQUMsU0FBUyxFQUFFLE1BQU0sQ0FBQyxDQUFDO0lBRXpCLFFBQVE7SUFDUixXQUFXLENBQUMsS0FBSyxFQUFFLENBQUM7SUFFcEIsTUFBTSxXQUFXLEdBQUcsV0FBVyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUMxQyxNQUFNLE1BQU0sR0FBRyxXQUFXLENBQUMsQ0FBQyxDQUFDLGdCQUFnQixDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7SUFDaEUsTUFBTSxRQUFRLEdBQUcsSUFBQSx5QkFBaUIsRUFBQyxTQUFTLENBQUMsR0FBRyxFQUFZLENBQUMsQ0FBQztJQUM5RCxNQUFNLElBQUksR0FBRyxTQUFTLENBQUMsR0FBRyxFQUFZLENBQUM7SUFDdkMsTUFBTSxNQUFNLEdBQUcsU0FBUyxDQUFDLEdBQUcsRUFBWSxDQUFDO0lBQ3pDLE1BQU0sUUFBUSxHQUFHLFNBQVMsQ0FBQyxHQUFHLEVBQVksQ0FBQztJQUMzQyxNQUFNLElBQUksR0FBRyxTQUFTLENBQUMsR0FBRyxFQUFZLENBQUM7SUFDdkMsTUFBTSxRQUFRLEdBQUcsU0FBUyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUNyQyxNQUFNLFFBQVEsR0FBRyxNQUFNLENBQUMsT0FBTztRQUM3QixDQUFDLENBQUMsSUFBQSx5QkFBaUIsRUFBQyxNQUFNLENBQUMsT0FBTyxDQUFDO1FBQ25DLENBQUMsQ0FBQyxHQUFHLFFBQVEsSUFBSSxJQUFJLEVBQUUsQ0FBQztJQUUxQixPQUFPO1FBQ0wsSUFBSSxFQUFFLG9CQUFZLENBQUMsWUFBWTtRQUMvQixRQUFRO1FBQ1IsUUFBUTtRQUNSLElBQUk7UUFDSixRQUFRO1FBQ1IsTUFBTTtRQUNOLElBQUk7UUFDSixRQUFRO1FBQ1IsVUFBVSxFQUFFLElBQUEseUJBQWlCLEVBQUMsTUFBQSxNQUFNLENBQUMsVUFBVSxtQ0FBSSxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQztRQUN6RSxTQUFTLEVBQUUsSUFBQSx5QkFBaUIsRUFBQyxNQUFBLE1BQU0sQ0FBQyxTQUFTLG1DQUFJLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDO0tBQ3hFLENBQUM7QUFDSixDQUFDLENBQUM7QUFsQ1csUUFBQSxXQUFXLGVBa0N0QjtBQUVGLFNBQVMsZ0JBQWdCLENBQUMsR0FBVztJQUNuQyxNQUFNLE1BQU0sR0FBMkIsRUFBRSxDQUFDO0lBQzFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsMEJBQTBCLEVBQUUsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFO1FBQ3ZELE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDZCxPQUFPLE1BQU0sQ0FBQztJQUNoQixDQUFDLENBQUMsQ0FBQztJQUNILE9BQU8sTUFBTSxDQUFDO0FBQ2hCLENBQUMifQ==