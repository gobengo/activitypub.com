import Koa from "koa";

/**
 * ErrorRespondingKoaMiddleware
 * Single place to define how send HTTP responses when koas
 * encounter a thrown Error.
 */
export default (): Koa.Middleware => async (ctx, next) => {
  try {
    await next();
  } catch (error) {
    ctx.status = error.status || 500;
    ctx.body = (() => {
      const message = (() => {
        if (error.expose) {
          return error.message;
        }
        if ((process.env.NODE_ENV || "").toLowerCase() === "production") {
          return "Unexpected error";
        }
        return error.message;
      })();
      switch (ctx.accepts("json", "html", "text")) {
        case "json":
          return {
            message,
            type: "Error",
            ...(error.expose && error.errors && { errors: error.errors }),
          };
        default:
          return [
            message,
            ...(error.expose && error.errors ? [error.errors.join("\n")] : []),
          ]
            .filter(Boolean)
            .join("\n");
      }
    })();
    ctx.app.emit("error", error, ctx);
  }
};
