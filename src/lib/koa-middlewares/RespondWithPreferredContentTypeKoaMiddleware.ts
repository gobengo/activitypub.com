import Koa from "koa";

/**
 * RespondWithPreferredContentTypeKoaMiddleware
 */
export default (): Koa.Middleware => async (ctx, next) => {
  await next();
  const newBody = (() => {
    if (ctx.request.type === ctx.response.type) {
      return ctx.body;
    }
    switch (ctx.request.type) {
      case "application/json":
      case "application/ld+json":
        switch (ctx.response.type) {
          case "":
          case "text/plain":
            return { message: ctx.body || ctx.message };
          default:
        }
        break;
      default:
    }
    return;
  })();
  if (newBody) {
    ctx.body = newBody;
  }
};
