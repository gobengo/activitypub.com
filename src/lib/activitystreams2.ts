import * as t from "io-ts";
import * as as2t from "./activitystreams2-io-ts/activitystreams2IoTsTypes";

export const as2PublicAudienceUri =
  "https://www.w3.org/ns/activitystreams#Public";
export const as2ContentType = `application/ld+json; profile="https://www.w3.org/ns/activitystreams"`;
export const as2ContextUrl = "https://www.w3.org/ns/activitystreams";

export function objectTargets(as2Activity: t.TypeOf<typeof as2t.Activity>) {
  return [
    ...(as2Activity.to || []),
    ...(as2Activity.bto || []),
    ...(as2Activity.cc || []),
    ...(as2Activity.bcc || []),
  ];
}
