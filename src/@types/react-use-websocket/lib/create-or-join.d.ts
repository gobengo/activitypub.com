import { ReadyStateState, Options } from "./use-websocket";

export declare const createOrJoinSocket: (
  webSocketRef: any,
  url: string,
  setReadyState: (callback: (prev: ReadyStateState) => ReadyStateState) => void,
  options: Options,
) => void;
