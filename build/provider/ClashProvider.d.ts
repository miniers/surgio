import { ClashProviderConfig, HttpNodeConfig, HttpsNodeConfig, ShadowsocksNodeConfig, ShadowsocksrNodeConfig, SnellNodeConfig, SubscriptionUserinfo, TrojanNodeConfig, VmessNodeConfig } from '../types';
import Provider from './Provider';
declare type SupportConfigTypes = ShadowsocksNodeConfig | VmessNodeConfig | HttpsNodeConfig | HttpNodeConfig | ShadowsocksrNodeConfig | SnellNodeConfig | TrojanNodeConfig;
export default class ClashProvider extends Provider {
    readonly _url: string;
    readonly udpRelay?: boolean;
    readonly tls13?: boolean;
    constructor(name: string, config: ClashProviderConfig);
    get url(): string;
    getSubscriptionUserInfo(): Promise<SubscriptionUserinfo | undefined>;
    getNodeList(): Promise<ReadonlyArray<SupportConfigTypes>>;
}
export declare const getClashSubscription: (url: string, udpRelay?: boolean | undefined, tls13?: boolean | undefined) => Promise<{
    readonly nodeList: ReadonlyArray<SupportConfigTypes>;
    readonly subscriptionUserinfo?: SubscriptionUserinfo;
}>;
export declare const parseClashConfig: (proxyList: ReadonlyArray<any>, udpRelay?: boolean | undefined, tls13?: boolean | undefined) => ReadonlyArray<SupportConfigTypes>;
export {};
