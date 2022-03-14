import { ProviderConfig, SupportProviderEnum, PossibleNodeConfigType, SubscriptionUserinfo } from '../types';
import { SubsciptionCacheItem } from '../utils/cache';
export default class Provider {
    name: string;
    readonly type: SupportProviderEnum;
    readonly nodeFilter?: ProviderConfig['nodeFilter'];
    readonly netflixFilter?: ProviderConfig['netflixFilter'];
    readonly youtubePremiumFilter?: ProviderConfig['youtubePremiumFilter'];
    readonly customFilters?: ProviderConfig['customFilters'];
    readonly addFlag?: boolean;
    readonly removeExistingFlag?: boolean;
    readonly tfo?: boolean;
    readonly mptcp?: boolean;
    readonly renameNode?: ProviderConfig['renameNode'];
    readonly relayUrl?: boolean | string;
    supportGetSubscriptionUserInfo: boolean;
    startPort?: number;
    constructor(name: string, config: ProviderConfig);
    static requestCacheableResource(url: string, options?: {
        requestUserAgent?: string;
    }): Promise<SubsciptionCacheItem>;
    get nextPort(): number;
    getSubscriptionUserInfo(): Promise<SubscriptionUserinfo | undefined>;
    getNodeList(): Promise<ReadonlyArray<PossibleNodeConfigType>>;
}
