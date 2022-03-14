import { ShadowsocksJsonSubscribeProviderConfig } from '../types';
import { getShadowsocksJSONConfig } from '../utils';
import Provider from './Provider';
export default class ShadowsocksJsonSubscribeProvider extends Provider {
    readonly udpRelay?: boolean;
    private readonly _url;
    constructor(name: string, config: ShadowsocksJsonSubscribeProviderConfig);
    get url(): string;
    getNodeList(): ReturnType<typeof getShadowsocksJSONConfig>;
}
