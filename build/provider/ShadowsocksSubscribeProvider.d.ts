import { ShadowsocksNodeConfig, ShadowsocksSubscribeProviderConfig, SubscriptionUserinfo } from '../types';
import Provider from './Provider';
export default class ShadowsocksSubscribeProvider extends Provider {
    readonly udpRelay?: boolean;
    private readonly _url;
    constructor(name: string, config: ShadowsocksSubscribeProviderConfig);
    get url(): string;
    getSubscriptionUserInfo(): Promise<SubscriptionUserinfo | undefined>;
    getNodeList(): Promise<ReadonlyArray<ShadowsocksNodeConfig>>;
}
/**
 * @see https://shadowsocks.org/en/spec/SIP002-URI-Scheme.html
 */
export declare const getShadowsocksSubscription: (url: string, udpRelay?: boolean | undefined) => Promise<{
    readonly nodeList: ReadonlyArray<ShadowsocksNodeConfig>;
    readonly subscriptionUserinfo?: SubscriptionUserinfo | undefined;
}>;
