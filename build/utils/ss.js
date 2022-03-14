"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseSSUri = void 0;
const debug_1 = __importDefault(require("debug"));
const url_1 = __importDefault(require("url"));
const types_1 = require("../types");
const index_1 = require("./index");
const debug = (0, debug_1.default)('surgio:utils:ss');
const parseSSUri = (str) => {
    debug('Shadowsocks URI', str);
    const scheme = url_1.default.parse(str, true);
    const userInfo = (0, index_1.fromUrlSafeBase64)(scheme.auth).split(':');
    const pluginInfo = typeof scheme.query.plugin === 'string'
        ? (0, index_1.decodeStringList)(scheme.query.plugin.split(';'))
        : {};
    return Object.assign(Object.assign(Object.assign({ type: types_1.NodeTypeEnum.Shadowsocks, nodeName: decodeURIComponent(scheme.hash.replace('#', '')), hostname: scheme.hostname, port: scheme.port, method: userInfo[0], password: userInfo[1] }, (pluginInfo['obfs-local']
        ? {
            obfs: pluginInfo.obfs,
            'obfs-host': pluginInfo['obfs-host'],
        }
        : null)), (pluginInfo['simple-obfs']
        ? {
            obfs: pluginInfo.obfs,
            'obfs-host': pluginInfo['obfs-host'],
        }
        : null)), (pluginInfo['v2ray-plugin']
        ? {
            obfs: pluginInfo.tls ? 'wss' : 'ws',
            'obfs-host': pluginInfo.host,
        }
        : null));
};
exports.parseSSUri = parseSSUri;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3MuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9saWIvdXRpbHMvc3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsa0RBQTBCO0FBQzFCLDhDQUEyQztBQUUzQyxvQ0FBK0Q7QUFDL0QsbUNBQThEO0FBRTlELE1BQU0sS0FBSyxHQUFHLElBQUEsZUFBSyxFQUFDLGlCQUFpQixDQUFDLENBQUM7QUFFaEMsTUFBTSxVQUFVLEdBQUcsQ0FBQyxHQUFXLEVBQXlCLEVBQUU7SUFDL0QsS0FBSyxDQUFDLGlCQUFpQixFQUFFLEdBQUcsQ0FBQyxDQUFDO0lBRTlCLE1BQU0sTUFBTSxHQUFHLGFBQVMsQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQzFDLE1BQU0sUUFBUSxHQUFHLElBQUEseUJBQWlCLEVBQUMsTUFBTSxDQUFDLElBQWMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUNyRSxNQUFNLFVBQVUsR0FDZCxPQUFPLE1BQU0sQ0FBQyxLQUFLLENBQUMsTUFBTSxLQUFLLFFBQVE7UUFDckMsQ0FBQyxDQUFDLElBQUEsd0JBQWdCLEVBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ2xELENBQUMsQ0FBQyxFQUFFLENBQUM7SUFFVCxtREFDRSxJQUFJLEVBQUUsb0JBQVksQ0FBQyxXQUFXLEVBQzlCLFFBQVEsRUFBRSxrQkFBa0IsQ0FBRSxNQUFNLENBQUMsSUFBZSxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFDdEUsUUFBUSxFQUFFLE1BQU0sQ0FBQyxRQUFrQixFQUNuQyxJQUFJLEVBQUUsTUFBTSxDQUFDLElBQWMsRUFDM0IsTUFBTSxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUMsRUFDbkIsUUFBUSxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUMsSUFDbEIsQ0FBQyxVQUFVLENBQUMsWUFBWSxDQUFDO1FBQzFCLENBQUMsQ0FBQztZQUNFLElBQUksRUFBRSxVQUFVLENBQUMsSUFBc0I7WUFDdkMsV0FBVyxFQUFFLFVBQVUsQ0FBQyxXQUFXLENBQVc7U0FDL0M7UUFDSCxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQ04sQ0FBQyxVQUFVLENBQUMsYUFBYSxDQUFDO1FBQzNCLENBQUMsQ0FBQztZQUNFLElBQUksRUFBRSxVQUFVLENBQUMsSUFBc0I7WUFDdkMsV0FBVyxFQUFFLFVBQVUsQ0FBQyxXQUFXLENBQVc7U0FDL0M7UUFDSCxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQ04sQ0FBQyxVQUFVLENBQUMsY0FBYyxDQUFDO1FBQzVCLENBQUMsQ0FBQztZQUNFLElBQUksRUFBRSxVQUFVLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLElBQUk7WUFDbkMsV0FBVyxFQUFFLFVBQVUsQ0FBQyxJQUFjO1NBQ3ZDO1FBQ0gsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUNUO0FBQ0osQ0FBQyxDQUFDO0FBcENXLFFBQUEsVUFBVSxjQW9DckIifQ==