import { CommandConfig } from '../types';
export declare const loadConfig: (cwd: string, configPath: string, override?: Partial<CommandConfig> | undefined) => CommandConfig;
export declare const normalizeConfig: (cwd: string, userConfig: Partial<CommandConfig>) => CommandConfig;
export declare const validateConfig: (userConfig: Partial<CommandConfig>) => void;
