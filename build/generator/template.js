"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadLocalSnippet = exports.convertNewSurgeScriptRuleToQuantumultXRewriteRule = exports.convertSurgeScriptRuleToQuantumultXRewriteRule = exports.getEngine = void 0;
const fs_extra_1 = __importDefault(require("fs-extra"));
const nunjucks_1 = __importDefault(require("nunjucks"));
const path_1 = __importDefault(require("path"));
const yaml_1 = __importDefault(require("yaml"));
const util_1 = require("util");
const deprecation_1 = require("../misc/deprecation");
const utils_1 = require("../utils");
const constant_1 = require("../constant");
const remote_snippet_1 = require("../utils/remote-snippet");
function getEngine(templateDir) {
    const engine = nunjucks_1.default.configure(templateDir, {
        autoescape: false,
    });
    const clashFilter = (str) => {
        // istanbul ignore next
        if (!str) {
            return '';
        }
        const array = str.split('\n');
        return array
            .map((item) => {
            const testString = !!item && item.trim() !== '' ? item.toUpperCase() : '';
            if (testString.startsWith('#') || testString === '') {
                return item;
            }
            const matched = testString.match(/^([\w-]+),/);
            if (matched && constant_1.CLASH_SUPPORTED_RULE.some((s) => matched[1] === s)) {
                // 过滤出支持的规则类型
                return `- ${item}`.replace(/\/\/.*$/, '').trim();
            }
            return null;
        })
            .filter((item) => !!item)
            .join('\n');
    };
    engine.addFilter('patchYamlArray', (0, util_1.deprecate)(clashFilter, deprecation_1.DEP007, 'DEP007'));
    engine.addFilter('clash', clashFilter);
    engine.addFilter('quantumultx', (str) => {
        // istanbul ignore next
        if (!str) {
            return '';
        }
        const array = str.split('\n');
        return array
            .map((item) => {
            const testString = !!item && item.trim() !== '' ? item.toUpperCase() : '';
            if (testString.startsWith('#') || testString === '') {
                return item;
            }
            // Surge Script 处理
            if (testString.startsWith('HTTP-RESPONSE')) {
                return (0, exports.convertSurgeScriptRuleToQuantumultXRewriteRule)(item);
            }
            if (testString.startsWith('HTTP-REQUEST')) {
                return (0, exports.convertSurgeScriptRuleToQuantumultXRewriteRule)(item);
            }
            if (/type\s?=\s?http-response/.test(item)) {
                return (0, exports.convertNewSurgeScriptRuleToQuantumultXRewriteRule)(item);
            }
            if (/type\s?=\s?http-request/.test(item)) {
                return (0, exports.convertNewSurgeScriptRuleToQuantumultXRewriteRule)(item);
            }
            const matched = testString.match(/^([\w-]+),/);
            if (matched &&
                constant_1.QUANTUMULT_X_SUPPORTED_RULE.some((s) => matched[1] === s)) {
                if (matched[1] === 'IP-CIDR6') {
                    return item.replace(/IP-CIDR6/i, 'IP6-CIDR');
                }
                // 过滤出支持的规则类型
                return item;
            }
            return null;
        })
            .filter((item) => !!item)
            .join('\n');
    });
    engine.addFilter('mellow', (str) => {
        // istanbul ignore next
        if (!str) {
            return '';
        }
        const array = str.split('\n');
        return array
            .filter((item) => {
            const testString = !!item && item.trim() !== '' ? item.toUpperCase() : '';
            return constant_1.MELLOW_UNSUPPORTED_RULE.every((s) => !testString.startsWith(s));
        })
            .map((item) => {
            if (item.startsWith('#') || str.trim() === '') {
                return item;
            }
            return item
                .replace(/,no-resolve/, '')
                .replace(/\/\/.*$/, '')
                .trim();
        })
            .join('\n');
    });
    engine.addFilter('loon', (str) => {
        // istanbul ignore next
        if (!str) {
            return '';
        }
        const array = str.split('\n');
        return array
            .map((item) => {
            const testString = !!item && item.trim() !== '' ? item.toUpperCase() : '';
            if (testString.startsWith('#') || testString === '') {
                return item;
            }
            const matched = testString.match(/^([\w-]+),/);
            if (matched && constant_1.LOON_SUPPORTED_RULE.some((s) => matched[1] === s)) {
                // 过滤出支持的规则类型
                return `${item}`.replace(/\/\/.*$/, '').trim();
            }
            return null;
        })
            .filter((item) => !!item)
            .join('\n');
    });
    // yaml
    engine.addFilter('yaml', (obj) => yaml_1.default.stringify(obj));
    // base64
    engine.addFilter('base64', (str) => (0, utils_1.toBase64)(str));
    // json
    engine.addFilter('json', (obj) => JSON.stringify(obj));
    return engine;
}
exports.getEngine = getEngine;
const convertSurgeScriptRuleToQuantumultXRewriteRule = (str) => {
    const parts = str.split(' ');
    const result = [];
    switch (parts[0]) {
        case 'http-response': {
            const params = (0, utils_1.decodeStringList)(parts.splice(2).join('').split(','));
            const scriptPath = params['script-path'];
            const isRequireBody = 'requires-body' in params;
            if (isRequireBody) {
                // parts[1] => Effective URL Rule
                result.push(parts[1], 'url', 'script-response-body', scriptPath);
            }
            else {
                result.push(parts[1], 'url', 'script-response-header', scriptPath);
            }
            return result.join(' ');
        }
        case 'http-request': {
            const params = (0, utils_1.decodeStringList)(parts.splice(2).join('').split(','));
            const scriptPath = params['script-path'];
            const isRequireBody = 'requires-body' in params;
            if (isRequireBody) {
                // parts[1] => Effective URL Rule
                result.push(parts[1], 'url', 'script-request-body', scriptPath);
            }
            else {
                result.push(parts[1], 'url', 'script-request-header', scriptPath);
            }
            return result.join(' ');
        }
        default:
            return '';
    }
};
exports.convertSurgeScriptRuleToQuantumultXRewriteRule = convertSurgeScriptRuleToQuantumultXRewriteRule;
const convertNewSurgeScriptRuleToQuantumultXRewriteRule = (str) => {
    const matched = str.match(/^(.+?)=(.+?)$/);
    const result = [];
    if (!matched) {
        return '';
    }
    const params = (0, utils_1.decodeStringList)(matched[2].trim().split(','));
    switch (params.type) {
        case 'http-response': {
            const isRequireBody = 'requires-body' in params;
            if (isRequireBody) {
                result.push(params.pattern, 'url', 'script-response-body', params['script-path']);
            }
            else {
                result.push(params.pattern, 'url', 'script-response-header', params['script-path']);
            }
            return result.join(' ');
        }
        case 'http-request': {
            const isRequireBody = 'requires-body' in params;
            if (isRequireBody) {
                result.push(params.pattern, 'url', 'script-request-body', params['script-path']);
            }
            else {
                result.push(params.pattern, 'url', 'script-request-header', params['script-path']);
            }
            return result.join(' ');
        }
        default:
            return '';
    }
};
exports.convertNewSurgeScriptRuleToQuantumultXRewriteRule = convertNewSurgeScriptRuleToQuantumultXRewriteRule;
const loadLocalSnippet = (cwd, relativeFilePath) => {
    // istanbul ignore next
    if (!relativeFilePath) {
        throw new Error('必须指定一个文件');
    }
    const absFilePath = path_1.default.join(cwd, relativeFilePath);
    const file = fs_extra_1.default.readFileSync(absFilePath, { encoding: 'utf-8' });
    return {
        url: absFilePath,
        name: '',
        main: (rule) => (0, remote_snippet_1.addProxyToSurgeRuleSet)(file, rule),
        text: file,
    };
};
exports.loadLocalSnippet = loadLocalSnippet;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVtcGxhdGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9saWIvZ2VuZXJhdG9yL3RlbXBsYXRlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLHdEQUEwQjtBQUMxQix3REFBZ0M7QUFDaEMsZ0RBQXdCO0FBRXhCLGdEQUF3QjtBQUN4QiwrQkFBaUM7QUFDakMscURBQTZDO0FBRzdDLG9DQUFzRDtBQUN0RCwwQ0FLcUI7QUFDckIsNERBQWlFO0FBRWpFLFNBQWdCLFNBQVMsQ0FBQyxXQUFtQjtJQUMzQyxNQUFNLE1BQU0sR0FBRyxrQkFBUSxDQUFDLFNBQVMsQ0FBQyxXQUFXLEVBQUU7UUFDN0MsVUFBVSxFQUFFLEtBQUs7S0FDbEIsQ0FBQyxDQUFDO0lBRUgsTUFBTSxXQUFXLEdBQUcsQ0FBQyxHQUFZLEVBQVUsRUFBRTtRQUMzQyx1QkFBdUI7UUFDdkIsSUFBSSxDQUFDLEdBQUcsRUFBRTtZQUNSLE9BQU8sRUFBRSxDQUFDO1NBQ1g7UUFFRCxNQUFNLEtBQUssR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBRTlCLE9BQU8sS0FBSzthQUNULEdBQUcsQ0FBQyxDQUFDLElBQUksRUFBRSxFQUFFO1lBQ1osTUFBTSxVQUFVLEdBQ2QsQ0FBQyxDQUFDLElBQUksSUFBSSxJQUFJLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztZQUV6RCxJQUFJLFVBQVUsQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLElBQUksVUFBVSxLQUFLLEVBQUUsRUFBRTtnQkFDbkQsT0FBTyxJQUFJLENBQUM7YUFDYjtZQUVELE1BQU0sT0FBTyxHQUFHLFVBQVUsQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDLENBQUM7WUFFL0MsSUFBSSxPQUFPLElBQUksK0JBQW9CLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUU7Z0JBQ2pFLGFBQWE7Z0JBQ2IsT0FBTyxLQUFLLElBQUksRUFBRSxDQUFDLE9BQU8sQ0FBQyxTQUFTLEVBQUUsRUFBRSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7YUFDbEQ7WUFFRCxPQUFPLElBQUksQ0FBQztRQUNkLENBQUMsQ0FBQzthQUNELE1BQU0sQ0FBQyxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQzthQUN4QixJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDaEIsQ0FBQyxDQUFDO0lBRUYsTUFBTSxDQUFDLFNBQVMsQ0FBQyxnQkFBZ0IsRUFBRSxJQUFBLGdCQUFTLEVBQUMsV0FBVyxFQUFFLG9CQUFNLEVBQUUsUUFBUSxDQUFDLENBQUMsQ0FBQztJQUM3RSxNQUFNLENBQUMsU0FBUyxDQUFDLE9BQU8sRUFBRSxXQUFXLENBQUMsQ0FBQztJQUV2QyxNQUFNLENBQUMsU0FBUyxDQUFDLGFBQWEsRUFBRSxDQUFDLEdBQVksRUFBVSxFQUFFO1FBQ3ZELHVCQUF1QjtRQUN2QixJQUFJLENBQUMsR0FBRyxFQUFFO1lBQ1IsT0FBTyxFQUFFLENBQUM7U0FDWDtRQUVELE1BQU0sS0FBSyxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7UUFFOUIsT0FBTyxLQUFLO2FBQ1QsR0FBRyxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUU7WUFDWixNQUFNLFVBQVUsR0FDZCxDQUFDLENBQUMsSUFBSSxJQUFJLElBQUksQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO1lBRXpELElBQUksVUFBVSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsSUFBSSxVQUFVLEtBQUssRUFBRSxFQUFFO2dCQUNuRCxPQUFPLElBQUksQ0FBQzthQUNiO1lBRUQsa0JBQWtCO1lBQ2xCLElBQUksVUFBVSxDQUFDLFVBQVUsQ0FBQyxlQUFlLENBQUMsRUFBRTtnQkFDMUMsT0FBTyxJQUFBLHNEQUE4QyxFQUFDLElBQUksQ0FBQyxDQUFDO2FBQzdEO1lBQ0QsSUFBSSxVQUFVLENBQUMsVUFBVSxDQUFDLGNBQWMsQ0FBQyxFQUFFO2dCQUN6QyxPQUFPLElBQUEsc0RBQThDLEVBQUMsSUFBSSxDQUFDLENBQUM7YUFDN0Q7WUFDRCxJQUFJLDBCQUEwQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRTtnQkFDekMsT0FBTyxJQUFBLHlEQUFpRCxFQUFDLElBQUksQ0FBQyxDQUFDO2FBQ2hFO1lBQ0QsSUFBSSx5QkFBeUIsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUU7Z0JBQ3hDLE9BQU8sSUFBQSx5REFBaUQsRUFBQyxJQUFJLENBQUMsQ0FBQzthQUNoRTtZQUVELE1BQU0sT0FBTyxHQUFHLFVBQVUsQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDLENBQUM7WUFFL0MsSUFDRSxPQUFPO2dCQUNQLHNDQUEyQixDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUN6RDtnQkFDQSxJQUFJLE9BQU8sQ0FBQyxDQUFDLENBQUMsS0FBSyxVQUFVLEVBQUU7b0JBQzdCLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLEVBQUUsVUFBVSxDQUFDLENBQUM7aUJBQzlDO2dCQUVELGFBQWE7Z0JBQ2IsT0FBTyxJQUFJLENBQUM7YUFDYjtZQUVELE9BQU8sSUFBSSxDQUFDO1FBQ2QsQ0FBQyxDQUFDO2FBQ0QsTUFBTSxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO2FBQ3hCLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNoQixDQUFDLENBQUMsQ0FBQztJQUVILE1BQU0sQ0FBQyxTQUFTLENBQUMsUUFBUSxFQUFFLENBQUMsR0FBWSxFQUFVLEVBQUU7UUFDbEQsdUJBQXVCO1FBQ3ZCLElBQUksQ0FBQyxHQUFHLEVBQUU7WUFDUixPQUFPLEVBQUUsQ0FBQztTQUNYO1FBRUQsTUFBTSxLQUFLLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUU5QixPQUFPLEtBQUs7YUFDVCxNQUFNLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRTtZQUNmLE1BQU0sVUFBVSxHQUNkLENBQUMsQ0FBQyxJQUFJLElBQUksSUFBSSxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7WUFFekQsT0FBTyxrQ0FBdUIsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsVUFBVSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3pFLENBQUMsQ0FBQzthQUNELEdBQUcsQ0FBQyxDQUFDLElBQVksRUFBRSxFQUFFO1lBQ3BCLElBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsSUFBSSxHQUFHLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxFQUFFO2dCQUM3QyxPQUFPLElBQUksQ0FBQzthQUNiO1lBQ0QsT0FBTyxJQUFJO2lCQUNSLE9BQU8sQ0FBQyxhQUFhLEVBQUUsRUFBRSxDQUFDO2lCQUMxQixPQUFPLENBQUMsU0FBUyxFQUFFLEVBQUUsQ0FBQztpQkFDdEIsSUFBSSxFQUFFLENBQUM7UUFDWixDQUFDLENBQUM7YUFDRCxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDaEIsQ0FBQyxDQUFDLENBQUM7SUFFSCxNQUFNLENBQUMsU0FBUyxDQUFDLE1BQU0sRUFBRSxDQUFDLEdBQVksRUFBVSxFQUFFO1FBQ2hELHVCQUF1QjtRQUN2QixJQUFJLENBQUMsR0FBRyxFQUFFO1lBQ1IsT0FBTyxFQUFFLENBQUM7U0FDWDtRQUVELE1BQU0sS0FBSyxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7UUFFOUIsT0FBTyxLQUFLO2FBQ1QsR0FBRyxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUU7WUFDWixNQUFNLFVBQVUsR0FDZCxDQUFDLENBQUMsSUFBSSxJQUFJLElBQUksQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO1lBRXpELElBQUksVUFBVSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsSUFBSSxVQUFVLEtBQUssRUFBRSxFQUFFO2dCQUNuRCxPQUFPLElBQUksQ0FBQzthQUNiO1lBRUQsTUFBTSxPQUFPLEdBQUcsVUFBVSxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsQ0FBQztZQUUvQyxJQUFJLE9BQU8sSUFBSSw4QkFBbUIsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRTtnQkFDaEUsYUFBYTtnQkFDYixPQUFPLEdBQUcsSUFBSSxFQUFFLENBQUMsT0FBTyxDQUFDLFNBQVMsRUFBRSxFQUFFLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQzthQUNoRDtZQUVELE9BQU8sSUFBSSxDQUFDO1FBQ2QsQ0FBQyxDQUFDO2FBQ0QsTUFBTSxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO2FBQ3hCLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNoQixDQUFDLENBQUMsQ0FBQztJQUVILE9BQU87SUFDUCxNQUFNLENBQUMsU0FBUyxDQUFDLE1BQU0sRUFBRSxDQUFDLEdBQWUsRUFBRSxFQUFFLENBQUMsY0FBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0lBRW5FLFNBQVM7SUFDVCxNQUFNLENBQUMsU0FBUyxDQUFDLFFBQVEsRUFBRSxDQUFDLEdBQVcsRUFBRSxFQUFFLENBQUMsSUFBQSxnQkFBUSxFQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7SUFFM0QsT0FBTztJQUNQLE1BQU0sQ0FBQyxTQUFTLENBQUMsTUFBTSxFQUFFLENBQUMsR0FBZSxFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7SUFFbkUsT0FBTyxNQUFNLENBQUM7QUFDaEIsQ0FBQztBQTVKRCw4QkE0SkM7QUFFTSxNQUFNLDhDQUE4QyxHQUFHLENBQzVELEdBQVcsRUFDSCxFQUFFO0lBQ1YsTUFBTSxLQUFLLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUM3QixNQUFNLE1BQU0sR0FBYSxFQUFFLENBQUM7SUFFNUIsUUFBUSxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUU7UUFDaEIsS0FBSyxlQUFlLENBQUMsQ0FBQztZQUNwQixNQUFNLE1BQU0sR0FBRyxJQUFBLHdCQUFnQixFQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1lBQ3JFLE1BQU0sVUFBVSxHQUFHLE1BQU0sQ0FBQyxhQUFhLENBQUMsQ0FBQztZQUN6QyxNQUFNLGFBQWEsR0FBRyxlQUFlLElBQUksTUFBTSxDQUFDO1lBRWhELElBQUksYUFBYSxFQUFFO2dCQUNqQixpQ0FBaUM7Z0JBQ2pDLE1BQU0sQ0FBQyxJQUFJLENBQ1QsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUNSLEtBQUssRUFDTCxzQkFBc0IsRUFDdEIsVUFBb0IsQ0FDckIsQ0FBQzthQUNIO2lCQUFNO2dCQUNMLE1BQU0sQ0FBQyxJQUFJLENBQ1QsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUNSLEtBQUssRUFDTCx3QkFBd0IsRUFDeEIsVUFBb0IsQ0FDckIsQ0FBQzthQUNIO1lBRUQsT0FBTyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1NBQ3pCO1FBQ0QsS0FBSyxjQUFjLENBQUMsQ0FBQztZQUNuQixNQUFNLE1BQU0sR0FBRyxJQUFBLHdCQUFnQixFQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1lBQ3JFLE1BQU0sVUFBVSxHQUFHLE1BQU0sQ0FBQyxhQUFhLENBQUMsQ0FBQztZQUN6QyxNQUFNLGFBQWEsR0FBRyxlQUFlLElBQUksTUFBTSxDQUFDO1lBRWhELElBQUksYUFBYSxFQUFFO2dCQUNqQixpQ0FBaUM7Z0JBQ2pDLE1BQU0sQ0FBQyxJQUFJLENBQ1QsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUNSLEtBQUssRUFDTCxxQkFBcUIsRUFDckIsVUFBb0IsQ0FDckIsQ0FBQzthQUNIO2lCQUFNO2dCQUNMLE1BQU0sQ0FBQyxJQUFJLENBQ1QsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUNSLEtBQUssRUFDTCx1QkFBdUIsRUFDdkIsVUFBb0IsQ0FDckIsQ0FBQzthQUNIO1lBRUQsT0FBTyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1NBQ3pCO1FBQ0Q7WUFDRSxPQUFPLEVBQUUsQ0FBQztLQUNiO0FBQ0gsQ0FBQyxDQUFDO0FBMURXLFFBQUEsOENBQThDLGtEQTBEekQ7QUFFSyxNQUFNLGlEQUFpRCxHQUFHLENBQy9ELEdBQVcsRUFDSCxFQUFFO0lBQ1YsTUFBTSxPQUFPLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQyxlQUFlLENBQUMsQ0FBQztJQUMzQyxNQUFNLE1BQU0sR0FBYSxFQUFFLENBQUM7SUFFNUIsSUFBSSxDQUFDLE9BQU8sRUFBRTtRQUNaLE9BQU8sRUFBRSxDQUFDO0tBQ1g7SUFFRCxNQUFNLE1BQU0sR0FBRyxJQUFBLHdCQUFnQixFQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztJQUU5RCxRQUFRLE1BQU0sQ0FBQyxJQUFJLEVBQUU7UUFDbkIsS0FBSyxlQUFlLENBQUMsQ0FBQztZQUNwQixNQUFNLGFBQWEsR0FBRyxlQUFlLElBQUksTUFBTSxDQUFDO1lBRWhELElBQUksYUFBYSxFQUFFO2dCQUNqQixNQUFNLENBQUMsSUFBSSxDQUNULE1BQU0sQ0FBQyxPQUFpQixFQUN4QixLQUFLLEVBQ0wsc0JBQXNCLEVBQ3RCLE1BQU0sQ0FBQyxhQUFhLENBQVcsQ0FDaEMsQ0FBQzthQUNIO2lCQUFNO2dCQUNMLE1BQU0sQ0FBQyxJQUFJLENBQ1QsTUFBTSxDQUFDLE9BQWlCLEVBQ3hCLEtBQUssRUFDTCx3QkFBd0IsRUFDeEIsTUFBTSxDQUFDLGFBQWEsQ0FBVyxDQUNoQyxDQUFDO2FBQ0g7WUFFRCxPQUFPLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7U0FDekI7UUFDRCxLQUFLLGNBQWMsQ0FBQyxDQUFDO1lBQ25CLE1BQU0sYUFBYSxHQUFHLGVBQWUsSUFBSSxNQUFNLENBQUM7WUFFaEQsSUFBSSxhQUFhLEVBQUU7Z0JBQ2pCLE1BQU0sQ0FBQyxJQUFJLENBQ1QsTUFBTSxDQUFDLE9BQWlCLEVBQ3hCLEtBQUssRUFDTCxxQkFBcUIsRUFDckIsTUFBTSxDQUFDLGFBQWEsQ0FBVyxDQUNoQyxDQUFDO2FBQ0g7aUJBQU07Z0JBQ0wsTUFBTSxDQUFDLElBQUksQ0FDVCxNQUFNLENBQUMsT0FBaUIsRUFDeEIsS0FBSyxFQUNMLHVCQUF1QixFQUN2QixNQUFNLENBQUMsYUFBYSxDQUFXLENBQ2hDLENBQUM7YUFDSDtZQUVELE9BQU8sTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztTQUN6QjtRQUNEO1lBQ0UsT0FBTyxFQUFFLENBQUM7S0FDYjtBQUNILENBQUMsQ0FBQztBQTFEVyxRQUFBLGlEQUFpRCxxREEwRDVEO0FBRUssTUFBTSxnQkFBZ0IsR0FBRyxDQUM5QixHQUFXLEVBQ1gsZ0JBQXlCLEVBQ1YsRUFBRTtJQUNqQix1QkFBdUI7SUFDdkIsSUFBSSxDQUFDLGdCQUFnQixFQUFFO1FBQ3JCLE1BQU0sSUFBSSxLQUFLLENBQUMsVUFBVSxDQUFDLENBQUM7S0FDN0I7SUFFRCxNQUFNLFdBQVcsR0FBRyxjQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDO0lBQ3JELE1BQU0sSUFBSSxHQUFHLGtCQUFFLENBQUMsWUFBWSxDQUFDLFdBQVcsRUFBRSxFQUFFLFFBQVEsRUFBRSxPQUFPLEVBQUUsQ0FBQyxDQUFDO0lBRWpFLE9BQU87UUFDTCxHQUFHLEVBQUUsV0FBVztRQUNoQixJQUFJLEVBQUUsRUFBRTtRQUNSLElBQUksRUFBRSxDQUFDLElBQVksRUFBRSxFQUFFLENBQUMsSUFBQSx1Q0FBc0IsRUFBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO1FBQzFELElBQUksRUFBRSxJQUFJO0tBQ1gsQ0FBQztBQUNKLENBQUMsQ0FBQztBQWxCVyxRQUFBLGdCQUFnQixvQkFrQjNCIn0=