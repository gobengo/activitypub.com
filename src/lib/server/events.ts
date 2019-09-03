import { Repeater } from "@repeaterjs/repeater";

export type IDispatch<E> = (event: E) => Promise<void>;

export function createDispatchAndEvents<E>(): {
  events: AsyncGenerator<E>;
  dispatch: IDispatch<E>;
} {
  let push = async (event: E) => {
    return;
  };
  const events = new Repeater<E>(async (_push, stop) => {
    push = _push;
  });
  // eventsEcho.next();
  const dispatch: IDispatch<E> = async event => {
    const pushResult = await push(event);
    console.log("pushResult", pushResult);
  };
  return { dispatch, events };
}
