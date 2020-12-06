import WebSocket from 'ws';
import Startable from 'startable';
import { promisify } from 'util';
import { EventEmitter } from 'events';

// 之所以自己写一个是因为 https://github.com/websockets/ws/issues/1795
// p-event 的声明文件写得有点问题，也不用
function once(ee: EventEmitter, event: string): Promise<void> {
    return new Promise((resolve, reject) => {
        function onEvent(): void {
            ee.off(event, onEvent);
            ee.off('error', onError);
            resolve();
        }
        function onError(err: Error): void {
            ee.off(event, onEvent);
            ee.off('error', onError);
            reject(err);
        }
        ee.on(event, onEvent);
        ee.on('error', onError);
    });
}

class PassiveClose extends Error {
    constructor() {
        super('Passive close');
    }
}

class PromisifiedWebSocket extends Startable {
    private socket?: WebSocket;
    private url?: string;

    constructor(url: string);
    constructor(socket: WebSocket);
    constructor(arg: any) {
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

    public async send(message: string | ArrayBuffer): Promise<void> {
        const sendAsync = promisify(this.socket!.send.bind(this.socket!));
        await sendAsync(message);
    }
}

export {
    PromisifiedWebSocket as default,
    PromisifiedWebSocket,
    PassiveClose,
}
