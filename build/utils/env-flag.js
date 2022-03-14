"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProviderCacheMaxage = exports.getRemoteSnippetCacheMaxage = exports.getNetworkClashUA = exports.getNetworkRetry = exports.getNetworkConcurrency = exports.getNetworkResolveTimeout = exports.getNetworkTimeout = void 0;
const ms_1 = __importDefault(require("ms"));
const constant_1 = require("../constant");
const getNetworkTimeout = () => process.env[constant_1.ENV_NETWORK_TIMEOUT_KEY]
    ? Number(process.env[constant_1.ENV_NETWORK_TIMEOUT_KEY])
    : (0, ms_1.default)('5s');
exports.getNetworkTimeout = getNetworkTimeout;
const getNetworkResolveTimeout = () => process.env[constant_1.ENV_NETWORK_RESOLVE_TIMEOUT]
    ? Number(process.env[constant_1.ENV_NETWORK_RESOLVE_TIMEOUT])
    : (0, ms_1.default)('10s');
exports.getNetworkResolveTimeout = getNetworkResolveTimeout;
const getNetworkConcurrency = () => process.env[constant_1.ENV_SURGIO_NETWORK_CONCURRENCY]
    ? Number(process.env[constant_1.ENV_SURGIO_NETWORK_CONCURRENCY])
    : 5;
exports.getNetworkConcurrency = getNetworkConcurrency;
const getNetworkRetry = () => process.env[constant_1.ENV_SURGIO_NETWORK_RETRY]
    ? Number(process.env[constant_1.ENV_SURGIO_NETWORK_RETRY])
    : 3;
exports.getNetworkRetry = getNetworkRetry;
const getNetworkClashUA = () => { var _a; return (_a = process.env[constant_1.ENV_SURGIO_NETWORK_CLASH_UA]) !== null && _a !== void 0 ? _a : 'clash'; };
exports.getNetworkClashUA = getNetworkClashUA;
const getRemoteSnippetCacheMaxage = () => process.env[constant_1.ENV_SURGIO_REMOTE_SNIPPET_CACHE_MAXAGE]
    ? Number(process.env[constant_1.ENV_SURGIO_REMOTE_SNIPPET_CACHE_MAXAGE])
    : (0, ms_1.default)('12h');
exports.getRemoteSnippetCacheMaxage = getRemoteSnippetCacheMaxage;
const getProviderCacheMaxage = () => process.env[constant_1.ENV_SURGIO_PROVIDER_CACHE_MAXAGE]
    ? Number(process.env[constant_1.ENV_SURGIO_PROVIDER_CACHE_MAXAGE])
    : (0, ms_1.default)('10m');
exports.getProviderCacheMaxage = getProviderCacheMaxage;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW52LWZsYWcuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9saWIvdXRpbHMvZW52LWZsYWcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsNENBQW9CO0FBRXBCLDBDQVFxQjtBQUVkLE1BQU0saUJBQWlCLEdBQUcsR0FBVyxFQUFFLENBQzVDLE9BQU8sQ0FBQyxHQUFHLENBQUMsa0NBQXVCLENBQUM7SUFDbEMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLGtDQUF1QixDQUFDLENBQUM7SUFDOUMsQ0FBQyxDQUFDLElBQUEsWUFBRSxFQUFDLElBQUksQ0FBQyxDQUFDO0FBSEYsUUFBQSxpQkFBaUIscUJBR2Y7QUFFUixNQUFNLHdCQUF3QixHQUFHLEdBQVcsRUFBRSxDQUNuRCxPQUFPLENBQUMsR0FBRyxDQUFDLHNDQUEyQixDQUFDO0lBQ3RDLENBQUMsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxzQ0FBMkIsQ0FBQyxDQUFDO0lBQ2xELENBQUMsQ0FBQyxJQUFBLFlBQUUsRUFBQyxLQUFLLENBQUMsQ0FBQztBQUhILFFBQUEsd0JBQXdCLDRCQUdyQjtBQUVULE1BQU0scUJBQXFCLEdBQUcsR0FBVyxFQUFFLENBQ2hELE9BQU8sQ0FBQyxHQUFHLENBQUMseUNBQThCLENBQUM7SUFDekMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLHlDQUE4QixDQUFDLENBQUM7SUFDckQsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUhLLFFBQUEscUJBQXFCLHlCQUcxQjtBQUVELE1BQU0sZUFBZSxHQUFHLEdBQVcsRUFBRSxDQUMxQyxPQUFPLENBQUMsR0FBRyxDQUFDLG1DQUF3QixDQUFDO0lBQ25DLENBQUMsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxtQ0FBd0IsQ0FBQyxDQUFDO0lBQy9DLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFISyxRQUFBLGVBQWUsbUJBR3BCO0FBRUQsTUFBTSxpQkFBaUIsR0FBRyxHQUFXLEVBQUUsV0FDNUMsT0FBQSxNQUFBLE9BQU8sQ0FBQyxHQUFHLENBQUMsc0NBQTJCLENBQUMsbUNBQUksT0FBTyxDQUFBLEVBQUEsQ0FBQztBQUR6QyxRQUFBLGlCQUFpQixxQkFDd0I7QUFFL0MsTUFBTSwyQkFBMkIsR0FBRyxHQUFXLEVBQUUsQ0FDdEQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxpREFBc0MsQ0FBQztJQUNqRCxDQUFDLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsaURBQXNDLENBQUMsQ0FBQztJQUM3RCxDQUFDLENBQUMsSUFBQSxZQUFFLEVBQUMsS0FBSyxDQUFDLENBQUM7QUFISCxRQUFBLDJCQUEyQiwrQkFHeEI7QUFFVCxNQUFNLHNCQUFzQixHQUFHLEdBQVcsRUFBRSxDQUNqRCxPQUFPLENBQUMsR0FBRyxDQUFDLDJDQUFnQyxDQUFDO0lBQzNDLENBQUMsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQywyQ0FBZ0MsQ0FBQyxDQUFDO0lBQ3ZELENBQUMsQ0FBQyxJQUFBLFlBQUUsRUFBQyxLQUFLLENBQUMsQ0FBQztBQUhILFFBQUEsc0JBQXNCLDBCQUduQiJ9