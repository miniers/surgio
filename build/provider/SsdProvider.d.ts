import { ShadowsocksNodeConfig, SsdProviderConfig, SubscriptionUserinfo } from '../types';
import Provider from './Provider';
export default class SsdProvider extends Provider {
    readonly _url: string;
    readonly udpRelay?: boolean;
    constructor(name: string, config: SsdProviderConfig);
    get url(): string;
    getSubscriptionUserInfo(): Promise<SubscriptionUserinfo | undefined>;
    getNodeList(): Promise<ReadonlyArray<ShadowsocksNodeConfig>>;
}
export declare const getSsdSubscription: (url: string, udpRelay?: boolean | undefined) => Promise<{
    readonly nodeList: ReadonlyArray<ShadowsocksNodeConfig>;
    readonly subscriptionUserinfo?: SubscriptionUserinfo | undefined;
}>;
export declare const parseSsdConfig: (globalConfig: SsdSubscription, server: SsdServer, udpRelay?: boolean | undefined) => ShadowsocksNodeConfig | undefined;
export interface SsdSubscription {
    airport: string;
    port: number;
    encryption: string;
    password: string;
    servers: ReadonlyArray<SsdServer>;
    plugin?: string;
    plugin_options?: string;
    traffic_used?: number;
    traffic_total?: number;
    expiry?: string;
}
export interface SsdServer {
    server: string;
    port?: number;
    encryption?: string;
    password?: string;
    plugin?: string;
    plugin_options?: string;
    id?: number;
    remarks?: string;
    ratio?: number;
}
