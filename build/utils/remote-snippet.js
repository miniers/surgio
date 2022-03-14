"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadRemoteSnippetList = exports.renderSurgioSnippet = exports.addProxyToSurgeRuleSet = exports.parseMacro = void 0;
const bluebird_1 = __importDefault(require("bluebird"));
const crypto_1 = __importDefault(require("crypto"));
const logger_1 = require("@surgio/logger");
const detect_newline_1 = __importDefault(require("detect-newline"));
const nunjucks_1 = __importDefault(require("nunjucks"));
const espree_1 = __importDefault(require("espree"));
const cache_1 = require("./cache");
const env_flag_1 = require("./env-flag");
const http_client_1 = __importDefault(require("./http-client"));
const index_1 = require("./index");
const tmp_helper_1 = require("./tmp-helper");
const parseMacro = (snippet) => {
    const regex = /{%\s?macro(.*)\s?%}/gm;
    const match = regex.exec(snippet);
    if (!match) {
        throw new Error('该片段不包含可用的宏');
    }
    const ast = espree_1.default.parse(match[1], { ecmaVersion: 6 });
    let statement;
    for (const node of ast.body) {
        if (node.type === 'ExpressionStatement') {
            statement = node;
            break;
        }
    }
    if (!statement ||
        statement.expression.type !== 'CallExpression' ||
        statement.expression.callee.name !== 'main') {
        throw new Error('该片段不包含可用的宏');
    }
    return {
        functionName: statement.expression.callee.name,
        arguments: statement.expression.arguments.map((item) => item.name),
    };
};
exports.parseMacro = parseMacro;
const addProxyToSurgeRuleSet = (str, proxyName) => {
    if (!proxyName) {
        throw new Error('必须为片段指定一个策略');
    }
    const eol = (0, detect_newline_1.default)(str) || '\n';
    return str
        .split(eol)
        .map((item) => {
        if (item.trim() === '' || item.startsWith('#') || item.startsWith('//')) {
            return item;
        }
        const rule = item.split(',');
        switch (rule[0].trim().toUpperCase()) {
            case 'URL-REGEX':
            case 'AND':
            case 'OR':
            case 'NOT':
                return `${item},${proxyName}`;
            case 'IP-CIDR':
            case 'IP-CIDR6':
            case 'GEOIP':
                rule.splice(2, 0, proxyName);
                return rule.join(',');
            default:
                if (rule[rule.length - 1].includes('#') ||
                    rule[rule.length - 1].includes('//')) {
                    rule[rule.length - 1] = rule[rule.length - 1]
                        .replace(/(#|\/\/)(.*)/, '')
                        .trim();
                }
                return [...rule, proxyName].join(',');
        }
    })
        .join(eol);
};
exports.addProxyToSurgeRuleSet = addProxyToSurgeRuleSet;
const renderSurgioSnippet = (str, args) => {
    const macro = (0, exports.parseMacro)(str);
    macro.arguments.forEach((key, index) => {
        if (typeof args[index] === 'undefined') {
            throw new Error('Surgio 片段参数不足，缺少 ' + key);
        }
        else if (typeof args[index] !== 'string') {
            throw new Error(`Surgio 片段参数 ${key} 不为字符串`);
        }
    });
    const template = [
        `${str}`,
        `{{ main(${args.map((item) => JSON.stringify(item)).join(',')}) }}`,
    ].join('\n');
    return nunjucks_1.default.renderString(template, {}).trim();
};
exports.renderSurgioSnippet = renderSurgioSnippet;
const loadRemoteSnippetList = (remoteSnippetList, cacheSnippet = true) => {
    const tmpFactory = (0, tmp_helper_1.createTmpFactory)('remote-snippets');
    function load(url) {
        return http_client_1.default
            .get(url)
            .then((data) => {
            logger_1.logger.info(`远程片段下载成功: ${url}`);
            return data.body;
        })
            .catch((err) => {
            logger_1.logger.error(`远程片段下载失败: ${url}`);
            throw err;
        });
    }
    return bluebird_1.default.map(remoteSnippetList, (item) => {
        const fileMd5 = crypto_1.default.createHash('md5').update(item.url).digest('hex');
        const isSurgioSnippet = item.surgioSnippet;
        return (async () => {
            if (cacheSnippet || (0, index_1.isNow)()) {
                const tmp = tmpFactory(fileMd5, (0, env_flag_1.getRemoteSnippetCacheMaxage)());
                const tmpContent = await tmp.getContent();
                let snippet;
                if (tmpContent) {
                    snippet = tmpContent;
                }
                else {
                    snippet = await load(item.url);
                    await tmp.setContent(snippet);
                }
                return {
                    main: (...args) => isSurgioSnippet
                        ? (0, exports.renderSurgioSnippet)(snippet, args)
                        : (0, exports.addProxyToSurgeRuleSet)(snippet, args[0]),
                    name: item.name,
                    url: item.url,
                    text: snippet, // 原始内容
                };
            }
            else {
                const snippet = cache_1.ConfigCache.has(item.url)
                    ? cache_1.ConfigCache.get(item.url)
                    : await load(item.url).then((res) => {
                        cache_1.ConfigCache.set(item.url, res, (0, env_flag_1.getRemoteSnippetCacheMaxage)());
                        return res;
                    });
                return {
                    main: (...args) => isSurgioSnippet
                        ? (0, exports.renderSurgioSnippet)(snippet, args)
                        : (0, exports.addProxyToSurgeRuleSet)(snippet, args[0]),
                    name: item.name,
                    url: item.url,
                    text: snippet, // 原始内容
                };
            }
        })();
    }, {
        concurrency: (0, env_flag_1.getNetworkConcurrency)(),
    });
};
exports.loadRemoteSnippetList = loadRemoteSnippetList;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVtb3RlLXNuaXBwZXQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9saWIvdXRpbHMvcmVtb3RlLXNuaXBwZXQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsd0RBQWdDO0FBQ2hDLG9EQUE0QjtBQUM1QiwyQ0FBd0M7QUFDeEMsb0VBQTJDO0FBQzNDLHdEQUFnQztBQUNoQyxvREFBeUQ7QUFHekQsbUNBQXNDO0FBQ3RDLHlDQUFnRjtBQUNoRixnRUFBdUM7QUFDdkMsbUNBQWdDO0FBQ2hDLDZDQUFnRDtBQUV6QyxNQUFNLFVBQVUsR0FBRyxDQUN4QixPQUFlLEVBSWYsRUFBRTtJQUNGLE1BQU0sS0FBSyxHQUFHLHVCQUF1QixDQUFDO0lBQ3RDLE1BQU0sS0FBSyxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7SUFFbEMsSUFBSSxDQUFDLEtBQUssRUFBRTtRQUNWLE1BQU0sSUFBSSxLQUFLLENBQUMsWUFBWSxDQUFDLENBQUM7S0FDL0I7SUFFRCxNQUFNLEdBQUcsR0FBRyxnQkFBTSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxXQUFXLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUN2RCxJQUFJLFNBQThDLENBQUM7SUFFbkQsS0FBSyxNQUFNLElBQUksSUFBSSxHQUFHLENBQUMsSUFBSSxFQUFFO1FBQzNCLElBQUksSUFBSSxDQUFDLElBQUksS0FBSyxxQkFBcUIsRUFBRTtZQUN2QyxTQUFTLEdBQUcsSUFBSSxDQUFDO1lBQ2pCLE1BQU07U0FDUDtLQUNGO0lBRUQsSUFDRSxDQUFDLFNBQVM7UUFDVixTQUFTLENBQUMsVUFBVSxDQUFDLElBQUksS0FBSyxnQkFBZ0I7UUFDOUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsSUFBSSxLQUFLLE1BQU0sRUFDM0M7UUFDQSxNQUFNLElBQUksS0FBSyxDQUFDLFlBQVksQ0FBQyxDQUFDO0tBQy9C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