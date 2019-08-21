import { History, Location } from "history";
import { IncomingMessage, ServerResponse } from "http";

export interface IGetInitialPropsContext {
  req: IncomingMessage;
  res: ServerResponse;
  history: History;
  location: Location;
}
