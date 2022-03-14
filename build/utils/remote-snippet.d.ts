import { RemoteSnippet, RemoteSnippetConfig } from '../types';
export declare const parseMacro: (snippet: string) => {
    functionName: string;
    arguments: string[];
};
export declare const addProxyToSurgeRuleSet: (str: string, proxyName?: string | undefined) => string;
export declare const renderSurgioSnippet: (str: string, args: string[]) => string;
export declare const loadRemoteSnippetList: (remoteSnippetList: ReadonlyArray<RemoteSnippetConfig>, cacheSnippet?: boolean) => Promise<ReadonlyArray<RemoteSnippet>>;
