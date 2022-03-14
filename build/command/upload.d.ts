import Command from 'common-bin';
declare class GenerateCommand extends Command {
    private readonly spinner;
    constructor(rawArgv?: string[]);
    run(ctx: any): Promise<void>;
    get description(): string;
    errorHandler(err: any): void;
}
export = GenerateCommand;
