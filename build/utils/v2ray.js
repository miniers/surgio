"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatVmessUri = void 0;
const query_string_1 = __importDefault(require("query-string"));
// https://github.com/v2ray/v2ray-core/issues/1569
const formatVmessUri = (nodeConfig, options) => {
    const uri = [
        nodeConfig.uuid,
        '@',
        `${nodeConfig.hostname}:${nodeConfig.port}`,
        nodeConfig.path || '/',
    ];
    const queries = {
        network: nodeConfig.network,
        tls: nodeConfig.tls,
    };
    if (nodeConfig.skipCertVerify) {
        queries['tls.allowInsecure'] = true;
    }
    if (nodeConfig.network === 'ws') {
        if (typeof nodeConfig.wsHeaders !== 'undefined') {
            Object.keys(nodeConfig.wsHeaders).forEach((key) => {
                if (!/host/i.test(key)) {
                    queries[`ws.headers.${key}`] = nodeConfig.wsHeaders[key];
                }
            });
        }
        if (nodeConfig.host) {
            if (options === null || options === void 0 ? void 0 : options.isMellow) {
                queries[`ws.host`] = nodeConfig.host;
            }
            else {
                queries[`ws.headers.host`] = nodeConfig.host;
            }
        }
    }
    return `vmess://${uri.join('')}?${query_string_1.default.stringify(queries)}`;
};
exports.formatVmessUri = formatVmessUri;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidjJyYXkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9saWIvdXRpbHMvdjJyYXkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQ0EsZ0VBQXVDO0FBRXZDLGtEQUFrRDtBQUMzQyxNQUFNLGNBQWMsR0FBRyxDQUM1QixVQUEyQixFQUMzQixPQUF3QyxFQUNoQyxFQUFFO0lBQ1YsTUFBTSxHQUFHLEdBQWE7UUFDcEIsVUFBVSxDQUFDLElBQUk7UUFDZixHQUFHO1FBQ0gsR0FBRyxVQUFVLENBQUMsUUFBUSxJQUFJLFVBQVUsQ0FBQyxJQUFJLEVBQUU7UUFDM0MsVUFBVSxDQUFDLElBQUksSUFBSSxHQUFHO0tBQ3ZCLENBQUM7SUFDRixNQUFNLE9BQU8sR0FBUTtRQUNuQixPQUFPLEVBQUUsVUFBVSxDQUFDLE9BQU87UUFDM0IsR0FBRyxFQUFFLFVBQVUsQ0FBQyxHQUFHO0tBQ3BCLENBQUM7SUFFRixJQUFJLFVBQVUsQ0FBQyxjQUFjLEVBQUU7UUFDN0IsT0FBTyxDQUFDLG1CQUFtQixDQUFDLEdBQUcsSUFBSSxDQUFDO0tBQ3JDO0lBRUQsSUFBSSxVQUFVLENBQUMsT0FBTyxLQUFLLElBQUksRUFBRTtRQUMvQixJQUFJLE9BQU8sVUFBVSxDQUFDLFNBQVMsS0FBSyxXQUFXLEVBQUU7WUFDL0MsTUFBTSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBRyxFQUFFLEVBQUU7Z0JBQ2hELElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFO29CQUN0QixPQUFPLENBQUMsY0FBYyxHQUFHLEVBQUUsQ0FBQyxHQUFHLFVBQVUsQ0FBQyxTQUFVLENBQUMsR0FBRyxDQUFDLENBQUM7aUJBQzNEO1lBQ0gsQ0FBQyxDQUFDLENBQUM7U0FDSjtRQUNELElBQUksVUFBVSxDQUFDLElBQUksRUFBRTtZQUNuQixJQUFJLE9BQU8sYUFBUCxPQUFPLHVCQUFQLE9BQU8sQ0FBRSxRQUFRLEVBQUU7Z0JBQ3JCLE9BQU8sQ0FBQyxTQUFTLENBQUMsR0FBRyxVQUFVLENBQUMsSUFBSSxDQUFDO2FBQ3RDO2lCQUFNO2dCQUNMLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHLFVBQVUsQ0FBQyxJQUFJLENBQUM7YUFDOUM7U0FDRjtLQUNGO0lBRUQsT0FBTyxXQUFXLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksc0JBQVcsQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQztBQUNyRSxDQUFDLENBQUM7QUFyQ1csUUFBQSxjQUFjLGtCQXFDekIifQ==