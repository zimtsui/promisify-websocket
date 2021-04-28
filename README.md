# Promisified Websocket

WebSocket 的 send 等方法的回调，在发送失败时不保证调用，所以不能直接 promisify。

ws 库的 WebSocket 类是 default export，不能 augment 其类型，因此无法直接给 WebSocket 类添加 sendAsync 等方法。

[https://github.com/microsoft/TypeScript/issues/14080](https://github.com/microsoft/TypeScript/issues/14080)
