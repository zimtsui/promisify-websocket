import WebSocket = require('ws');
export interface PromisifiedWebsocket extends WebSocket {
    sendAsync(data: any): Promise<void>;
    pingAsync(): Promise<void>;
    pongAsync(): Promise<void>;
}
export declare function promisifyWebsocket(ws: WebSocket): PromisifiedWebsocket;
