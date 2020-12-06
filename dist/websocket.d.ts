import WebSocket from 'ws';
import Startable from 'startable';
declare class PassiveClose extends Error {
    constructor();
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
