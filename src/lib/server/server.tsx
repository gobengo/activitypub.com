import { render } from "@jaredpalmer/after";
import { Repeater } from "@repeaterjs/repeater";
import http from "http";
import Koa from "koa";
import helmet from "koa-helmet";
import koaMount from "koa-mount";
import Router from "koa-router";
import serve from "koa-static";
import * as path from "path";
import React from "react";
import * as WebSocket from "ws";
import { specOverSectionExampleConversation } from "../activitypub-examples/activitypubSpecExamples";
import ApiKoa, { IActivityPubEvent } from "../api/ApiKoa";
import ErrorRespondingKoaMiddleware from "../koa-middlewares/ErrorRespondingKoaMiddleware";
import RespondWithPreferredContentTypeKoaMiddleware from "../koa-middlewares/RespondWithPreferredContentTypeKoaMiddleware";
import App from "../react-app/App";
import {
  addWebSocketEventHandler,
  IWebSocketServerEventHandler,
  WebSocketServerEvent,
  WebSocketServerEventName,
} from "../ws-server-ts/WebSocketServerEventHandler";
import { createDispatchAndEvents, IDispatch } from "./events";

const assetManifestPath = process.env.RAZZLE_ASSETS_MANIFEST!;
const publicDir =
  process.env.RAZZLE_PUBLIC_DIR! || path.join(__dirname, "../public");

// Initialize `koa-router` and setup a route listening on `GET /*`
// Logic has been splitted into two chained middleware functions
// @see https://github.com/alexmingoia/koa-router#multiple-middleware
const router = new Router();
router.get("/*", async (ctx: Koa.Context, next) => {
  const markupFromAfterjs = await render({
    assets: assetManifestPath && require(assetManifestPath),
    req: ctx.req,
    res: ctx.res,
    ...App,
  });
  ctx.status = 200;
  ctx.body = markupFromAfterjs;
});

function ActivityPubComKoa(options: {
  dispatch: IDispatch<IActivityPubEvent>;
}) {
  // Intialize and configure Koa application
  const koa = new Koa()
    // `koa-helmet` provides security headers to help prevent common, well known attacks
    // @see https://helmetjs.github.io/
    .use(helmet())
    .use(ErrorRespondingKoaMiddleware())
    .use(RespondWithPreferredContentTypeKoaMiddleware())
    // Serve static files in publicDir
    .use(serve(publicDir))
    .use((ctx, next) => {
      return koaMount("/api", ApiKoa(options))(ctx, next);
    })
    .use(router.routes());
  // .use(router.allowedMethods());
  return koa;
}

function ActivityPubDotComWebSocketEventHandler(options: {
  events: AsyncGenerator<IActivityPubEvent>;
}): IWebSocketServerEventHandler {
  return {
    async handleEvent(webSocketEvent: WebSocketServerEvent) {
      if (!Array.isArray(webSocketEvent)) {
        console.warn("Got non-array event");
        return;
      }
      const [eventName, ...args] = webSocketEvent;
      switch (eventName) {
        case WebSocketServerEventName.connection:
          const [webSocket] = args;
          for await (const event of options.events) {
            if (event.type !== "ActivityPubInboxEvent") {
              continue;
            }
            webSocket.send(JSON.stringify(event.payload.object));
          }
          break;
        case WebSocketServerEventName.headers:
          break;
        case WebSocketServerEventName.listening:
          break;
        default:
          console.debug(`@TODO: handle WebSocketServer event: ${eventName}`);
      }
    },
  };
}

export interface IServerModule {
  install(server: http.Server): void;
  uninstall(server: http.Server): void;
}

export function ServerModule(): IServerModule {
  const { dispatch, events } = createDispatchAndEvents<IActivityPubEvent>();
  const requestListener = ActivityPubComKoa({
    dispatch,
    // events,
  }).callback();
  const webSocketServers = new WeakMap<
    http.Server,
    {
      webSocketServer: WebSocket.Server;
      eventHandler: IWebSocketServerEventHandler;
    }
  >();
  const install = (server: http.Server) => {
    server.on("request", requestListener);
    const webSocketServer = new WebSocket.Server({ server });
    const eventHandler = ActivityPubDotComWebSocketEventHandler({
      events,
    });
    addWebSocketEventHandler(webSocketServer, eventHandler);
    webSocketServers.set(server, {
      eventHandler,
      webSocketServer,
    });
  };
  const uninstall = (server: http.Server) => {
    const serverInfo = webSocketServers.get(server);
    if (serverInfo) {
      const { webSocketServer } = serverInfo;
      webSocketServer.close();
    } else {
      console.warn("Couldn't find webSocketServer for httpServer");
    }
    server.removeListener("request", requestListener);
  };
  return { install, uninstall };
}

if (module.hot) {
  module.hot.accept(["../api/ApiKoa"]);
}
