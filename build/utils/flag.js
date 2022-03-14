"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeFlag = exports.prependFlag = exports.addFlagMap = void 0;
const emoji_regex_1 = __importDefault(require("emoji-regex"));
const lodash_1 = __importDefault(require("lodash"));
const flag_cn_1 = __importDefault(require("../misc/flag_cn"));
const flagMap = new Map();
const customFlagMap = new Map();
Object.keys(flag_cn_1.default).forEach((emoji) => {
    flag_cn_1.default[emoji].forEach((name) => {
        flagMap.set(name, emoji);
    });
});
const addFlagMap = (name, emoji) => {
    if (flagMap.has(name)) {
        flagMap.delete(name);
    }
    customFlagMap.set(name, emoji);
};
exports.addFlagMap = addFlagMap;
const prependFlag = (str, removeExistingEmoji = false) => {
    const emojiRegex = (0, emoji_regex_1.default)();
    const existingEmoji = emojiRegex.exec(str);
    if (existingEmoji) {
        if (removeExistingEmoji) {
            // 去除已有的 emoji
            str = (0, exports.removeFlag)(str);
        }
        else {
            // 不作处理
            return str;
        }
    }
    for (const [key, value] of customFlagMap.entries()) {
        if (lodash_1.default.isRegExp(key)) {
            if (key.test(str)) {
                return `${value} ${str}`;
            }
        }
        else {
            if (str.toUpperCase().includes(key)) {
                return `${value} ${str}`;
            }
        }
    }
    for (const [key, value] of flagMap.entries()) {
        if (lodash_1.default.isRegExp(key)) {
            if (key.test(str)) {
                return `${value} ${str}`;
            }
        }
        else {
            if (str.toUpperCase().includes(key)) {
                return `${value} ${str}`;
            }
        }
    }
    return str;
};
exports.prependFlag = prependFlag;
const removeFlag = (str) => {
    const emojiRegex = (0, emoji_regex_1.default)();
    return str.replace(emojiRegex, '').trim();
};
exports.removeFlag = removeFlag;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmxhZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi91dGlscy9mbGFnLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLDhEQUFxQztBQUNyQyxvREFBdUI7QUFFdkIsOERBQW1DO0FBRW5DLE1BQU0sT0FBTyxHQUFpQyxJQUFJLEdBQUcsRUFBRSxDQUFDO0FBQ3hELE1BQU0sYUFBYSxHQUFpQyxJQUFJLEdBQUcsRUFBRSxDQUFDO0FBRTlELE1BQU0sQ0FBQyxJQUFJLENBQUMsaUJBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEtBQUssRUFBRSxFQUFFO0lBQ2xDLGlCQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBWSxFQUFFLEVBQUU7UUFDbkMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFDM0IsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQztBQUVJLE1BQU0sVUFBVSxHQUFHLENBQUMsSUFBcUIsRUFBRSxLQUFhLEVBQVEsRUFBRTtJQUN2RSxJQUFJLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUU7UUFDckIsT0FBTyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztLQUN0QjtJQUNELGFBQWEsQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDO0FBQ2pDLENBQUMsQ0FBQztBQUxXLFFBQUEsVUFBVSxjQUtyQjtBQUVLLE1BQU0sV0FBVyxHQUFHLENBQ3pCLEdBQVcsRUFDWCxtQkFBbUIsR0FBRyxLQUFLLEVBQ25CLEVBQUU7SUFDVixNQUFNLFVBQVUsR0FBRyxJQUFBLHFCQUFVLEdBQUUsQ0FBQztJQUNoQyxNQUFNLGFBQWEsR0FBRyxVQUFVLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBRTNDLElBQUksYUFBYSxFQUFFO1FBQ2pCLElBQUksbUJBQW1CLEVBQUU7WUFDdkIsY0FBYztZQUNkLEdBQUcsR0FBRyxJQUFBLGtCQUFVLEVBQUMsR0FBRyxDQUFDLENBQUM7U0FDdkI7YUFBTTtZQUNMLE9BQU87WUFDUCxPQUFPLEdBQUcsQ0FBQztTQUNaO0tBQ0Y7SUFFRCxLQUFLLE1BQU0sQ0FBQyxHQUFHLEVBQUUsS0FBSyxDQUFDLElBQUksYUFBYSxDQUFDLE9BQU8sRUFBRSxFQUFFO1FBQ2xELElBQUksZ0JBQUMsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLEVBQUU7WUFDbkIsSUFBSSxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFO2dCQUNqQixPQUFPLEdBQUcsS0FBSyxJQUFJLEdBQUcsRUFBRSxDQUFDO2FBQzFCO1NBQ0Y7YUFBTTtZQUNMLElBQUksR0FBRyxDQUFDLFdBQVcsRUFBRSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsRUFBRTtnQkFDbkMsT0FBTyxHQUFHLEtBQUssSUFBSSxHQUFHLEVBQUUsQ0FBQzthQUMxQjtTQUNGO0tBQ0Y7SUFFRCxLQUFLLE1BQU0sQ0FBQyxHQUFHLEVBQUUsS0FBSyxDQUFDLElBQUksT0FBTyxDQUFDLE9BQU8sRUFBRSxFQUFFO1FBQzVDLElBQUksZ0JBQUMsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLEVBQUU7WUFDbkIsSUFBSSxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFO2dCQUNqQixPQUFPLEdBQUcsS0FBSyxJQUFJLEdBQUcsRUFBRSxDQUFDO2FBQzFCO1NBQ0Y7YUFBTTtZQUNMLElBQUksR0FBRyxDQUFDLFdBQVcsRUFBRSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsRUFBRTtnQkFDbkMsT0FBTyxHQUFHLEtBQUssSUFBSSxHQUFHLEVBQUUsQ0FBQzthQUMxQjtTQUNGO0tBQ0Y7SUFFRCxPQUFPLEdBQUcsQ0FBQztBQUNiLENBQUMsQ0FBQztBQTFDVyxRQUFBLFdBQVcsZUEwQ3RCO0FBRUssTUFBTSxVQUFVLEdBQUcsQ0FBQyxHQUFXLEVBQVUsRUFBRTtJQUNoRCxNQUFNLFVBQVUsR0FBRyxJQUFBLHFCQUFVLEdBQUUsQ0FBQztJQUNoQyxPQUFPLEdBQUcsQ0FBQyxPQUFPLENBQUMsVUFBVSxFQUFFLEVBQUUsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO0FBQzVDLENBQUMsQ0FBQztBQUhXLFFBQUEsVUFBVSxjQUdyQiJ9