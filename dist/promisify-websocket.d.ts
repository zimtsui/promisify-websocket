import WebSocket from 'ws';
interface PromisifiedWebsocket extends WebSocket {
    sendAsync(data: any): Promise<void>;
    pingAsync(): Promise<void>;
    pongAsync(): Promise<void>;
}
declare function promisifyWebsocket(ws: WebSocket): PromisifiedWebsocket;
export { promisifyWebsocket as default, promisifyWebsocket, PromisifiedWebsocket, };
