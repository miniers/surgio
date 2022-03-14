import Command from 'common-bin';
declare class CheckCommand extends Command {
    constructor(rawArgv?: string[]);
    run(ctx: any): Promise<void>;
    get description(): string;
    errorHandler(err: any): void;
    private getTasks;
}
export = CheckCommand;
