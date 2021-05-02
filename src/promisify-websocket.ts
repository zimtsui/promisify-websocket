import WebSocket from 'ws';

interface PromisifiedWebsocket extends WebSocket {
    sendAsync(data: any): Promise<void>;
    pingAsync(): Promise<void>;
    pongAsync(): Promise<void>;
}

function promisifyWebsocket(ws: WebSocket): PromisifiedWebsocket {
    const pws = ws as PromisifiedWebsocket;

    // websocket payload is either text or binary.
    pws.sendAsync = function (data: string | ArrayBuffer) {
        return new Promise<void>((resolve, reject) => {
            this.once('error', reject);
            this.send(data, () => {
                this.off('error', reject);
                resolve();
            });
        });
    }
    pws.pingAsync = function () {
        return new Promise((resolve, reject) => {
            this.once('error', reject);
            this.ping(() => {
                this.off('error', reject);
                resolve();
            });
        });
    }
    pws.pongAsync = function () {
        return new Promise((resolve, reject) => {
            this.once('error', reject);
            this.pong(() => {
                this.off('error', reject);
                resolve();
            });
        });
    }
    return pws;
}

export {
    promisifyWebsocket as default,
    promisifyWebsocket,
    PromisifiedWebsocket,
}
