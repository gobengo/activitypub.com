export declare enum ReadyStateEnum {
  Connecting = 0,
  Open = 1,
  Closing = 2,
  Closed = 3,
}
export interface Options {
  fromSocketIO?: boolean;
  share?: boolean;
  onOpen?: (event: Event) => void;
  onClose?: (event: Event) => void;
  onMessage?: (event: Event) => void;
  onError?: (event: Event) => void;
  filter?: (message: Message) => boolean;
  retryOnError?: boolean;
}
export declare type ReadyStateState = {
  [url: string]: ReadyStateEnum;
};
export declare type Message = {
  data: any;
};
export declare const useWebSocket: (
  url: string,
  options?: Options,
) => [(message: any) => void, Message, ReadyStateEnum];
