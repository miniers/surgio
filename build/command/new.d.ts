import Command, { Context } from 'common-bin';
declare class NewCommand extends Command {
    constructor(rawArgv?: string[]);
    get description(): string;
    run(ctx: Context): Promise<void>;
}
export = NewCommand;
