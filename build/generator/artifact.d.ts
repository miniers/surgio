/// <reference types="node" />
import { Environment } from 'nunjucks';
import { EventEmitter } from 'events';
import { getProvider } from '../provider';
import { ArtifactConfig, CommandConfig, PossibleNodeConfigType, RemoteSnippet, SimpleNodeConfig } from '../types';
declare type ThenArg<T> = T extends PromiseLike<infer U> ? U : T;
export interface ArtifactOptions {
    readonly remoteSnippetList?: ReadonlyArray<RemoteSnippet>;
    readonly templateEngine?: Environment;
}
export interface ExtendableRenderContext {
    readonly urlParams?: Record<string, string>;
}
export declare class Artifact extends EventEmitter {
    surgioConfig: CommandConfig;
    artifact: ArtifactConfig;
    private options;
    initProgress: number;
    providerNameList: ReadonlyArray<string>;
    nodeConfigListMap: Map<string, ReadonlyArray<PossibleNodeConfigType>>;
    providerMap: Map<string, ThenArg<ReturnType<typeof getProvider>>>;
    nodeList: PossibleNodeConfigType[];
    nodeNameList: SimpleNodeConfig[];
    private customFilters;
    private netflixFilter;
    private youtubePremiumFilter;
    constructor(surgioConfig: CommandConfig, artifact: ArtifactConfig, options?: ArtifactOptions);
    get isReady(): boolean;
    getRenderContext(extendRenderContext?: ExtendableRenderContext): any;
    init(): Promise<this>;
    render(templateEngine?: Environment, extendRenderContext?: ExtendableRenderContext): string;
    private providerMapper;
}
export {};
