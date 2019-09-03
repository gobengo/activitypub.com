import { Repeater } from "@repeaterjs/repeater";
import { EventEmitter } from "events";

export type IDispatch<E> = (event: E) => Promise<void>;

export function createDispatchAndEvents<E>(): {
  events: AsyncIterable<E>;
  dispatch: IDispatch<E>;
} {
  const eventEmitter = new EventEmitter();
  const events = {
    [Symbol.asyncIterator]() {
      return new Repeater<E>(async (push, stop) => {
        eventEmitter.on("event", push);
        await stop;
        eventEmitter.off("event", push);
      });
    },
  };
  // eventsEcho.next();
  const dispatch: IDispatch<E> = async event => {
    eventEmitter.emit("event", event);
  };
  return { dispatch, events };
}
