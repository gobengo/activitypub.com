import { render } from "@jaredpalmer/after";
import Koa from "koa";
import helmet from "koa-helmet";
import koaMount from "koa-mount";
import Router from "koa-router";
import serve from "koa-static";
import React from "react";
import App from "./App/App";
import ApiKoa from "./http/ApiKoa";
import ErrorRespondingKoaMiddleware from "./http/ErrorRespondingKoaMiddleware";

// tslint:disable-next-line: no-var-requires
const assets = require(process.env.RAZZLE_ASSETS_MANIFEST!);

// Initialize `koa-router` and setup a route listening on `GET /*`
// Logic has been splitted into two chained middleware functions
// @see https://github.com/alexmingoia/koa-router#multiple-middleware
const router = new Router();
router.get("/*", async (ctx: Koa.Context, next) => {
  const markupFromAfterjs = await render({
    assets,
    req: ctx.req,
    res: ctx.res,
    ...App,
  });
  ctx.status = 200;
  ctx.body = markupFromAfterjs;
});

// Intialize and configure Koa application
const server = new Koa();
server
  // `koa-helmet` provides security headers to help prevent common, well known attacks
  // @see https://helmetjs.github.io/
  .use(helmet())
  .use(ErrorRespondingKoaMiddleware())
  // Serve static files located under `process.env.RAZZLE_PUBLIC_DIR`
  .use(serve(process.env.RAZZLE_PUBLIC_DIR!))
  .use((ctx, next) => {
    return koaMount("/api", ApiKoa())(ctx, next);
  })
  .use(router.routes());
// .use(router.allowedMethods());

export default server;

if (module.hot) {
  module.hot.accept(["./http/ApiKoa"]);
}
