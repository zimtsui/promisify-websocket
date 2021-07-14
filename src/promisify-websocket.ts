import WebSocket from 'ws';

// default export cannot be augmented
// https://www.typescriptlang.org/docs/handbook/declaration-merging.html#module-augmentation
export interface PromisifiedWebsocket extends WebSocket {
    sendAsync(data: any): Promise<void>;
    pingAsync(): Promise<void>;
    pongAsync(): Promise<void>;
}

export function promisifyWebsocket(ws: WebSocket): PromisifiedWebsocket {
    const pws = <PromisifiedWebsocket>ws;

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
        return new Promise<void>((resolve, reject) => {
            this.once('error', reject);
            this.ping(() => {
                this.off('error', reject);
                resolve();
            });
        });
    }
    pws.pongAsync = function () {
        return new Promise<void>((resolve, reject) => {
            this.once('error', reject);
            this.pong(() => {
                this.off('error', reject);
                resolve();
            });
        });
    }
    return pws;
}
