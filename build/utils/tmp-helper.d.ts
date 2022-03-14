export declare class TmpFile {
    filePath: string;
    maxAge?: number | undefined;
    filename: string;
    extname: string;
    constructor(filePath: string, maxAge?: number | undefined);
    setContent(content: string): Promise<this>;
    getContent(): Promise<string | undefined>;
    private validateContent;
}
export interface TmpContent {
    readonly content: string;
    readonly lastEditTime: number;
    readonly maxAge?: number;
}
export declare const createTmpFactory: (baseDir: string) => (filePath: string, maxAge?: number | undefined) => TmpFile;
