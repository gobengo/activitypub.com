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
  WebSocket,
  http.IncomingMessage,
];
type WebSocketServerErrorEvent = [
  WebSocketServerEventName.error,
  WebSocket,
  Error,
];
type WebSocketServerHeadersEvent = [
  WebSocketServerEventName.headers,
  WebSocket,
  string[],
  http.IncomingMessage,
];
type WebSocketServerListeningEvent = [
  WebSocketServerEventName.listening,
  WebSocket,
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
  return function(this: WebSocket, ...args: any) {
    return handler.handleEvent([eventName, ...args] as WebSocketServerEvent);
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
