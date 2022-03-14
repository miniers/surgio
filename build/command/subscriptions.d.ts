import Command from 'common-bin';
declare class SubscriptionsCommand extends Command {
    private config;
    constructor(rawArgv?: string[]);
    run(ctx: any): Promise<void>;
    get description(): string;
    errorHandler(err: any): void;
    private listProviders;
}
export = SubscriptionsCommand;
