import { JsonObject } from 'type-fest';
import { HttpsNodeConfig, NodeFilterType, NodeNameFilterType, PlainObjectOf, PossibleNodeConfigType, ProxyGroupModifier, ShadowsocksNodeConfig, ShadowsocksrNodeConfig, SimpleNodeConfig, SortedNodeNameFilterType, VmessNodeConfig } from '../types';
export declare const getDownloadUrl: (baseUrl: string | undefined, artifactName: string, inline?: boolean, accessToken?: string | undefined) => string;
export declare const getUrl: (baseUrl: string, path: string, accessToken?: string | undefined) => string;
export declare const getShadowsocksJSONConfig: (url: string, udpRelay?: boolean | undefined) => Promise<ReadonlyArray<ShadowsocksNodeConfig>>;
/**
 * @see https://manual.nssurge.com/policy/proxy.html
 */
export declare const getSurgeNodes: (list: ReadonlyArray<PossibleNodeConfigType>, filter?: NodeFilterType | SortedNodeNameFilterType | undefined) => string;
export declare const getSurgeExtend: (list: ReadonlyArray<PossibleNodeConfigType>, filter?: NodeFilterType | SortedNodeNameFilterType | undefined) => string;
export declare const getClashNodes: (list: ReadonlyArray<PossibleNodeConfigType>, filter?: NodeFilterType | SortedNodeNameFilterType | undefined) => ReadonlyArray<any>;
export declare const getMellowNodes: (list: ReadonlyArray<VmessNodeConfig | ShadowsocksNodeConfig>, filter?: NodeFilterType | SortedNodeNameFilterType | undefined) => string;
export declare const toUrlSafeBase64: (str: string) => string;
export declare const fromUrlSafeBase64: (str: string) => string;
export declare const toBase64: (str: string) => string;
export declare const fromBase64: (str: string) => string;
/**
 * @see https://github.com/shadowsocks/shadowsocks-org/wiki/SIP002-URI-Scheme
 */
export declare const getShadowsocksNodes: (list: ReadonlyArray<ShadowsocksNodeConfig>, groupName?: string) => string;
export declare const getShadowsocksrNodes: (list: ReadonlyArray<ShadowsocksrNodeConfig>, groupName: string) => string;
export declare const getV2rayNNodes: (list: ReadonlyArray<VmessNodeConfig>) => string;
export declare const getQuantumultNodes: (list: ReadonlyArray<ShadowsocksNodeConfig | VmessNodeConfig | ShadowsocksrNodeConfig | HttpsNodeConfig>, groupName?: string, filter?: SortedNodeNameFilterType | NodeNameFilterType | undefined) => string;
/**
 * @see https://github.com/crossutility/Quantumult-X/blob/master/sample.conf
 */
export declare const getQuantumultXNodes: (list: ReadonlyArray<PossibleNodeConfigType>, filter?: SortedNodeNameFilterType | NodeNameFilterType | undefined) => string;
export declare const getShadowsocksNodesJSON: (list: ReadonlyArray<ShadowsocksNodeConfig>) => string;
export declare const getNodeNames: (list: ReadonlyArray<SimpleNodeConfig>, filter?: SortedNodeNameFilterType | NodeNameFilterType | undefined, separator?: string | undefined) => string;
export declare const getClashNodeNames: (list: ReadonlyArray<SimpleNodeConfig>, filter?: SortedNodeNameFilterType | NodeNameFilterType | undefined, existingProxies?: readonly string[] | undefined) => ReadonlyArray<string>;
export declare const generateClashProxyGroup: (ruleName: string, ruleType: 'select' | 'url-test' | 'fallback' | 'load-balance', nodeNameList: ReadonlyArray<SimpleNodeConfig>, options: {
    readonly filter?: NodeNameFilterType | SortedNodeNameFilterType;
    readonly existingProxies?: ReadonlyArray<string>;
    readonly proxyTestUrl?: string;
    readonly proxyTestInterval?: number;
}) => {
    readonly type: string;
    readonly name: string;
    readonly proxies: readonly string[];
    readonly url?: string | undefined;
    readonly interval?: number | undefined;
};
export declare const toYaml: (obj: JsonObject) => string;
export declare const pickAndFormatStringList: (obj: any, keyList: readonly string[]) => readonly string[];
export declare const decodeStringList: <T = Record<string, string | boolean>>(stringList: ReadonlyArray<string>) => T;
export declare const normalizeClashProxyGroupConfig: (nodeList: ReadonlyArray<PossibleNodeConfigType>, customFilters: PlainObjectOf<NodeNameFilterType | SortedNodeNameFilterType>, proxyGroupModifier: ProxyGroupModifier, options?: {
    readonly proxyTestUrl?: string;
    readonly proxyTestInterval?: number;
}) => ReadonlyArray<any>;
export declare const ensureConfigFolder: (dir?: string) => string;
export declare const formatV2rayConfig: (localPort: number, nodeConfig: VmessNodeConfig) => JsonObject;
export declare const applyFilter: <T extends SimpleNodeConfig>(nodeList: readonly T[], filter?: SortedNodeNameFilterType | NodeNameFilterType | undefined) => readonly T[];
export declare const lowercaseHeaderKeys: (headers: Record<string, string>) => Record<string, string>;
export declare const isIp: (str: string) => boolean;
export declare const isNow: () => boolean;
export declare const isVercel: () => boolean;
export declare const isHeroku: () => boolean;
export declare const isGitHubActions: () => boolean;
export declare const isGitLabCI: () => boolean;
export declare const isPkgBundle: () => boolean;
export declare const isRailway: () => boolean;
