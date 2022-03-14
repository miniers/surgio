import { ESLint } from 'eslint';
export declare const createCli: (cliConfig?: ESLint.Options | undefined) => ESLint;
export declare const checkAndFix: (cwd: string) => Promise<boolean>;
export declare const check: (cwd: string) => Promise<boolean>;
