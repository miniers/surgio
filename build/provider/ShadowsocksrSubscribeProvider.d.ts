import { ShadowsocksrNodeConfig, ShadowsocksrSubscribeProviderConfig, SubscriptionUserinfo } from '../types';
import Provider from './Provider';
export default class ShadowsocksrSubscribeProvider extends Provider {
    readonly udpRelay?: boolean;
    private readonly _url;
    constructor(name: string, config: ShadowsocksrSubscribeProviderConfig);
    get url(): string;
    getSubscriptionUserInfo(): Promise<SubscriptionUserinfo | undefined>;
    getNodeList(): Promise<ReadonlyArray<ShadowsocksrNodeConfig>>;
}
export declare const getShadowsocksrSubscription: (url: string, udpRelay?: boolean | undefined) => Promise<{
    readonly nodeList: ReadonlyArray<ShadowsocksrNodeConfig>;
    readonly subscriptionUserinfo?: SubscriptionUserinfo | undefined;
}>;
