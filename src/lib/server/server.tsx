import { render } from "@jaredpalmer/after";
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
import ApiKoa from "../api/ApiKoa";
import ErrorRespondingKoaMiddleware from "../koa-middlewares/ErrorRespondingKoaMiddleware";
import App from "../react-app/App";
import {
  addWebSocketEventHandler,
  IWebSocketServerEventHandler,
  WebSocketServerEvent,
  WebSocketServerEventName,
} from "../ws-server-ts/WebSocketServerEventHandler";

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

function ActivityPubComKoa() {
  // Intialize and configure Koa application
  const koa = new Koa()
    // `koa-helmet` provides security headers to help prevent common, well known attacks
    // @see https://helmetjs.github.io/
    .use(helmet())
    .use(ErrorRespondingKoaMiddleware())
    // Serve static files in publicDir
    .use(serve(publicDir))
    .use((ctx, next) => {
      return koaMount("/api", ApiKoa())(ctx, next);
    })
    .use(router.routes());
  // .use(router.allowedMethods());
  return koa;
}

function ActivityPubDotComWebSocketEventHandler(): IWebSocketServerEventHandler {
  return {
    handleEvent(event: WebSocketServerEvent) {
      if (!Array.isArray(event)) {
        console.warn("Got non-array event");
        return;
      }
      const [eventName, ...args] = event;
      switch (eventName) {
        case WebSocketServerEventName.connection:
          const [webSocket] = args;
          for (const example of specOverSectionExampleConversation) {
            webSocket.send(JSON.stringify(example));
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
  const requestListener = ActivityPubComKoa().callback();
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
    const eventHandler = ActivityPubDotComWebSocketEventHandler();
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
