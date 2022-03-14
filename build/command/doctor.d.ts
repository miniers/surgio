import Command from 'common-bin';
declare class DoctorCommand extends Command {
    constructor(rawArgv?: string[]);
    run(ctx: any): Promise<void>;
    get description(): string;
    errorHandler(err: any): void;
    static generateDoctorInfo(cwd: string): Promise<ReadonlyArray<string>>;
}
export = DoctorCommand;
