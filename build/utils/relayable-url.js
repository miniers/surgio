"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constant_1 = require("../constant");
function relayableUrl(url, relayUrl) {
    if (typeof relayUrl === 'boolean') {
        return `${constant_1.RELAY_SERVICE}${url}`;
    }
    else if (typeof relayUrl === 'string') {
        if (relayUrl.includes('%%URL%%')) {
            return relayUrl.replace('%%URL%%', encodeURIComponent(url));
        }
        else if (relayUrl.includes('%URL%')) {
            return relayUrl.replace('%URL%', url);
        }
        else {
            throw new Error('relayUrl 中必须包含 %URL% 或 %%URL%% 替换指示符');
        }
    }
    return url;
}
exports.default = relayableUrl;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVsYXlhYmxlLXVybC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi91dGlscy9yZWxheWFibGUtdXJsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsMENBQTRDO0FBRTVDLFNBQXdCLFlBQVksQ0FDbEMsR0FBVyxFQUNYLFFBQTJCO0lBRTNCLElBQUksT0FBTyxRQUFRLEtBQUssU0FBUyxFQUFFO1FBQ2pDLE9BQU8sR0FBRyx3QkFBYSxHQUFHLEdBQUcsRUFBRSxDQUFDO0tBQ2pDO1NBQU0sSUFBSSxPQUFPLFFBQVEsS0FBSyxRQUFRLEVBQUU7UUFDdkMsSUFBSSxRQUFRLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxFQUFFO1lBQ2hDLE9BQU8sUUFBUSxDQUFDLE9BQU8sQ0FBQyxTQUFTLEVBQUUsa0JBQWtCLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztTQUM3RDthQUFNLElBQUksUUFBUSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsRUFBRTtZQUNyQyxPQUFPLFFBQVEsQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1NBQ3ZDO2FBQU07WUFDTCxNQUFNLElBQUksS0FBSyxDQUFDLHNDQUFzQyxDQUFDLENBQUM7U0FDekQ7S0FDRjtJQUNELE9BQU8sR0FBRyxDQUFDO0FBQ2IsQ0FBQztBQWhCRCwrQkFnQkMifQ==