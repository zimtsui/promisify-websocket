import WebSocket from 'ws';
interface PWebsocket extends WebSocket {
    sendAsync(...args: Parameters<WebSocket['send']>): Promise<void>;
    pingAsync(...args: Parameters<WebSocket['ping']>): Promise<void>;
    pongAsync(...args: Parameters<WebSocket['pong']>): Promise<void>;
}
declare function promisifyWebsocket(socket: WebSocket): PWebsocket;
export { promisifyWebsocket as default, promisifyWebsocket, PWebsocket, };
