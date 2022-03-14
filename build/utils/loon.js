"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLoonNodes = void 0;
const logger_1 = require("@surgio/logger");
const types_1 = require("../types");
const constant_1 = require("../constant");
const index_1 = require("./index");
const logger = (0, logger_1.createLogger)({ service: 'surgio:utils' });
// @see https://www.notion.so/1-9809ce5acf524d868affee8dd5fc0a6e
const getLoonNodes = function (list, filter) {
    if (arguments.length === 2 && typeof filter === 'undefined') {
        throw new Error(constant_1.ERR_INVALID_FILTER);
    }
    const result = (0, index_1.applyFilter)(list, filter)
        .map((nodeConfig) => {
        switch (nodeConfig.type) {
            case types_1.NodeTypeEnum.Shadowsocks: {
                const config = [
                    `${nodeConfig.nodeName} = Shadowsocks`,
                    nodeConfig.hostname,
                    nodeConfig.port,
                    nodeConfig.method,
                    JSON.stringify(nodeConfig.password),
                ];
                if (nodeConfig.obfs) {
                    if (['http', 'tls'].includes(nodeConfig.obfs)) {
                        config.push(nodeConfig.obfs, nodeConfig['obfs-host'] || nodeConfig.hostname);
                    }
                    else {
                        logger.warn(`不支持为 Loon 生成混淆为 ${nodeConfig.obfs} 的节点，节点 ${nodeConfig.nodeName} 会被省略`);
                        return void 0;
                    }
                }
                return config.join(',');
            }
            case types_1.NodeTypeEnum.Shadowsocksr: {
                const config = [
                    `${nodeConfig.nodeName} = ShadowsocksR`,
                    nodeConfig.hostname,
                    nodeConfig.port,
                    nodeConfig.method,
                    JSON.stringify(nodeConfig.password),
                    nodeConfig.protocol,
                    `{${nodeConfig.protoparam}}`,
                    nodeConfig.obfs,
                    `{${nodeConfig.obfsparam}}`,
                ];
                return config.join(',');
            }
            case types_1.NodeTypeEnum.Vmess: {
                const config = [
                    `${nodeConfig.nodeName} = vmess`,
                    nodeConfig.hostname,
                    nodeConfig.port,
                    nodeConfig.method === 'auto'
                        ? `method=chacha20-ietf-poly1305`
                        : `method=${nodeConfig.method}`,
                    JSON.stringify(nodeConfig.uuid),
                    `transport:${nodeConfig.network}`,
                ];
                if (nodeConfig.network === 'ws') {
                    config.push(`path:${nodeConfig.path || '/'}`, `host:${nodeConfig.host || nodeConfig.hostname}`);
                }
                if (nodeConfig.tls) {
                    config.push(`over-tls:${nodeConfig.tls}`, `tls-name:${nodeConfig.host || nodeConfig.hostname}`, `skip-cert-verify:${nodeConfig.skipCertVerify === true}`);
                }
                return config.join(',');
            }
            case types_1.NodeTypeEnum.Trojan: {
                const config = [
                    `${nodeConfig.nodeName} = trojan`,
                    nodeConfig.hostname,
                    nodeConfig.port,
                    JSON.stringify(nodeConfig.password),
                    `tls-name:${nodeConfig.sni || nodeConfig.hostname}`,
                    `skip-cert-verify:${nodeConfig.skipCertVerify === true}`,
                ];
                return config.join(',');
            }
            case types_1.NodeTypeEnum.HTTPS:
                return [
                    `${nodeConfig.nodeName} = https`,
                    nodeConfig.hostname,
                    nodeConfig.port,
                    nodeConfig.username /* istanbul ignore next */ || '',
                    JSON.stringify(nodeConfig.password) /* istanbul ignore next */ ||
                        '""',
                ].join(',');
            case types_1.NodeTypeEnum.HTTP:
                return [
                    `${nodeConfig.nodeName} = http`,
                    nodeConfig.hostname,
                    nodeConfig.port,
                    nodeConfig.username /* istanbul ignore next */ || '',
                    JSON.stringify(nodeConfig.password) /* istanbul ignore next */ ||
                        '""',
                ].join(',');
            // istanbul ignore next
            default:
                logger.warn(`不支持为 Loon 生成 ${nodeConfig.type} 的节点，节点 ${nodeConfig.nodeName} 会被省略`);
                return void 0;
        }
    })
        .filter((item) => item !== undefined);
    return result.join('\n');
};
exports.getLoonNodes = getLoonNodes;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9vbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi91dGlscy9sb29uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLDJDQUE4QztBQUU5QyxvQ0FLa0I7QUFDbEIsMENBQWlEO0FBQ2pELG1DQUFzQztBQUV0QyxNQUFNLE1BQU0sR0FBRyxJQUFBLHFCQUFZLEVBQUMsRUFBRSxPQUFPLEVBQUUsY0FBYyxFQUFFLENBQUMsQ0FBQztBQUV6RCxnRUFBZ0U7QUFDekQsTUFBTSxZQUFZLEdBQUcsVUFDMUIsSUFBMkMsRUFDM0MsTUFBc0Q7SUFFdEQsSUFBSSxTQUFTLENBQUMsTUFBTSxLQUFLLENBQUMsSUFBSSxPQUFPLE1BQU0sS0FBSyxXQUFXLEVBQUU7UUFDM0QsTUFBTSxJQUFJLEtBQUssQ0FBQyw2QkFBa0IsQ0FBQyxDQUFDO0tBQ3JDO0lBRUQsTUFBTSxNQUFNLEdBQTBCLElBQUEsbUJBQVcsRUFBQyxJQUFJLEVBQUUsTUFBTSxDQUFDO1NBQzVELEdBQUcsQ0FBQyxDQUFDLFVBQVUsRUFBc0IsRUFBRTtRQUN0QyxRQUFRLFVBQVUsQ0FBQyxJQUFJLEVBQUU7WUFDdkIsS0FBSyxvQkFBWSxDQUFDLFdBQVcsQ0FBQyxDQUFDO2dCQUM3QixNQUFNLE1BQU0sR0FBMkI7b0JBQ3JDLEdBQUcsVUFBVSxDQUFDLFFBQVEsZ0JBQWdCO29CQUN0QyxVQUFVLENBQUMsUUFBUTtvQkFDbkIsVUFBVSxDQUFDLElBQUk7b0JBQ2YsVUFBVSxDQUFDLE1BQU07b0JBQ2pCLElBQUksQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQztpQkFDcEMsQ0FBQztnQkFFRixJQUFJLFVBQVUsQ0FBQyxJQUFJLEVBQUU7b0JBQ25CLElBQUksQ0FBQyxNQUFNLEVBQUUsS0FBSyxDQUFDLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsRUFBRTt3QkFDN0MsTUFBTSxDQUFDLElBQUksQ0FDVCxVQUFVLENBQUMsSUFBSSxFQUNmLFVBQVUsQ0FBQyxXQUFXLENBQUMsSUFBSSxVQUFVLENBQUMsUUFBUSxDQUMvQyxDQUFDO3FCQUNIO3lCQUFNO3dCQUNMLE1BQU0sQ0FBQyxJQUFJLENBQ1QsbUJBQW1CLFVBQVUsQ0FBQyxJQUFJLFdBQVcsVUFBVSxDQUFDLFFBQVEsT0FBTyxDQUN4RSxDQUFDO3dCQUNGLE9BQU8sS0FBSyxDQUFDLENBQUM7cUJBQ2Y7aUJBQ0Y7Z0JBRUQsT0FBTyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO2FBQ3pCO1lBRUQsS0FBSyxvQkFBWSxDQUFDLFlBQVksQ0FBQyxDQUFDO2dCQUM5QixNQUFNLE1BQU0sR0FBMkI7b0JBQ3JDLEdBQUcsVUFBVSxDQUFDLFFBQVEsaUJBQWlCO29CQUN2QyxVQUFVLENBQUMsUUFBUTtvQkFDbkIsVUFBVSxDQUFDLElBQUk7b0JBQ2YsVUFBVSxDQUFDLE1BQU07b0JBQ2pCLElBQUksQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQztvQkFDbkMsVUFBVSxDQUFDLFFBQVE7b0JBQ25CLElBQUksVUFBVSxDQUFDLFVBQVUsR0FBRztvQkFDNUIsVUFBVSxDQUFDLElBQUk7b0JBQ2YsSUFBSSxVQUFVLENBQUMsU0FBUyxHQUFHO2lCQUM1QixDQUFDO2dCQUVGLE9BQU8sTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQzthQUN6QjtZQUVELEtBQUssb0JBQVksQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFDdkIsTUFBTSxNQUFNLEdBQTJCO29CQUNyQyxHQUFHLFVBQVUsQ0FBQyxRQUFRLFVBQVU7b0JBQ2hDLFVBQVUsQ0FBQyxRQUFRO29CQUNuQixVQUFVLENBQUMsSUFBSTtvQkFDZixVQUFVLENBQUMsTUFBTSxLQUFLLE1BQU07d0JBQzFCLENBQUMsQ0FBQywrQkFBK0I7d0JBQ2pDLENBQUMsQ0FBQyxVQUFVLFVBQVUsQ0FBQyxNQUFNLEVBQUU7b0JBQ2pDLElBQUksQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQztvQkFDL0IsYUFBYSxVQUFVLENBQUMsT0FBTyxFQUFFO2lCQUNsQyxDQUFDO2dCQUVGLElBQUksVUFBVSxDQUFDLE9BQU8sS0FBSyxJQUFJLEVBQUU7b0JBQy9CLE1BQU0sQ0FBQyxJQUFJLENBQ1QsUUFBUSxVQUFVLENBQUMsSUFBSSxJQUFJLEdBQUcsRUFBRSxFQUNoQyxRQUFRLFVBQVUsQ0FBQyxJQUFJLElBQUksVUFBVSxDQUFDLFFBQVEsRUFBRSxDQUNqRCxDQUFDO2lCQUNIO2dCQUVELElBQUksVUFBVSxDQUFDLEdBQUcsRUFBRTtvQkFDbEIsTUFBTSxDQUFDLElBQUksQ0FDVCxZQUFZLFVBQVUsQ0FBQyxHQUFHLEVBQUUsRUFDNUIsWUFBWSxVQUFVLENBQUMsSUFBSSxJQUFJLFVBQVUsQ0FBQyxRQUFRLEVBQUUsRUFDcEQsb0JBQW9CLFVBQVUsQ0FBQyxjQUFjLEtBQUssSUFBSSxFQUFFLENBQ3pELENBQUM7aUJBQ0g7Z0JBRUQsT0FBTyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO2FBQ3pCO1lBRUQsS0FBSyxvQkFBWSxDQUFDLE1BQU0sQ0FBQyxDQUFDO2dCQUN4QixNQUFNLE1BQU0sR0FBMkI7b0JBQ3JDLEdBQUcsVUFBVSxDQUFDLFFBQVEsV0FBVztvQkFDakMsVUFBVSxDQUFDLFFBQVE7b0JBQ25CLFVBQVUsQ0FBQyxJQUFJO29CQUNmLElBQUksQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQztvQkFDbkMsWUFBWSxVQUFVLENBQUMsR0FBRyxJQUFJLFVBQVUsQ0FBQyxRQUFRLEVBQUU7b0JBQ25ELG9CQUFvQixVQUFVLENBQUMsY0FBYyxLQUFLLElBQUksRUFBRTtpQkFDekQsQ0FBQztnQkFFRixPQUFPLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7YUFDekI7WUFFRCxLQUFLLG9CQUFZLENBQUMsS0FBSztnQkFDckIsT0FBTztvQkFDTCxHQUFHLFVBQVUsQ0FBQyxRQUFRLFVBQVU7b0JBQ2hDLFVBQVUsQ0FBQyxRQUFRO29CQUNuQixVQUFVLENBQUMsSUFBSTtvQkFDZixVQUFVLENBQUMsUUFBUSxDQUFDLDBCQUEwQixJQUFJLEVBQUU7b0JBQ3BELElBQUksQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxDQUFDLDBCQUEwQjt3QkFDNUQsSUFBSTtpQkFDUCxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUVkLEtBQUssb0JBQVksQ0FBQyxJQUFJO2dCQUNwQixPQUFPO29CQUNMLEdBQUcsVUFBVSxDQUFDLFFBQVEsU0FBUztvQkFDL0IsVUFBVSxDQUFDLFFBQVE7b0JBQ25CLFVBQVUsQ0FBQyxJQUFJO29CQUNmLFVBQVUsQ0FBQyxRQUFRLENBQUMsMEJBQTBCLElBQUksRUFBRTtvQkFDcEQsSUFBSSxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLENBQUMsMEJBQTBCO3dCQUM1RCxJQUFJO2lCQUNQLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBRWQsdUJBQXVCO1lBQ3ZCO2dCQUNFLE1BQU0sQ0FBQyxJQUFJLENBQ1QsZ0JBQWdCLFVBQVUsQ0FBQyxJQUFJLFdBQVcsVUFBVSxDQUFDLFFBQVEsT0FBTyxDQUNyRSxDQUFDO2dCQUNGLE9BQU8sS0FBSyxDQUFDLENBQUM7U0FDakI7SUFDSCxDQUFDLENBQUM7U0FDRCxNQUFNLENBQUMsQ0FBQyxJQUFJLEVBQWtCLEVBQUUsQ0FBQyxJQUFJLEtBQUssU0FBUyxDQUFDLENBQUM7SUFFeEQsT0FBTyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQzNCLENBQUMsQ0FBQztBQS9IVyxRQUFBLFlBQVksZ0JBK0h2QiJ9