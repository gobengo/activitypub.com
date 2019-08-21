import { Options } from "./use-websocket";
export declare const useSocketIO: (
  url: string,
  options?: Options,
) => (
  | import("./use-websocket").ReadyStateEnum
  | ((message: any) => void)
  | {
      type: any;
      payload: any;
    })[];
