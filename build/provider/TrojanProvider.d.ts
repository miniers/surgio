import { SubscriptionUserinfo, TrojanNodeConfig, TrojanProviderConfig } from '../types';
import Provider from './Provider';
export default class TrojanProvider extends Provider {
    readonly _url: string;
    readonly udpRelay?: boolean;
    readonly tls13?: boolean;
    constructor(name: string, config: TrojanProviderConfig);
    get url(): string;
    getSubscriptionUserInfo(): Promise<SubscriptionUserinfo | undefined>;
    getNodeList(): Promise<ReadonlyArray<TrojanNodeConfig>>;
}
/**
 * @see https://github.com/trojan-gfw/trojan-url/blob/master/trojan-url.py
 */
export declare const getTrojanSubscription: (url: string, udpRelay?: boolean | undefined, tls13?: boolean | undefined) => Promise<{
    readonly nodeList: ReadonlyArray<TrojanNodeConfig>;
    readonly subscriptionUserinfo?: SubscriptionUserinfo | undefined;
}>;
