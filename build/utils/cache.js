"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionCache = exports.ConfigCache = void 0;
const lru_cache_1 = __importDefault(require("lru-cache"));
const env_flag_1 = require("./env-flag");
exports.ConfigCache = new lru_cache_1.default({
    maxAge: (0, env_flag_1.getProviderCacheMaxage)(),
    max: 100,
});
exports.SubscriptionCache = new lru_cache_1.default({
    maxAge: (0, env_flag_1.getProviderCacheMaxage)(),
    max: 100,
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FjaGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9saWIvdXRpbHMvY2FjaGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsMERBQTRCO0FBRzVCLHlDQUFvRDtBQU92QyxRQUFBLFdBQVcsR0FBRyxJQUFJLG1CQUFHLENBQWlCO0lBQ2pELE1BQU0sRUFBRSxJQUFBLGlDQUFzQixHQUFFO0lBQ2hDLEdBQUcsRUFBRSxHQUFHO0NBQ1QsQ0FBQyxDQUFDO0FBRVUsUUFBQSxpQkFBaUIsR0FBRyxJQUFJLG1CQUFHLENBQStCO0lBQ3JFLE1BQU0sRUFBRSxJQUFBLGlDQUFzQixHQUFFO0lBQ2hDLEdBQUcsRUFBRSxHQUFHO0NBQ1QsQ0FBQyxDQUFDIn0=