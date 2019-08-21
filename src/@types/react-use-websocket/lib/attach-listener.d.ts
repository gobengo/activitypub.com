import { Message, ReadyStateState, Options } from "./use-websocket";
export interface Setters {
  setLastMessage: (message: Message) => void;
  setReadyState: (callback: (prev: ReadyStateState) => ReadyStateState) => void;
}
export declare const attachListeners: (
  webSocketInstance: any,
  url: string,
  setters: Setters,
  options: Options,
  retry: () => void,
  retryCount: any,
) => () => void;
