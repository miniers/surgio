import { SubscriptionUserinfo } from '../types';
export declare const parseSubscriptionUserInfo: (str: string) => SubscriptionUserinfo;
export declare const parseSubscriptionNode: (dataString: string, expireString: string) => SubscriptionUserinfo | undefined;
export declare const formatSubscriptionUserInfo: (userInfo: SubscriptionUserinfo) => {
    readonly upload: string;
    readonly download: string;
    readonly used: string;
    readonly left: string;
    readonly total: string;
    readonly expire: string;
};
