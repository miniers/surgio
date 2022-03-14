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
exports.socks5Filter = exports.trojanFilter = exports.httpsFilter = exports.httpFilter = exports.snellFilter = exports.wireguardFilter = exports.v2rayFilter = exports.vmessFilter = exports.shadowsocksrFilter = exports.shadowsocksFilter = exports.youtubePremiumFilter = exports.chinaOutFilter = exports.chinaBackFilter = exports.taiwanFilter = exports.singaporeFilter = exports.koreaFilter = exports.japanFilter = exports.hkFilter = exports.usFilter = exports.netflixFilter = exports.mergeSortedFilters = exports.useSortedKeywords = exports.discardProviders = exports.useProviders = exports.useRegexp = exports.discardKeywords = exports.useKeywords = exports.mergeFilters = exports.validateFilter = exports.SortFilterWithSortedKeywords = exports.SortFilterWithSortedFilters = void 0;
const lodash_1 = __importDefault(require("lodash"));
const flag_cn_1 = __importStar(require("../misc/flag_cn"));
const types_1 = require("../types");
// tslint:disable-next-line:max-classes-per-file
class SortFilterWithSortedFilters {
    constructor(_filters) {
        this._filters = _filters;
        this.supportSort = true;
        this.filter.bind(this);
    }
    filter(nodeList) {
        const result = [];
        this._filters.forEach((filter) => {
            result.push(...nodeList.filter(filter));
        });
        return lodash_1.default.uniqBy(result, (node) => node.nodeName);
    }
}
exports.SortFilterWithSortedFilters = SortFilterWithSortedFilters;
// tslint:disable-next-line:max-classes-per-file
class SortFilterWithSortedKeywords {
    constructor(_keywords) {
        this._keywords = _keywords;
        this.supportSort = true;
        this.filter.bind(this);
    }
    filter(nodeList) {
        const result = [];
        this._keywords.forEach((keyword) => {
            result.push(...nodeList.filter((node) => node.nodeName.includes(keyword)));
        });
        return lodash_1.default.uniqBy(result, (node) => node.nodeName);
    }
}
exports.SortFilterWithSortedKeywords = SortFilterWithSortedKeywords;
const validateFilter = (filter) => {
    if (filter === null || filter === void 0) {
        return false;
    }
    if (typeof filter === 'function') {
        return true;
    }
    return (typeof filter === 'object' &&
        filter.supportSort &&
        typeof filter.filter === 'function');
};
exports.validateFilter = validateFilter;
const mergeFilters = (filters, isStrict) => {
    filters.forEach((filter) => {
        if (filter.hasOwnProperty('supportSort') && filter.supportSort) {
            throw new Error('mergeFilters 不支持包含排序功能的过滤器');
        }
        // istanbul ignore next
        if (typeof filter !== 'function') {
            throw new Error('mergeFilters 传入了无效的过滤器');
        }
    });
    return (item) => {
        return filters[isStrict ? 'every' : 'some']((filter) => filter(item));
    };
};
exports.mergeFilters = mergeFilters;
const useKeywords = (keywords, isStrict) => {
    // istanbul ignore next
    if (!Array.isArray(keywords)) {
        throw new Error('keywords 请使用数组');
    }
    return (item) => keywords[isStrict ? 'every' : 'some']((keyword) => item.nodeName.includes(keyword));
};
exports.useKeywords = useKeywords;
const discardKeywords = (keywords, isStrict) => {
    // istanbul ignore next
    if (!Array.isArray(keywords)) {
        throw new Error('keywords 请使用数组');
    }
    return (item) => !keywords[isStrict ? 'every' : 'some']((keyword) => item.nodeName.includes(keyword));
};
exports.discardKeywords = discardKeywords;
const useRegexp = (regexp) => {
    // istanbul ignore next
    if (!lodash_1.default.isRegExp(regexp)) {
        throw new Error('入参不是一个合法的正则表达式');
    }
    return (item) => regexp.test(item.nodeName);
};
exports.useRegexp = useRegexp;
const useProviders = (keywords, isStrict = true) => {
    // istanbul ignore next
    if (!Array.isArray(keywords)) {
        throw new Error('keywords 请使用数组');
    }
    return (item) => keywords.some((keyword) => {
        var _a, _b;
        return isStrict
            ? ((_a = item === null || item === void 0 ? void 0 : item.provider) === null || _a === void 0 ? void 0 : _a.name) === keyword
            : (_b = item === null || item === void 0 ? void 0 : item.provider) === null || _b === void 0 ? void 0 : _b.name.includes(keyword);
    });
};
exports.useProviders = useProviders;
const discardProviders = (keywords, isStrict = true) => {
    // istanbul ignore next
    if (!Array.isArray(keywords)) {
        throw new Error('keywords 请使用数组');
    }
    return (item) => !keywords.some((keyword) => {
        var _a, _b;
        return isStrict
            ? ((_a = item === null || item === void 0 ? void 0 : item.provider) === null || _a === void 0 ? void 0 : _a.name) === keyword
            : (_b = item === null || item === void 0 ? void 0 : item.provider) === null || _b === void 0 ? void 0 : _b.name.includes(keyword);
    });
};
exports.discardProviders = discardProviders;
const useSortedKeywords = (keywords) => {
    // istanbul ignore next
    if (!Array.isArray(keywords)) {
        throw new Error('keywords 请使用数组');
    }
    return new SortFilterWithSortedKeywords(keywords);
};
exports.useSortedKeywords = useSortedKeywords;
const mergeSortedFilters = (filters) => {
    filters.forEach((filter) => {
        if (filter.hasOwnProperty('supportSort') && filter.supportSort) {
            throw new Error('mergeSortedFilters 不支持包含排序功能的过滤器');
        }
        // istanbul ignore next
        if (typeof filter !== 'function') {
            throw new Error('mergeSortedFilters 传入了无效的过滤器');
        }
    });
    return new SortFilterWithSortedFilters(filters);
};
exports.mergeSortedFilters = mergeSortedFilters;
const netflixFilter = (item) => {
    return ['netflix', 'nf', 'hkbn', 'hkt', 'hgc', 'nbu'].some((key) => item.nodeName.toLowerCase().includes(key));
};
exports.netflixFilter = netflixFilter;
const usFilter = (item) => {
    return ['🇺🇸', ...flag_cn_1.default['🇺🇸']].some((key) => item.nodeName.toUpperCase().includes(key));
};
exports.usFilter = usFilter;
const hkFilter = (item) => {
    return ['🇭🇰', ...flag_cn_1.default['🇭🇰']].some((key) => item.nodeName.toUpperCase().includes(key));
};
exports.hkFilter = hkFilter;
const japanFilter = (item) => {
    return ['🇯🇵', ...flag_cn_1.default['🇯🇵']].some((key) => item.nodeName.toUpperCase().includes(key));
};
exports.japanFilter = japanFilter;
const koreaFilter = (item) => {
    return ['🇰🇷', ...flag_cn_1.default['🇰🇷']].some((key) => item.nodeName.toUpperCase().includes(key));
};
exports.koreaFilter = koreaFilter;
const singaporeFilter = (item) => {
    return ['🇸🇬', ...flag_cn_1.default['🇸🇬']].some((key) => item.nodeName.toUpperCase().includes(key));
};
exports.singaporeFilter = singaporeFilter;
const taiwanFilter = (item) => {
    return ['🇹🇼', ...flag_cn_1.TAIWAN].some((key) => item.nodeName.toUpperCase().includes(key));
};
exports.taiwanFilter = taiwanFilter;
const chinaBackFilter = (item) => {
    return [
        '回国',
        'Back',
        '中国上海',
        '中国北京',
        '中国徐州',
        '中国深圳',
        '中国枣庄',
        '中国郑州',
        '硅谷上海',
        '东京上海',
        'GCX',
    ].some((key) => item.nodeName.includes(key));
};
exports.chinaBackFilter = chinaBackFilter;
const chinaOutFilter = (item) => {
    return !(0, exports.chinaBackFilter)(item);
};
exports.chinaOutFilter = chinaOutFilter;
exports.youtubePremiumFilter = (0, exports.mergeFilters)([
    exports.usFilter,
    exports.japanFilter,
    exports.koreaFilter,
    exports.hkFilter,
    exports.singaporeFilter,
    exports.taiwanFilter,
]);
// istanbul ignore next
const shadowsocksFilter = (item) => item.type === types_1.NodeTypeEnum.Shadowsocks;
exports.shadowsocksFilter = shadowsocksFilter;
// istanbul ignore next
const shadowsocksrFilter = (item) => item.type === types_1.NodeTypeEnum.Shadowsocksr;
exports.shadowsocksrFilter = shadowsocksrFilter;
// istanbul ignore next
const vmessFilter = (item) => item.type === types_1.NodeTypeEnum.Vmess;
exports.vmessFilter = vmessFilter;
// istanbul ignore next
const v2rayFilter = (item) => item.type === types_1.NodeTypeEnum.Vmess;
exports.v2rayFilter = v2rayFilter;
// istanbul ignore next
const wireguardFilter = (item) => item.type === types_1.NodeTypeEnum.Wireguard;
exports.wireguardFilter = wireguardFilter;
// istanbul ignore next
const snellFilter = (item) => item.type === types_1.NodeTypeEnum.Snell;
exports.snellFilter = snellFilter;
// istanbul ignore next
const httpFilter = (item) => item.type === types_1.NodeTypeEnum.HTTP;
exports.httpFilter = httpFilter;
// istanbul ignore next
const httpsFilter = (item) => item.type === types_1.NodeTypeEnum.HTTPS;
exports.httpsFilter = httpsFilter;
// istanbul ignore next
const trojanFilter = (item) => item.type === types_1.NodeTypeEnum.Trojan;
exports.trojanFilter = trojanFilter;
// istanbul ignore next
const socks5Filter = (item) => item.type === types_1.NodeTypeEnum.Socks5;
exports.socks5Filter = socks5Filter;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmlsdGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vbGliL3V0aWxzL2ZpbHRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsb0RBQXVCO0FBRXZCLDJEQUErQztBQUMvQyxvQ0FLa0I7QUFFbEIsZ0RBQWdEO0FBQ2hELE1BQWEsMkJBQTJCO0lBR3RDLFlBQW1CLFFBQTJDO1FBQTNDLGFBQVEsR0FBUixRQUFRLENBQW1DO1FBRnZELGdCQUFXLEdBQUcsSUFBSSxDQUFDO1FBR3hCLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3pCLENBQUM7SUFFTSxNQUFNLENBQ1gsUUFBNkM7UUFFN0MsTUFBTSxNQUFNLEdBQTZCLEVBQUUsQ0FBQztRQUU1QyxJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDLE1BQU0sRUFBRSxFQUFFO1lBQy9CLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxRQUFRLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFDMUMsQ0FBQyxDQUFDLENBQUM7UUFFSCxPQUFPLGdCQUFDLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQ25ELENBQUM7Q0FDRjtBQWxCRCxrRUFrQkM7QUFFRCxnREFBZ0Q7QUFDaEQsTUFBYSw0QkFBNEI7SUFHdkMsWUFBbUIsU0FBZ0M7UUFBaEMsY0FBUyxHQUFULFNBQVMsQ0FBdUI7UUFGNUMsZ0JBQVcsR0FBRyxJQUFJLENBQUM7UUFHeEIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDekIsQ0FBQztJQUVNLE1BQU0sQ0FDWCxRQUE2QztRQUU3QyxNQUFNLE1BQU0sR0FBNkIsRUFBRSxDQUFDO1FBRTVDLElBQUksQ0FBQyxTQUFTLENB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