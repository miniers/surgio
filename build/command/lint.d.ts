import Command from 'common-bin';
declare class LintCommand extends Command {
    constructor(rawArgv?: string[]);
    get description(): string;
    run(ctx: any): Promise<void>;
}
export = LintCommand;
