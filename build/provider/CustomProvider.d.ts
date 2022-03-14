import { CustomProviderConfig, PossibleNodeConfigType } from '../types';
import Provider from './Provider';
export default class CustomProvider extends Provider {
    readonly nodeList: ReadonlyArray<any>;
    constructor(name: string, config: CustomProviderConfig);
    getNodeList(): Promise<ReadonlyArray<PossibleNodeConfigType>>;
}
