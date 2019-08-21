import * as as2 from "activitystreams2";
import * as t from "io-ts";
import { PathReporter } from "io-ts/lib/PathReporter";

export type TypeOf<C extends t.Any> = t.TypeOf<C>;

const URI = t.string;

export const Link = t.intersection([
  t.type({
    type: t.literal("Link"),
  }),
  t.partial({
    href: URI,
  }),
]);

// https://www.w3.org/TR/activitystreams-core/#naturalLanguageValues
const NaturalLanguageValue = t.string;
const Bcp47LanguageTag = t.union([
  t.literal("en"),
  t.literal("es"),
  t.literal("fr"),
]);
const NaturalLanguageMap = t.record(Bcp47LanguageTag, t.string);
const naturalLanguageValueProperties = ["name", "summary", "content"];

const MaybeHasName = t.union([
  t.partial({
    name: t.string,
  }),
  t.partial({
    nameMap: NaturalLanguageMap,
  }),
]);

const AS2Object = t.intersection([
  MaybeHasName,
  t.partial({
    id: t.string,
  }),
]);

const ActivityTypeName = t.union([
  t.literal("Activity"),
  t.literal(as2.activitySubtypes[0]),
  ...as2.activitySubtypes.slice(1).map(s => t.literal(s)),
]);

export const Activity = t.intersection([
  AS2Object,
  t.type({
    type: ActivityTypeName,
  }),
  t.type({
    actor: t.union([URI, Link, AS2Object]),
    object: t.union([URI, Link, AS2Object]),
  }),
]);

export const getValidationErrors = <A, O = A, I = unknown>(
  Type: t.Type<A, O, I>,
  candidate: any,
) => {
  return PathReporter.report(Type.decode(candidate));
};
