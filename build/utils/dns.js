"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolve4And6 = exports.resolveDomain = void 0;
const dns_1 = require("dns");
const lru_cache_1 = __importDefault(require("lru-cache"));
const logger_1 = require("@surgio/logger");
const bluebird_1 = __importDefault(require("bluebird"));
const env_flag_1 = require("./env-flag");
const DomainCache = new lru_cache_1.default({
    max: 5000,
});
const logger = (0, logger_1.createLogger)({ service: 'surgio:utils:dns' });
const resolveDomain = async (domain, timeout = (0, env_flag_1.getNetworkResolveTimeout)()) => {
    if (DomainCache.has(domain)) {
        return DomainCache.get(domain);
    }
    logger.debug(`try to resolve domain ${domain}`);
    const now = Date.now();
    const records = await bluebird_1.default.race([
        (0, exports.resolve4And6)(domain),
        bluebird_1.default.delay(timeout).then(() => []),
    ]);
    logger.debug(`resolved domain ${domain}: ${JSON.stringify(records)} ${Date.now() - now}ms`);
    if (records.length) {
        const address = records.map((item) => item.address);
        DomainCache.set(domain, address, records[0].ttl * 1000);
        return address;
    }
    // istanbul ignore next
    return [];
};
exports.resolveDomain = resolveDomain;
const resolve4And6 = async (domain) => {
    // istanbul ignore next
    function onErr() {
        return [];
    }
    const [ipv4, ipv6] = await Promise.all([
        dns_1.promises.resolve4(domain, { ttl: true }).catch(onErr),
        dns_1.promises.resolve6(domain, { ttl: true }).catch(onErr),
    ]);
    return [...ipv4, ...ipv6];
};
exports.resolve4And6 = resolve4And6;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZG5zLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vbGliL3V0aWxzL2Rucy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSw2QkFBcUQ7QUFDckQsMERBQTRCO0FBQzVCLDJDQUE4QztBQUM5Qyx3REFBZ0M7QUFFaEMseUNBQXNEO0FBRXRELE1BQU0sV0FBVyxHQUFHLElBQUksbUJBQUcsQ0FBZ0M7SUFDekQsR0FBRyxFQUFFLElBQUk7Q0FDVixDQUFDLENBQUM7QUFDSCxNQUFNLE1BQU0sR0FBRyxJQUFBLHFCQUFZLEVBQUMsRUFBRSxPQUFPLEVBQUUsa0JBQWtCLEVBQUUsQ0FBQyxDQUFDO0FBRXRELE1BQU0sYUFBYSxHQUFHLEtBQUssRUFDaEMsTUFBYyxFQUNkLFVBQWtCLElBQUEsbUNBQXdCLEdBQUUsRUFDWixFQUFFO0lBQ2xDLElBQUksV0FBVyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsRUFBRTtRQUMzQixPQUFPLFdBQVcsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUEwQixDQUFDO0tBQ3pEO0lBRUQsTUFBTSxDQUFDLEtBQUssQ0FBQyx5QkFBeUIsTUFBTSxFQUFFLENBQUMsQ0FBQztJQUNoRCxNQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUM7SUFDdkIsTUFBTSxPQUFPLEdBQUcsTUFBTSxrQkFBUSxDQUFDLElBQUksQ0FBK0I7UUFDaEUsSUFBQSxvQkFBWSxFQUFDLE1BQU0sQ0FBQztRQUNwQixrQkFBUSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDO0tBQ3ZDLENBQUMsQ0FBQztJQUNILE1BQU0sQ0FBQyxLQUFLLENBQ1YsbUJBQW1CLE1BQU0sS0FBSyxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxJQUNuRCxJQUFJLENBQUMsR0FBRyxFQUFFLEdBQUcsR0FDZixJQUFJLENBQ0wsQ0FBQztJQUVGLElBQUksT0FBTyxDQUFDLE1BQU0sRUFBRTtRQUNsQixNQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDcEQsV0FBVyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLENBQUM7UUFDeEQsT0FBTyxPQUFPLENBQUM7S0FDaEI7SUFFRCx1QkFBdUI7SUFDdkIsT0FBTyxFQUFFLENBQUM7QUFDWixDQUFDLENBQUM7QUE1QlcsUUFBQSxhQUFhLGlCQTRCeEI7QUFFSyxNQUFNLFlBQVksR0FBRyxLQUFLLEVBQy9CLE1BQWMsRUFDeUIsRUFBRTtJQUN6Qyx1QkFBdUI7SUFDdkIsU0FBUyxLQUFLO1FBQ1osT0FBTyxFQUFFLENBQUM7SUFDWixDQUFDO0lBRUQsTUFBTSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsR0FBRyxNQUFNLE9BQU8sQ0FBQyxHQUFHLENBQUM7UUFDckMsY0FBRyxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDO1FBQ2hELGNBQUcsQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQztLQUNqRCxDQUFDLENBQUM7SUFFSCxPQUFPLENBQUMsR0FBRyxJQUFJLEVBQUUsR0FBRyxJQUFJLENBQUMsQ0FBQztBQUM1QixDQUFDLENBQUM7QUFkVyxRQUFBLFlBQVksZ0JBY3ZCIn0=