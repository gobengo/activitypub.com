import http from "http";
import WebSocket from "ws";

export enum WebSocketServerEventName {
  "connection" = "connection",
  "error" = "error",
  "headers" = "headers",
  "listening" = "listening",
}
type WebSocketServerConnectionEvent = [
  WebSocketServerEventName.connection,
  WebSocket.Server,
  WebSocket,
  http.IncomingMessage,
];
type WebSocketServerErrorEvent = [
  WebSocketServerEventName.error,
  WebSocket.Server,
  Error,
];
type WebSocketServerHeadersEvent = [
  WebSocketServerEventName.headers,
  WebSocket.Server,
  string[],
  http.IncomingMessage,
];
type WebSocketServerListeningEvent = [
  WebSocketServerEventName.listening,
  WebSocket.Server,
];
export type WebSocketServerEvent =
  | WebSocketServerConnectionEvent
  | WebSocketServerErrorEvent
  | WebSocketServerHeadersEvent
  | WebSocketServerListeningEvent;

export interface IWebSocketServerEventHandler {
  handleEvent(event: WebSocketServerEvent): void;
}

function eventHandlerToListener(
  eventName: WebSocketServerEventName,
  handler: IWebSocketServerEventHandler,
) {
  return function(this: WebSocket.Server, ...args: any) {
    // console.log('eventHandlerToListener', { _this: this, args, eventName });
    return handler.handleEvent([
      eventName,
      this,
      ...args,
    ] as WebSocketServerEvent);
  };
}

export function addWebSocketEventHandler(
  wss: WebSocket.Server,
  eventHandler: IWebSocketServerEventHandler,
) {
  for (const eventName of Object.keys(WebSocketServerEventName)) {
    wss.addListener(
      WebSocketServerEventName[eventName],
      eventHandlerToListener(WebSocketServerEventName[eventName], eventHandler),
    );
  }
  return wss;
}

/**
 * TODO: keep weakmap in eventHandlerToListener
 */
// export function removeWebSocketEventHandler(
//   wss: WebSocket.Server,
//   eventHandler: IWebSocketServerEventHandler,
// ) {
//   for (const eventName of Object.keys(WebSocketServerEventName)) {
//     wss.removeListener(eventName, eventHandler.handleEvent);
//   }
//   return wss;
// }
