import nunjucks from 'nunjucks';
import { RemoteSnippet } from '../types';
export declare function getEngine(templateDir: string): nunjucks.Environment;
export declare const convertSurgeScriptRuleToQuantumultXRewriteRule: (str: string) => string;
export declare const convertNewSurgeScriptRuleToQuantumultXRewriteRule: (str: string) => string;
export declare const loadLocalSnippet: (cwd: string, relativeFilePath?: string | undefined) => RemoteSnippet;
