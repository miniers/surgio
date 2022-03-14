"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserAgent = void 0;
const got_1 = __importDefault(require("got"));
const agentkeepalive_1 = __importStar(require("agentkeepalive"));
const constant_1 = require("../constant");
const env_flag_1 = require("./env-flag");
const pkg = require('../../package.json');
const getUserAgent = (str) => `${str ? str + ' ' : ''}${constant_1.NETWORK_SURGIO_UA}/${pkg.version}`;
exports.getUserAgent = getUserAgent;
const httpClient = got_1.default.extend({
    timeout: (0, env_flag_1.getNetworkTimeout)(),
    retry: (0, env_flag_1.getNetworkRetry)(),
    headers: {
        'user-agent': (0, exports.getUserAgent)(),
    },
    agent: {
        http: new agentkeepalive_1.default(),
        https: new agentkeepalive_1.HttpsAgent(),
    },
});
exports.default = httpClient;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaHR0cC1jbGllbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9saWIvdXRpbHMvaHR0cC1jbGllbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLDhDQUFzQjtBQUN0QixpRUFBdUQ7QUFFdkQsMENBQWdEO0FBQ2hELHlDQUFnRTtBQUVoRSxNQUFNLEdBQUcsR0FBRyxPQUFPLENBQUMsb0JBQW9CLENBQUMsQ0FBQztBQUVuQyxNQUFNLFlBQVksR0FBRyxDQUFDLEdBQVksRUFBVSxFQUFFLENBQ25ELEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLEdBQUcsNEJBQWlCLElBQUksR0FBRyxDQUFDLE9BQU8sRUFBRSxDQUFDO0FBRGxELFFBQUEsWUFBWSxnQkFDc0M7QUFFL0QsTUFBTSxVQUFVLEdBQUcsYUFBRyxDQUFDLE1BQU0sQ0FBQztJQUM1QixPQUFPLEVBQUUsSUFBQSw0QkFBaUIsR0FBRTtJQUM1QixLQUFLLEVBQUUsSUFBQSwwQkFBZSxHQUFFO0lBQ3hCLE9BQU8sRUFBRTtRQUNQLFlBQVksRUFBRSxJQUFBLG9CQUFZLEdBQUU7S0FDN0I7SUFDRCxLQUFLLEVBQUU7UUFDTCxJQUFJLEVBQUUsSUFBSSx3QkFBUyxFQUFFO1FBQ3JCLEtBQUssRUFBRSxJQUFJLDJCQUFVLEVBQUU7S0FDeEI7Q0FDRixDQUFDLENBQUM7QUFFSCxrQkFBZSxVQUFVLENBQUMifQ==