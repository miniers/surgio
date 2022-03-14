import { RecordWithTtl } from 'dns';
export declare const resolveDomain: (domain: string, timeout?: number) => Promise<ReadonlyArray<string>>;
export declare const resolve4And6: (domain: string) => Promise<ReadonlyArray<RecordWithTtl>>;
