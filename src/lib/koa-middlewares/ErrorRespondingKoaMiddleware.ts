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
      const message = err.expose ? err.message : "Unexpected error";
      switch (ctx.accepts("json", "html", "text")) {
        case "json":
          return {
            message,
            type: "Error",
            ...(err.expose && err.errors && { errors: err.errors }),
          };
        default:
          return [
            message,
            ...(err.expose && err.errors ? [err.errors.join("\n")] : []),
          ]
            .filter(Boolean)
            .join("\n");
      }
    })();
    ctx.app.emit("error", err, ctx);
  }
};
