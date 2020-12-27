# Promisified Websocket

当使用

```ts
interface PromisifiedWebsocketConstructor {
    new (websocket: WebSocket): PromisifiedWebsocket;
}
```

接口进行构造时，务必确保 websocket 状态为已连接。
