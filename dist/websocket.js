import WebSocket from 'ws';
import Startable from 'startable';
import { promisify } from 'util';
// 之所以自己写一个是因为 https://github.com/websockets/ws/issues/1795
// p-event 的声明文件写得有点问题，也不用
function once(ee, event) {
    return new Promise((resolve, reject) => {
        function onEvent() {
            ee.off(event, onEvent);
            ee.off('error', onError);
            resolve();
        }
        function onError(err) {
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
    constructor(urlOrSocket) {
        super();
        if (typeof urlOrSocket === 'string')
            this.url = urlOrSocket;
        else
            this.socket = urlOrSocket;
    }
    async _start() {
        this.socket = new WebSocket(this.url);
        // args
        this.socket.on('close', () => this.stop(new PassiveClose()));
        this.socket.on('message', message => void this.emit('message', message));
        this.socket.on('error', err => this.emit('error', err));
        await once(this.socket, 'open');
    }
    async _stop() {
        if (this.socket.readyState !== WebSocket.CLOSED) {
            this.socket.close();
            await once(this.socket, 'close');
        }
    }
    async send(message) {
        const sendAsync = promisify(this.socket.send.bind(this.socket));
        await sendAsync(message);
    }
}
export { PromisifiedWebSocket as default, PromisifiedWebSocket, PassiveClose, };
//# sourceMappingURL=websocket.js.map