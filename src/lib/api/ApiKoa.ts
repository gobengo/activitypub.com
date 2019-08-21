import Koa from "koa";
import koaMount from "koa-mount";

/**
 * Koa for the whole API.
 */
export default (): Koa => {
  const koa = new Koa().use(async (ctx, next) => {
    // console.log("in ApiKoa", ctx.url);
    return next();
  });
  // .use(koaMount("/specific-api", SpecificApiKoa()))
  return koa;
};
