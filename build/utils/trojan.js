"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseTrojanUri = void 0;
const debug_1 = __importDefault(require("debug"));
const url_1 = require("url");
const types_1 = require("../types");
const debug = (0, debug_1.default)('surgio:utils:trojan');
const parseTrojanUri = (str) => {
    debug('Trojan URI', str);
    const scheme = new url_1.URL(str);
    if (scheme.protocol !== 'trojan:') {
        throw new Error('Invalid Trojan URI.');
    }
    const allowInsecure = scheme.searchParams.get('allowInsecure') === '1' ||
        scheme.searchParams.get('allowInsecure') === 'true';
    const sni = scheme.searchParams.get('sni') || scheme.searchParams.get('peer');
    return Object.assign(Object.assign({ type: types_1.NodeTypeEnum.Trojan, hostname: scheme.hostname, port: scheme.port, password: scheme.username, nodeName: scheme.hash
            ? decodeURIComponent(scheme.hash.slice(1))
            : `${scheme.hostname}:${scheme.port}` }, (allowInsecure
        ? {
            skipCertVerify: true,
        }
        : null)), (sni
        ? {
            sni,
        }
        : null));
};
exports.parseTrojanUri = parseTrojanUri;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJvamFuLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vbGliL3V0aWxzL3Ryb2phbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxrREFBMEI7QUFDMUIsNkJBQTBCO0FBRTFCLG9DQUEwRDtBQUUxRCxNQUFNLEtBQUssR0FBRyxJQUFBLGVBQUssRUFBQyxxQkFBcUIsQ0FBQyxDQUFDO0FBRXBDLE1BQU0sY0FBYyxHQUFHLENBQUMsR0FBVyxFQUFvQixFQUFFO0lBQzlELEtBQUssQ0FBQyxZQUFZLEVBQUUsR0FBRyxDQUFDLENBQUM7SUFFekIsTUFBTSxNQUFNLEdBQUcsSUFBSSxTQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7SUFFNUIsSUFBSSxNQUFNLENBQUMsUUFBUSxLQUFLLFNBQVMsRUFBRTtRQUNqQyxNQUFNLElBQUksS0FBSyxDQUFDLHFCQUFxQixDQUFDLENBQUM7S0FDeEM7SUFFRCxNQUFNLGFBQWEsR0FDakIsTUFBTSxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsZUFBZSxDQUFDLEtBQUssR0FBRztRQUNoRCxNQUFNLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxlQUFlLENBQUMsS0FBSyxNQUFNLENBQUM7SUFDdEQsTUFBTSxHQUFHLEdBQUcsTUFBTSxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLElBQUksTUFBTSxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUM7SUFFOUUscUNBQ0UsSUFBSSxFQUFFLG9CQUFZLENBQUMsTUFBTSxFQUN6QixRQUFRLEVBQUUsTUFBTSxDQUFDLFFBQVEsRUFDekIsSUFBSSxFQUFFLE1BQU0sQ0FBQyxJQUFJLEVBQ2pCLFFBQVEsRUFBRSxNQUFNLENBQUMsUUFBUSxFQUN6QixRQUFRLEVBQUUsTUFBTSxDQUFDLElBQUk7WUFDbkIsQ0FBQyxDQUFDLGtCQUFrQixDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzFDLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxRQUFRLElBQUksTUFBTSxDQUFDLElBQUksRUFBRSxJQUNwQyxDQUFDLGFBQWE7UUFDZixDQUFDLENBQUM7WUFDRSxjQUFjLEVBQUUsSUFBSTtTQUNyQjtRQUNILENBQUMsQ0FBQyxJQUFJLENBQUMsR0FDTixDQUFDLEdBQUc7UUFDTCxDQUFDLENBQUM7WUFDRSxHQUFHO1NBQ0o7UUFDSCxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQ1Q7QUFDSixDQUFDLENBQUM7QUFqQ1csUUFBQSxjQUFjLGtCQWlDekIifQ==