import WebSocket from 'ws';

interface PWebsocket extends WebSocket {
    sendAsync(...args: Parameters<WebSocket['send']>): Promise<void>;
    pingAsync(...args: Parameters<WebSocket['ping']>): Promise<void>;
    pongAsync(...args: Parameters<WebSocket['pong']>): Promise<void>;
}

function promisifyWebsocket(socket: WebSocket): PWebsocket {
    const pws = <PWebsocket><unknown>socket;
    pws.sendAsync = function (...args: Parameters<WebSocket['send']>) {
        return new Promise((resolve, reject) => {
            this.once('error', reject);
            this.send(args[0], args[1], () => {
                this.off('error', reject);
                resolve();
            });
        });
    }
    pws.pingAsync = function (...args: Parameters<WebSocket['ping']>) {
        return new Promise((resolve, reject) => {
            this.once('error', reject);
            this.ping(args[0], args[1], () => {
                this.off('error', reject);
                resolve();
            });
        });
    }
    pws.pongAsync = function (...args: Parameters<WebSocket['pong']>) {
        return new Promise((resolve, reject) => {
            this.once('error', reject);
            this.pong(args[0], args[1], () => {
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
    PWebsocket,
}
