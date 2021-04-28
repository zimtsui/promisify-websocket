import WebSocket from 'ws';
import Startable from 'startable';
import { once } from 'events';
import { Duplex } from 'stream';

class PassiveClose extends Error {
    constructor() {
        super('Passive close');
    }
}

interface Events {
    message: [WebSocket.Data];
    error: [Error];
}

interface PromisifiedWebSocket {
    on<Event extends keyof Events>(event: Event, listener: (...args: Events[Event]) => void): this;
    once<Event extends keyof Events>(event: Event, listener: (...args: Events[Event]) => void): this;
    off<Event extends keyof Events>(event: Event, listener: (...args: Events[Event]) => void): this;
}

class PromisifiedWebSocket extends Startable implements AsyncIterable<string> {
    private socket?: WebSocket;
    private url?: string;
    private stream?: Duplex;

    constructor(url: string);
    constructor(socket: WebSocket);
    constructor(arg: string | WebSocket) {
        super();
        if (typeof arg === 'string')
            this.url = arg;
        else {
            this.socket = arg;
            this.start();
        }
    }

    protected async _start() {
        if (this.url) this.socket = new WebSocket(this.url!);
        this.stream = WebSocket.createWebSocketStream(this.socket!);
        this.socket!.on('close', () => void this.stop(new PassiveClose()).catch(() => { }));
        this.socket!.on('message', message => void this.emit('message', message));
        this.socket!.on('error', err => void this.emit('error', err));
        if (this.url) await once(this.socket!, 'open');
    }

    protected async _stop() {
        if (this.socket!.readyState !== WebSocket.CLOSED) {
            this.socket!.close();
            await once(this.socket!, 'close');
        }
    }

    // 如果出错，send 回调可能不被调用
    public send = (message: string | ArrayBuffer): Promise<void> => {
        return new Promise((resolve, reject) => {
            const onError = (err: Error) => {
                this.off('error', onError);
                reject(err);
            }
            this.once('error', onError);
            this.socket!.send(message, () => {
                this.off('error', onError);
                resolve();
            });
        });
    }

    public [Symbol.asyncIterator] = () => this.stream![Symbol.asyncIterator]();
}

export {
    PromisifiedWebSocket as default,
    PromisifiedWebSocket,
    PassiveClose,
}
