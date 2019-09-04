import { History, Location } from "history";
import { IncomingMessage, ServerResponse } from "http";
import Koa from "koa";

export interface IGetInitialPropsContext {
  req: IncomingMessage;
  res: ServerResponse;
  history: History;
  location: Location;
}

export interface IKoaGetInitialPropsContext {
  req: Koa.Request;
  res: ServerResponse;
  history: History;
  location: Location;
}
