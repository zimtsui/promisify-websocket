import WebSocket from 'ws';
import Startable from 'startable';
declare class PassiveClose extends Error {
    constructor();
}
interface PromisifiedWebSocket {
    on(event: 'message', listener: (message: WebSocket.Data) => void): this;
    off(event: 'message', listener: (message: WebSocket.Data) => void): this;
    once(event: 'message', listener: (message: WebSocket.Data) => void): this;
    on(event: 'error', listener: (error: Error) => void): this;
    off(event: 'error', listener: (error: Error) => void): this;
    once(event: 'error', listener: (error: Error) => void): this;
}
declare class PromisifiedWebSocket extends Startable {
    private socket?;
    private url?;
    constructor(url: string);
    constructor(socket: WebSocket);
    protected _start(): Promise<void>;
    protected _stop(): Promise<void>;
    send(message: string | ArrayBuffer): Promise<void>;
}
export { PromisifiedWebSocket as default, PromisifiedWebSocket, PassiveClose, };
