"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Artifact = void 0;
const logger_1 = require("@surgio/logger");
const assert_1 = __importDefault(require("assert"));
const bluebird_1 = __importDefault(require("bluebird"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const lodash_1 = __importDefault(require("lodash"));
const path_1 = __importDefault(require("path"));
const events_1 = require("events");
const provider_1 = require("../provider");
const types_1 = require("../types");
const utils_1 = require("../utils");
const dns_1 = require("../utils/dns");
const env_flag_1 = require("../utils/env-flag");
const filter_1 = require("../utils/filter");
const flag_1 = require("../utils/flag");
const loon_1 = require("../utils/loon");
const template_1 = require("./template");
class Artifact extends events_1.EventEmitter {
    constructor(surgioConfig, artifact, options = {}) {
        super();
        this.surgioConfig = surgioConfig;
        this.artifact = artifact;
        this.options = options;
        this.initProgress = 0;
        this.nodeConfigListMap = new Map();
        this.providerMap = new Map();
        this.nodeList = [];
        this.nodeNameList = [];
        const { name: artifactName, template, templateString } = artifact;
        (0, assert_1.default)(artifactName, '必须指定 artifact 的 name 属性');
        (0, assert_1.default)(artifact.provider, '必须指定 artifact 的 provider 属性');
        if (!templateString) {
            (0, assert_1.default)(template, '必须指定 artifact 的 template 属性');
        }
        const mainProviderName = artifact.provider;
        const combineProviders = artifact.combineProviders || [];
        this.providerNameList = [mainProviderName].concat(combineProviders);
    }
    get isReady() {
        return this.initProgress === this.providerNameList.length;
    }
    getRenderContext(extendRenderContext = {}) {
        const config = this.surgioConfig;
        const gatewayConfig = config.gateway;
        const gatewayHasToken = !!(gatewayConfig === null || gatewayConfig === void 0 ? void 0 : gatewayConfig.accessToken);
        const { name: artifactName, customParams, downloadUrl } = this.artifact;
        const { nodeList, nodeNameList, netflixFilter, youtubePremiumFilter, customFilters, } = this;
        const remoteSnippets = lodash_1.default.keyBy(this.options.remoteSnippetList || [], (item) => item.name);
        const globalCustomParams = config.customParams;
        const mergedCustomParams = lodash_1.default.merge({}, globalCustomParams, customParams, extendRenderContext === null || extendRenderContext === void 0 ? void 0 : extendRenderContext.urlParams);
        return Object.assign({ proxyTestUrl: config.proxyTestUrl, downloadUrl: downloadUrl
                ? downloadUrl
                : (0, utils_1.getDownloadUrl)(config.urlBase, artifactName, true, gatewayHasToken ? gatewayConfig === null || gatewayConfig === void 0 ? void 0 : gatewayConfig.accessToken : undefined), snippet: (filePath) => {
                return (0, template_1.loadLocalSnippet)(config.templateDir, filePath);
            }, nodes: nodeList, names: nodeNameList, remoteSnippets,
            nodeList, provider: this.artifact.provider, providerName: this.artifact.provider, artifactName, getDownloadUrl: (name) => (0, utils_1.getDownloadUrl)(config.urlBase, name, true, gatewayHasToken ? gatewayConfig === null || gatewayConfig === void 0 ? void 0 : gatewayConfig.accessToken : undefined), getUrl: (p) => (0, utils_1.getUrl)(config.publicUrl, p, gatewayHasToken ? gatewayConfig === null || gatewayConfig === void 0 ? void 0 : gatewayConfig.accessToken : undefined), getNodeNames: utils_1.getNodeNames,
            getClashNodeNames: utils_1.getClashNodeNames,
            getClashNodes: utils_1.getClashNodes,
            getSurgeNodes: utils_1.getSurgeNodes,
            getSurgeExtend: utils_1.getSurgeExtend,
            getShadowsocksNodes: utils_1.getShadowsocksNodes,
            getShadowsocksNodesJSON: utils_1.getShadowsocksNodesJSON,
            getShadowsocksrNodes: utils_1.getShadowsocksrNodes,
            getQuantumultNodes: utils_1.getQuantumultNodes,
            getV2rayNNodes: utils_1.getV2rayNNodes,
            getQuantumultXNodes: utils_1.getQuantumultXNodes,
            getMellowNodes: utils_1.getMellowNodes,
            getLoonNodes: loon_1.getLoonNodes,
            usFilter: filter_1.usFilter,
            hkFilter: filter_1.hkFilter,
            japanFilter: filter_1.japanFilter,
            koreaFilter: filter_1.koreaFilter,
            singaporeFilter: filter_1.singaporeFilter,
            taiwanFilter: filter_1.taiwanFilter,
            chinaBackFilter: filter_1.chinaBackFilter,
            chinaOutFilter: filter_1.chinaOutFilter,
            shadowsocksFilter: filter_1.shadowsocksFilter,
            shadowsocksrFilter: filter_1.shadowsocksrFilter,
            vmessFilter: filter_1.vmessFilter,
            wireguardFilter: filter_1.wireguardFilter,
            v2rayFilter: filter_1.v2rayFilter,
            snellFilter: filter_1.snellFilter,
            httpFilter: filter_1.httpFilter,
            httpsFilter: filter_1.httpsFilter,
            trojanFilter: filter_1.trojanFilter,
            socks5Filter: filter_1.socks5Filter,
            toUrlSafeBase64: utils_1.toUrlSafeBase64,
            toBase64: utils_1.toBase64,
            encodeURIComponent,
            netflixFilter,
            youtubePremiumFilter,
            customFilters, customParams: mergedCustomParams }, (this.artifact.proxyGroupModifier
            ? {
                clashProxyConfig: {
                    proxies: (0, utils_1.getClashNodes)(nodeList),
                    'proxy-groups': (0, utils_1.normalizeClashProxyGroupConfig)(nodeList, Object.assign({ usFilter: filter_1.usFilter,
                        hkFilter: filter_1.hkFilter,
                        japanFilter: filter_1.japanFilter,
                        koreaFilter: filter_1.koreaFilter,
                        singaporeFilter: filter_1.singaporeFilter,
                        taiwanFilter: filter_1.taiwanFilter,
                        chinaBackFilter: filter_1.chinaBackFilter,
                        chinaOutFilter: filter_1.chinaOutFilter,
                        netflixFilter,
                        youtubePremiumFilter }, customFilters), this.artifact.proxyGroupModifier, {
                        proxyTestUrl: config.proxyTestUrl,
                        proxyTestInterval: config.proxyTestInterval,
                    }),
                },
            }
            : {}));
    }
    async init() {
        if (this.isReady) {
            throw new Error('Artifact 已经初始化完成');
        }
        this.emit('initArtifact:start', { artifact: this.artifact });
        await bluebird_1.default.map(this.providerNameList, this.providerMapper.bind(this), {
            concurrency: (0, env_flag_1.getNetworkConcurrency)(),
        });
        this.providerNameList.forEach((providerName) => {
            const nodeConfigList = this.nodeConfigListMap.get(providerName);
            if (nodeConfigList) {
                nodeConfigList.forEach((nodeConfig) => {
                    if (nodeConfig) {
                        this.nodeNameList.push({
                            type: nodeConfig.type,
                            enable: nodeConfig.enable,
                            nodeName: nodeConfig.nodeName,
                            provider: nodeConfig.provider,
                        });
                        this.nodeList.push(nodeConfig);
                    }
                });
            }
        });
        this.emit('initArtifact:end', { artifact: this.artifact });
        return this;
    }
    render(templateEngine, extendRenderContext) {
        if (!this.isReady) {
            throw new Error('Artifact 还未初始化');
        }
        const targetTemplateEngine = templateEngine || this.options.templateEngine;
        if (!targetTemplateEngine) {
            throw new Error('没有可用的 Nunjucks 环境');
        }
        const renderContext = this.getRenderContext(extendRenderContext);
        const { templateString, template } = this.artifact;
        const result = templateString
            ? targetTemplateEngine.renderString(templateString, Object.assign({ templateEngine: targetTemplateEngine }, renderContext))
            : targetTemplateEngine.render(`${template}.tpl`, Object.assign({ templateEngine: targetTemplateEngine }, renderContext));
        this.emit('renderArtifact', { artifact: this.artifact, result });
        return result;
    }
    async providerMapper(providerName) {
        const config = this.surgioConfig;
        const mainProviderName = this.artifact.provider;
        const filePath = path_1.default.resolve(config.providerDir, `${providerName}.js`);
        this.emit('initProvider:start', {
            artifact: this.artifact,
            providerName,
        });
        if (!fs_extra_1.default.existsSync(filePath)) {
            throw new Error(`文件 ${filePath} 不存在`);
        }
        let provider;
        let nodeConfigList;
        try {
            // eslint-disable-next-line prefer-const
            provider = await (0, provider_1.getProvider)(providerName, require(filePath));
            this.providerMap.set(providerName, provider);
        }
        catch (err) /* istanbul ignore next */ {
            err.message = `处理 ${providerName} 时出现错误，相关文件 ${filePath} ，错误原因: ${err.message}`;
            throw err;
        }
        try {
            nodeConfigList = await provider.getNodeList();
        }
        catch (err) /* istanbul ignore next */ {
            err.message = `获取 ${providerName} 节点时出现错误，相关文件 ${filePath} ，错误原因: ${err.message}`;
            throw err;
        }
        // Filter 仅使用第一个 Provider 中的定义
        if (providerName === mainProviderName) {
            if (!this.netflixFilter) {
                this.netflixFilter = provider.netflixFilter || filter_1.netflixFilter;
            }
            if (!this.youtubePremiumFilter) {
                this.youtubePremiumFilter =
                    provider.youtubePremiumFilter || filter_1.youtubePremiumFilter;
            }
            if (!this.customFilters) {
                this.customFilters = Object.assign(Object.assign({}, config.customFilters), provider.customFilters);
            }
        }
        if ((0, filter_1.validateFilter)(provider.nodeFilter) &&
            typeof provider.nodeFilter === 'object' &&
            provider.nodeFilter.supportSort) {
            nodeConfigList = provider.nodeFilter.filter(nodeConfigList);
        }
        nodeConfigList = (await bluebird_1.default.map(nodeConfigList, async (nodeConfig) => {
            var _a;
            let isValid = false;
            if (nodeConfig.enable === false) {
                return undefined;
            }
            if (!provider.nodeFilter) {
                isValid = true;
            }
            else if ((0, filter_1.validateFilter)(provider.nodeFilter)) {
                isValid =
                    typeof provider.nodeFilter === 'function'
                        ? provider.nodeFilter(nodeConfig)
                        : true;
            }
            if (isValid) {
                if (config.binPath && config.binPath[nodeConfig.type]) {
                    nodeConfig.binPath = config.binPath[nodeConfig.type];
                    nodeConfig.localPort = provider.nextPort;
                }
                nodeConfig.provider = provider;
                nodeConfig.surgeConfig = config.surgeConfig;
                nodeConfig.clashConfig = config.clashConfig;
                nodeConfig.quantumultXConfig = config.quantumultXConfig;
                if (provider.renameNode) {
                    const newName = provider.renameNode(nodeConfig.nodeName);
                    if (newName) {
                        nodeConfig.nodeName = newName;
                    }
                }
                if (provider.addFlag) {
                    // 给节点名加国旗
                    nodeConfig.nodeName = (0, flag_1.prependFlag)(nodeConfig.nodeName, provider.removeExistingFlag);
                }
                else if (provider.removeExistingFlag) {
                    // 去掉名称中的国旗
                    nodeConfig.nodeName = (0, flag_1.removeFlag)(nodeConfig.nodeName);
                }
                // TCP Fast Open
                if (provider.tfo) {
                    nodeConfig.tfo = provider.tfo;
                }
                // MPTCP
                if (provider.mptcp) {
                    nodeConfig.mptcp = provider.mptcp;
                }
                // check whether the hostname resolves in case of blocking clash's node heurestic
                if ((config === null || config === void 0 ? void 0 : config.checkHostname) && !(0, utils_1.isIp)(nodeConfig.hostname)) {
                    try {
                        const domains = await (0, dns_1.resolveDomain)(nodeConfig.hostname);
                        if (domains.length < 1) {
                            logger_1.logger.warn(`DNS 解析结果中 ${nodeConfig.hostname} 未有对应 IP 地址，将忽略该节点`);
                            return undefined;
                        }
                    }
                    catch (err) /* istanbul ignore next */ {
                        logger_1.logger.warn(`${nodeConfig.hostname} 无法解析，将忽略该节点`);
                        return undefined;
                    }
                }
                if (((_a = config === null || config === void 0 ? void 0 : config.surgeConfig) === null || _a === void 0 ? void 0 : _a.resolveHostname) &&
                    !(0, utils_1.isIp)(nodeConfig.hostname) &&
                    [types_1.NodeTypeEnum.Vmess, types_1.NodeTypeEnum.Shadowsocksr].includes(nodeConfig.type)) {
                    try {
                        nodeConfig.hostnameIp = await (0, dns_1.resolveDomain)(nodeConfig.hostname);
                    }
                    catch (err) /* istanbul ignore next */ {
                        logger_1.logger.warn(`${nodeConfig.hostname} 无法解析，将忽略该域名的解析结果`);
                    }
                }
                return nodeConfig;
            }
            return undefined;
        })).filter((item) => item !== undefined);
        this.nodeConfigListMap.set(providerName, nodeConfigList);
        this.initProgress++;
        this.emit('initProvider:end', {
            artifact: this.artifact,
            providerName,
            provider,
        });
    }
}
exports.Artifact = Artifact;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXJ0aWZhY3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9saWIvZ2VuZXJhdG9yL2FydGlmYWN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLDJDQUF3QztBQUN4QyxvREFBNEI7QUFDNUIsd0RBQWdDO0FBQ2hDLHdEQUEwQjtBQUMxQixvREFBdUI7QUFFdkIsZ0RBQXdCO0FBQ3hCLG1DQUFzQztBQUV0QywwQ0FBMEM7QUFDMUMsb0NBUWtCO0FBQ2xCLG9DQW1Ca0I7QUFDbEIsc0NBQTZDO0FBQzdDLGdEQUEwRDtBQUMxRCw0Q0FzQnlCO0FBQ3pCLHdDQUF3RDtBQUN4RCx3Q0FBNkM7QUFDN0MseUNBQThDO0FBYTlDLE1BQWEsUUFBUyxTQUFRLHFCQUFZO0lBaUJ4QyxZQUNTLFlBQTJCLEVBQzNCLFFBQXdCLEVBQ3ZCLFVBQTJCLEVBQUU7UUFFckMsS0FBSyxFQUFFLENBQUM7UUFKRCxpQkFBWSxHQUFaLFlBQVksQ0FBZTtRQUMzQixhQUFRLEdBQVIsUUFBUSxDQUFnQjtRQUN2QixZQUFPLEdBQVAsT0FBTyxDQUFzQjtRQW5CaEMsaUJBQVksR0FBRyxDQUFDLENBQUM7UUFHakIsc0JBQWlCLEdBQ3RCLElBQUksR0FBRyxFQUFFLENBQUM7UUFDTCxnQkFBVyxHQUNoQixJQUFJLEdBQUcsRUFBRSxDQUFDO1FBQ0wsYUFBUSxHQUE2QixFQUFFLENBQUM7UUFDeEMsaUJBQVksR0FBdUIsRUFBRSxDQUFDO1FBZTNDLE1BQU0sRUFBRSxJQUFJLEVBQUUsWUFBWSxFQUFFLFFBQVEsRUFBRSxjQUFjLEVBQUUsR0FBRyxRQUFRLENBQUM7UUFFbEUsSUFBQSxnQkFBTSxFQUFDLFlBQVksRUFBRSx5QkFBeUIsQ0FBQyxDQUFDO1FBQ2hELElBQUEsZ0JBQU0sRUFBQyxRQUFRLENBQUMsUUFBUSxFQUFFLDZCQUE2QixDQUFDLENBQUM7UUFDekQsSUFBSSxDQUFDLGNBQWMsRUFBRTtZQUNuQixJQUFBLGdCQUFNLEVBQUMsUUFBUSxF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