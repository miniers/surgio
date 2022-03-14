import { ShadowsocksNodeConfig, V2rayNSubscribeProviderConfig, VmessNodeConfig } from '../types';
import Provider from './Provider';
export default class V2rayNSubscribeProvider extends Provider {
    readonly compatibleMode?: boolean;
    readonly skipCertVerify?: boolean;
    readonly udpRelay?: boolean;
    readonly tls13?: boolean;
    private readonly _url;
    constructor(name: string, config: V2rayNSubscribeProviderConfig);
    get url(): string;
    getNodeList(): ReturnType<typeof getV2rayNSubscription>;
}
/**
 * @see https://github.com/2dust/v2rayN/wiki/%E5%88%86%E4%BA%AB%E9%93%BE%E6%8E%A5%E6%A0%BC%E5%BC%8F%E8%AF%B4%E6%98%8E(ver-2)
 */
export declare const getV2rayNSubscription: (url: string, isCompatibleMode?: boolean | undefined, skipCertVerify?: boolean | undefined, udpRelay?: boolean | undefined, tls13?: boolean | undefined) => Promise<ReadonlyArray<VmessNodeConfig | ShadowsocksNodeConfig>>;
export declare const parseJSONConfig: (json: string, isCompatibleMode: boolean | undefined, skipCertVerify?: boolean | undefined, udpRelay?: boolean | undefined, tls13?: boolean | undefined) => VmessNodeConfig | undefined;
