function promisifyWebsocket(ws) {
    const pws = ws;
    // websocket payload is either text or binary.
    pws.sendAsync = function (data) {
        return new Promise((resolve, reject) => {
            this.once('error', reject);
            this.send(data, () => {
                this.off('error', reject);
                resolve();
            });
        });
    };
    pws.pingAsync = function () {
        return new Promise((resolve, reject) => {
            this.once('error', reject);
            this.ping(() => {
                this.off('error', reject);
                resolve();
            });
        });
    };
    pws.pongAsync = function () {
        return new Promise((resolve, reject) => {
            this.once('error', reject);
            this.pong(() => {
                this.off('error', reject);
                resolve();
            });
        });
    };
    return pws;
}
export { promisifyWebsocket as default, promisifyWebsocket, };
//# sourceMappingURL=promisify-websocket.js.map