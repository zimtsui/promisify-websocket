function promisifyWebsocket(socket) {
    const pws = socket;
    pws.sendAsync = function (...args) {
        return new Promise((resolve, reject) => {
            this.once('error', reject);
            this.send(args[0], args[1], () => {
                this.off('error', reject);
                resolve();
            });
        });
    };
    pws.pingAsync = function (...args) {
        return new Promise((resolve, reject) => {
            this.once('error', reject);
            this.ping(args[0], args[1], () => {
                this.off('error', reject);
                resolve();
            });
        });
    };
    pws.pongAsync = function (...args) {
        return new Promise((resolve, reject) => {
            this.once('error', reject);
            this.pong(args[0], args[1], () => {
                this.off('error', reject);
                resolve();
            });
        });
    };
    return pws;
}
export { promisifyWebsocket as default, promisifyWebsocket, };
//# sourceMappingURL=promisify-websocket.js.map