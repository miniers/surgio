import { Environment } from 'nunjucks';
import { ArtifactConfig, CommandConfig, RemoteSnippet } from './types';
export declare function generate(config: CommandConfig, artifact: ArtifactConfig, remoteSnippetList: ReadonlyArray<RemoteSnippet>, templateEngine: Environment): Promise<string>;
export default function (config: CommandConfig, skipFail?: boolean, cacheSnippet?: boolean): Promise<void>;
