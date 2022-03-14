import LRU from 'lru-cache';
import { SubscriptionUserinfo } from '../types';
export interface SubsciptionCacheItem {
    readonly body: string;
    subscriptionUserinfo?: SubscriptionUserinfo;
}
export declare const ConfigCache: LRU<string, string>;
export declare const SubscriptionCache: LRU<string, SubsciptionCacheItem>;
