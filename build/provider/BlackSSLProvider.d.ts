import { BlackSSLProviderConfig, HttpsNodeConfig, SubscriptionUserinfo } from '../types';
import Provider from './Provider';
export default class BlackSSLProvider extends Provider {
    readonly username: string;
    readonly password: string;
    constructor(name: string, config: BlackSSLProviderConfig);
    getSubscriptionUserInfo(): Promise<SubscriptionUserinfo | undefined>;
    getNodeList(): Promise<ReadonlyArray<HttpsNodeConfig>>;
    private getBlackSSLConfig;
}
