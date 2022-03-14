import Command from 'common-bin';
declare class GenerateCommand extends Command {
    constructor(rawArgv?: string[]);
    run(ctx: any): Promise<void>;
    get description(): string;
    errorHandler(err: any): void;
}
export = GenerateCommand;
