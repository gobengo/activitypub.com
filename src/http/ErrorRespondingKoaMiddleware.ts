import Koa from "koa";

/**
 * ErrorRespondingKoaMiddleware
 * Single place to define how send HTTP responses when koas
 * encounter a thrown Error.
 */
export default (): Koa.Middleware => async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    ctx.status = err.status || 500;
    ctx.body = (() => {
      switch (ctx.accepts("json", "html", "text")) {
        case "json":
          return {
            message: err.message,
            type: "Error",
          };
        default:
          return err.message;
      }
    })();
    ctx.app.emit("error", err, ctx);
  }
};
