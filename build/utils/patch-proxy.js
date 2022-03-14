"use strict";
// istanbul ignore file
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = require("@surgio/logger");
const _1 = require("./");
const logger = (0, logger_1.createLogger)({ service: 'surgio:utils:patch-proxy' });
const keys = ['http_proxy', 'https_proxy', 'all_proxy'];
if (!(0, _1.isHeroku)() && !(0, _1.isNow)() && !(0, _1.isGitHubActions)() && !(0, _1.isGitLabCI)()) {
    process.env.GLOBAL_AGENT_ENVIRONMENT_VARIABLE_NAMESPACE = '';
    keys.forEach((key) => {
        if (key in process.env) {
            const newKey = key.toUpperCase();
            const value = process.env[key];
            logger.debug('patched environment variable %s=%s', newKey, value);
            process.env[newKey] = value;
        }
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGF0Y2gtcHJveHkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9saWIvdXRpbHMvcGF0Y2gtcHJveHkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLHVCQUF1Qjs7QUFFdkIsMkNBQThDO0FBQzlDLHlCQUFrRTtBQUVsRSxNQUFNLE1BQU0sR0FBRyxJQUFBLHFCQUFZLEVBQUMsRUFBRSxPQUFPLEVBQUUsMEJBQTBCLEVBQUUsQ0FBQyxDQUFDO0FBQ3JFLE1BQU0sSUFBSSxHQUEwQixDQUFDLFlBQVksRUFBRSxhQUFhLEVBQUUsV0FBVyxDQUFDLENBQUM7QUFFL0UsSUFBSSxDQUFDLElBQUEsV0FBUSxHQUFFLElBQUksQ0FBQyxJQUFBLFFBQUssR0FBRSxJQUFJLENBQUMsSUFBQSxrQkFBZSxHQUFFLElBQUksQ0FBQyxJQUFBLGFBQVUsR0FBRSxFQUFFO0lBQ2xFLE9BQU8sQ0FBQyxHQUFHLENBQUMsMkNBQTJDLEdBQUcsRUFBRSxDQUFDO0lBRTdELElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxHQUFHLEVBQUUsRUFBRTtRQUNuQixJQUFJLEdBQUcsSUFBSSxPQUFPLENBQUMsR0FBRyxFQUFFO1lBQ3RCLE1BQU0sTUFBTSxHQUFHLEdBQUcsQ0FBQyxXQUFXLEVBQUUsQ0FBQztZQUNqQyxNQUFNLEtBQUssR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBRS9CLE1BQU0sQ0FBQyxLQUFLLENBQUMsb0NBQW9DLEVBQUUsTUFBTSxFQUFFLEtBQUssQ0FBQyxDQUFDO1lBQ2xFLE9BQU8sQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsS0FBSyxDQUFDO1NBQzdCO0lBQ0gsQ0FBQyxDQUFDLENBQUM7Q0FDSiJ9