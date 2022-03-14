import { ShadowsocksrNodeConfig } from '../types';
/**
 * 协议：https://github.com/shadowsocksr-backup/shadowsocks-rss/wiki/SSR-QRcode-scheme
 * ssr://xxx:xxx:xxx:xxx:xxx:xxx/?a=1&b=2
 * ssr://xxx:xxx:xxx:xxx:xxx:xxx
 */
export declare const parseSSRUri: (str: string) => ShadowsocksrNodeConfig;
