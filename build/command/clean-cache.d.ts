import Command from 'common-bin';
declare class CleanCacheCommand extends Command {
    constructor(rawArgv?: string[]);
    get description(): string;
    run(): Promise<void>;
    errorHandler(err: any): void;
}
export = CleanCacheCommand;
