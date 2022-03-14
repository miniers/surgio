"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateConfig = exports.normalizeConfig = exports.loadConfig = void 0;
const joi_1 = __importDefault(require("joi"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const lodash_1 = __importDefault(require("lodash"));
const path_1 = __importDefault(require("path"));
const url_1 = require("url");
const util_1 = require("util");
const deprecation_1 = require("../misc/deprecation");
const constant_1 = require("../constant");
const flag_1 = require("./flag");
const index_1 = require("./index");
const showDEP005 = (0, util_1.deprecate)(lodash_1.default.noop, deprecation_1.DEP005, 'DEP005');
const showDEP006 = (0, util_1.deprecate)(lodash_1.default.noop, deprecation_1.DEP006, 'DEP006');
const showDEP008 = (0, util_1.deprecate)(lodash_1.default.noop, deprecation_1.DEP008, 'DEP008');
const loadConfig = (cwd, configPath, override) => {
    const absPath = path_1.default.resolve(cwd, configPath);
    if (!fs_extra_1.default.existsSync(absPath)) {
        throw new Error(`配置文件 ${absPath} 不存在`);
    }
    const userConfig = lodash_1.default.cloneDeep(require(absPath));
    (0, exports.validateConfig)(userConfig);
    if (userConfig.flags) {
        Object.keys(userConfig.flags).forEach((emoji) => {
            if (userConfig.flags) {
                if (typeof userConfig.flags[emoji] === 'string') {
                    (0, flag_1.addFlagMap)(userConfig.flags[emoji], emoji);
                }
                else if (lodash_1.default.isRegExp(userConfig.flags[emoji])) {
                    (0, flag_1.addFlagMap)(userConfig.flags[emoji], emoji);
                }
                else {
                    userConfig.flags[emoji].forEach((name) => {
                        (0, flag_1.addFlagMap)(name, emoji);
                    });
                }
            }
        });
    }
    if (override) {
        return Object.assign(Object.assign({}, (0, exports.normalizeConfig)(cwd, userConfig)), override);
    }
    return (0, exports.normalizeConfig)(cwd, userConfig);
};
exports.loadConfig = loadConfig;
const normalizeConfig = (cwd, userConfig) => {
    var _a, _b, _c;
    const defaultConfig = {
        artifacts: [],
        urlBase: '/',
        output: path_1.default.join(cwd, './dist'),
        templateDir: path_1.default.join(cwd, './template'),
        providerDir: path_1.default.join(cwd, './provider'),
        configDir: (0, index_1.ensureConfigFolder)(),
        surgeConfig: {
            shadowsocksFormat: 'ss',
            v2ray: 'native',
            resolveHostname: false,
            vmessAEAD: true,
        },
        clashConfig: {
            ssrFormat: 'native',
        },
        quantumultXConfig: {
            vmessAEAD: true,
        },
        proxyTestUrl: constant_1.PROXY_TEST_URL,
        proxyTestInterval: constant_1.PROXY_TEST_INTERVAL,
        checkHostname: false,
    };
    const config = lodash_1.default.defaultsDeep(userConfig, defaultConfig);
    // istanbul ignore next
    if (!fs_extra_1.default.existsSync(config.templateDir)) {
        throw new Error(`仓库内缺少 ${config.templateDir} 目录`);
    }
    // istanbul ignore next
    if (!fs_extra_1.default.existsSync(config.providerDir)) {
        throw new Error(`仓库内缺少 ${config.providerDir} 目录`);
    }
    if (/http/i.test(config.urlBase)) {
        const urlObject = new url_1.URL(config.urlBase);
        config.publicUrl = urlObject.origin + '/';
    }
    else {
        config.publicUrl = '/';
    }
    if (config.binPath && config.binPath.v2ray) {
        config.binPath.vmess = config.binPath.v2ray;
    }
    // istanbul ignore next
    if (((_a = config.surgeConfig) === null || _a === void 0 ? void 0 : _a.shadowsocksFormat) === 'custom') {
        showDEP005();
    }
    // istanbul ignore next
    if (((_b = config.surgeConfig) === null || _b === void 0 ? void 0 : _b.v2ray) === 'external') {
        showDEP006();
    }
    // istanbul ignore next
    if (((_c = config.clashConfig) === null || _c === void 0 ? void 0 : _c.ssrFormat) === 'legacy') {
        showDEP008();
    }
    return config;
};
exports.normalizeConfig = normalizeConfig;
const validateConfig = (userConfig) => {
    const artifactSchema = joi_1.default.object({
        name: joi_1.default.string().required(),
        categories: joi_1.default.array().items(joi_1.default.string()),
        template: joi_1.default.string().required(),
        provider: joi_1.default.string().required(),
        combineProviders: joi_1.default.array().items(joi_1.default.string()),
        customParams: joi_1.default.object(),
        proxyGroupModifier: joi_1.default.function(),
        destDir: joi_1.default.string(),
        downloadUrl: joi_1.default.string(),
    }).unknown();
    const remoteSnippetSchema = joi_1.default.object({
        url: joi_1.default.string()
            .uri({
            scheme: [/https?/],
        })
            .required(),
        name: joi_1.default.string().required(),
        surgioSnippet: joi_1.default.boolean().strict(),
    });
    const schema = joi_1.default.object({
        artifacts: joi_1.default.array().items(artifactSchema).required(),
        remoteSnippets: joi_1.default.array().items(remoteSnippetSchema),
        urlBase: joi_1.default.string(),
        upload: joi_1.default.object({
            prefix: joi_1.default.string(),
            region: joi_1.default.string(),
            endpoint: joi_1.default.string(),
            bucket: joi_1.default.string().required(),
            accessKeyId: joi_1.default.string().required(),
            accessKeySecret: joi_1.default.string().required(),
        }),
        binPath: joi_1.default.object({
            shadowsocksr: joi_1.default.string().pattern(/^\//),
            v2ray: joi_1.default.string().pattern(/^\//),
            vmess: joi_1.default.string().pattern(/^\//),
        }),
        flags: joi_1.default.object().pattern(joi_1.default.string(), [
            joi_1.default.string(),
            joi_1.default.object().regex(),
            joi_1.default.array().items(joi_1.default.string(), joi_1.default.object().regex()),
        ]),
        surgeConfig: joi_1.default.object({
            shadowsocksFormat: joi_1.default.string().valid('ss', 'custom'),
            v2ray: joi_1.default.string().valid('native', 'external'),
            resolveHostname: joi_1.default.boolean().strict(),
            vmessAEAD: joi_1.default.boolean().strict(),
        }).unknown(),
        quantumultXConfig: joi_1.default.object({
            vmessAEAD: joi_1.default.boolean().strict(),
        }).unknown(),
        clashConfig: joi_1.default.object({
            ssrFormat: joi_1.default.string().valid('native', 'legacy'),
        }).unknown(),
        analytics: joi_1.default.boolean().strict(),
        gateway: joi_1.default.object({
            accessToken: joi_1.default.string(),
            auth: joi_1.default.boolean().strict(),
            cookieMaxAge: joi_1.default.number(),
            useCacheOnError: joi_1.default.boolean().strict(),
        }).unknown(),
        proxyTestUrl: joi_1.default.string().uri({
            scheme: [/https?/],
        }),
        proxyTestInterval: joi_1.default.number(),
        customFilters: joi_1.default.object().pattern(joi_1.default.string(), joi_1.default.any().allow(joi_1.default.function(), joi_1.default.object({
            filter: joi_1.default.function(),
            supportSort: joi_1.default.boolean().strict(),
        }))),
        customParams: joi_1.default.object(),
    }).unknown();
    const { error } = schema.validate(userConfig);
    // istanbul ignore next
    if (error) {
        throw error;
    }
};
exports.validateConfig = validateConfig;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZmlnLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vbGliL3V0aWxzL2NvbmZpZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSw4Q0FBc0I7QUFDdEIsd0RBQTBCO0FBQzFCLG9EQUF1QjtBQUN2QixnREFBd0I7QUFDeEIsNkJBQTBCO0FBQzFCLCtCQUFpQztBQUNqQyxxREFBNkQ7QUFHN0QsMENBQWtFO0FBQ2xFLGlDQUFvQztBQUNwQyxtQ0FBNkM7QUFFN0MsTUFBTSxVQUFVLEdBQUcsSUFBQSxnQkFBUyxFQUFDLGdCQUFDLENBQUMsSUFBSSxFQUFFLG9CQUFNLEVBQUUsUUFBUSxDQUFDLENBQUM7QUFDdkQsTUFBTSxVQUFVLEdBQUcsSUFBQSxnQkFBUyxFQUFDLGdCQUFDLENBQUMsSUFBSSxFQUFFLG9CQUFNLEVBQUUsUUFBUSxDQUFDLENBQUM7QUFDdkQsTUFBTSxVQUFVLEdBQUcsSUFBQSxnQkFBUyxFQUFDLGdCQUFDLENBQUMsSUFBSSxFQUFFLG9CQUFNLEVBQUUsUUFBUSxDQUFDLENBQUM7QUFFaEQsTUFBTSxVQUFVLEdBQUcsQ0FDeEIsR0FBVyxFQUNYLFVBQWtCLEVBQ2xCLFFBQWlDLEVBQ2xCLEVBQUU7SUFDakIsTUFBTSxPQUFPLEdBQUcsY0FBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsVUFBVSxDQUFDLENBQUM7SUFFOUMsSUFBSSxDQUFDLGtCQUFFLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxFQUFFO1FBQzNCLE1BQU0sSUFBSSxLQUFLLENBQUMsUUFBUSxPQUFPLE1BQU0sQ0FBQyxDQUFDO0tBQ3hDO0lBRUQsTUFBTSxVQUFVLEdBQUcsZ0JBQUMsQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7SUFFakQsSUFBQSxzQkFBYyxFQUFDLFVBQVUsQ0FBQyxDQUFDO0lBRTNCLElBQUksVUFBVSxDQUFDLEtBQUssRUFBRTtRQUNwQixNQUFNLENBQUMsSUFBSSxD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