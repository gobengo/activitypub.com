import * as coBody from "co-body";
import { stripIndent } from "common-tags";
import { reporter as validationReporter } from "io-ts-reporters";
import Koa from "koa";
import koaMount from "koa-mount";
import koaRoute from "koa-route";
import {
  as2ContextUrl,
  as2PublicAudienceUri,
  objectTargets,
} from "../activitystreams2";
import * as as2t from "../activitystreams2-io-ts/activitystreams2IoTsTypes";
import { IDispatch } from "../server/events";

interface IActivityPubInboxEvent {
  payload: {
    /** The ActivityStreams Object that was sent to the inbox */
    object: as2t.TypeOf<typeof as2t.Activity>;
  };
  type: "ActivityPubInboxEvent";
}

export type IActivityPubEvent = IActivityPubInboxEvent;

/**
 * Koa for the whole API.
 */
export default (options: {
  dispatch: IDispatch<IActivityPubEvent>;
  inbox: Iterable<object>;
  keypair?: {
    public: {
      publicKeyPem: string
    }
  };
}): Koa => {
  const koa = new Koa()
    .use(async (ctx, next) => {
      // console.log("in ApiKoa", ctx.url);
      return next();
    })
    .use(koaMount("/activitypub", ActivityPubKoa(options)));
  // .use(koaMount("/specific-api", SpecificApiKoa()))
  return koa;
};

function ActivityPubKoa(options: {
  dispatch: IDispatch<IActivityPubEvent>;
  inbox: Iterable<object>;
}) {
  const koa = new Koa().use(koaMount("/inbox", ActivityPubInboxKoa(options)));
  return koa;
}

function ActivityPubInboxKoa(options: {
  dispatch: IDispatch<IActivityPubInboxEvent>;
  inbox: Iterable<object>;
}) {
  const koa = new Koa()
    .use(
      koaRoute.get("/")(async ctx => {
        ctx.status = 200;
        ctx.body = {
          "@context": [
            as2ContextUrl,
            "https://w3id.org/security/v1",
          ],
          type: "OrderedCollection",
          // tslint:disable-next-line: object-literal-sort-keys
          items: Array.from(options.inbox),
        };
      }),
    )
    .use(
      koaRoute.post("/")(async ctx => {
        const requestObject = await coBody.json(ctx);
        if (!objectTargets(requestObject).includes(as2PublicAudienceUri)) {
          return ctx.throw(
            400,
            new Error(stripIndent`
        This activity is not allowed here because it is not public.
        All activities sent to this inbox may be displayed on the home page.
        If you intend for this activity to be public, add the following URI
        to one of the as2 audience properties (e.g. "bcc"): ${as2PublicAudienceUri}.

        For more on Public Addressing in ActivityPub, see Section 5.6 of the spec:
        https://www.w3.org/TR/activitypub/#public-addressing
        `),
          );
        }
        if (!as2t.Activity.is(requestObject)) {
          return ctx.throw(
            400,
            Object.assign(
              new Error(stripIndent`
          Invalid ActivityStreams2 Activity.
          Or at least this application failed to parse it. We're not perfect yet.
          We've included some errors below to give you some hints about what the trouble was.
          `),
              {
                errors: validationReporter(as2t.Activity.decode(requestObject)),
              },
            ),
          );
        }
        await options.dispatch({
          payload: {
            object: requestObject,
          },
          type: "ActivityPubInboxEvent",
        });
        Object.assign(ctx, {
          status: 201,
        });
        return;
      }),
    );
  return koa;
}
