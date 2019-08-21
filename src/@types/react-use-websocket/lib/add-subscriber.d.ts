import { Setters } from "./attach-listener";
import { Options } from "./use-websocket";
export declare const addSubscriber: (
  webSocketInstance: any,
  url: string,
  setters: Setters,
  options?: Options,
) => () => void;
