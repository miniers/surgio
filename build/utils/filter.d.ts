import { NodeNameFilterType, SimpleNodeConfig, SortedNodeNameFilterType } from '../types';
export declare class SortFilterWithSortedFilters implements SortedNodeNameFilterType {
    _filters: ReadonlyArray<NodeNameFilterType>;
    supportSort: boolean;
    constructor(_filters: ReadonlyArray<NodeNameFilterType>);
    filter<T>(nodeList: ReadonlyArray<T & SimpleNodeConfig>): ReadonlyArray<T & SimpleNodeConfig>;
}
export declare class SortFilterWithSortedKeywords implements SortedNodeNameFilterType {
    _keywords: ReadonlyArray<string>;
    supportSort: boolean;
    constructor(_keywords: ReadonlyArray<string>);
    filter<T>(nodeList: ReadonlyArray<T & SimpleNodeConfig>): ReadonlyArray<T & SimpleNodeConfig>;
}
export declare const validateFilter: (filter: any) => boolean;
export declare const mergeFilters: (filters: ReadonlyArray<NodeNameFilterType>, isStrict?: boolean | undefined) => NodeNameFilterType;
export declare const useKeywords: (keywords: ReadonlyArray<string>, isStrict?: boolean | undefined) => NodeNameFilterType;
export declare const discardKeywords: (keywords: ReadonlyArray<string>, isStrict?: boolean | undefined) => NodeNameFilterType;
export declare const useRegexp: (regexp: RegExp) => NodeNameFilterType;
export declare const useProviders: (keywords: ReadonlyArray<string>, isStrict?: boolean) => NodeNameFilterType;
export declare const discardProviders: (keywords: ReadonlyArray<string>, isStrict?: boolean) => NodeNameFilterType;
export declare const useSortedKeywords: (keywords: ReadonlyArray<string>) => SortedNodeNameFilterType;
export declare const mergeSortedFilters: (filters: ReadonlyArray<NodeNameFilterType>) => SortedNodeNameFilterType;
export declare const netflixFilter: NodeNameFilterType;
export declare const usFilter: NodeNameFilterType;
export declare const hkFilter: NodeNameFilterType;
export declare const japanFilter: NodeNameFilterType;
export declare const koreaFilter: NodeNameFilterType;
export declare const singaporeFilter: NodeNameFilterType;
export declare const taiwanFilter: NodeNameFilterType;
export declare const chinaBackFilter: NodeNameFilterType;
export declare const chinaOutFilter: NodeNameFilterType;
export declare const youtubePremiumFilter: NodeNameFilterType;
export declare const shadowsocksFilter: NodeNameFilterType;
export declare const shadowsocksrFilter: NodeNameFilterType;
export declare const vmessFilter: NodeNameFilterType;
export declare const v2rayFilter: NodeNameFilterType;
export declare const wireguardFilter: NodeNameFilterType;
export declare const snellFilter: NodeNameFilterType;
export declare const httpFilter: NodeNameFilterType;
export declare const httpsFilter: NodeNameFilterType;
export declare const trojanFilter: NodeNameFilterType;
export declare const socks5Filter: NodeNameFilterType;
