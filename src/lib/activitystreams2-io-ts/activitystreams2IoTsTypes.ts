import * as as2 from "activitystreams2";
import * as t from "io-ts";
import { PathReporter } from "io-ts/lib/PathReporter";

export type TypeOf<C extends t.Any> = t.TypeOf<C>;

const URI = t.string;

export const Link = t.union([
  t.string,
  t.intersection([
    t.type({
      type: t.literal("Link"),
    }),
    t.partial({
      href: URI,
    }),
  ]),
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

const OneOrMore = (T: t.Mixed) => {
  return t.union([T, t.array(T)]);
};

type IOneOrMore<T> = T | T[];

type IAS2Object = t.TypeOf<typeof MaybeHasName> & {
  id?: string;
  type?: string;

  attributedTo?: IOneOrMore<(typeof Link) | IAS2Object>;
  url?: IOneOrMore<t.TypeOf<typeof Link>>;

  bcc?: Array<t.TypeOf<typeof Link> | IAS2Object>;
  bto?: Array<t.TypeOf<typeof Link> | IAS2Object>;
  cc?: Array<t.TypeOf<typeof Link> | IAS2Object>;
  to?: Array<t.TypeOf<typeof Link> | IAS2Object>;
};

const AS2Object: t.Type<IAS2Object> = t.recursion("AS2Object", () =>
  t.intersection([
    t.type({}),
    MaybeHasName,
    t.partial({
      id: t.string,
      type: t.string,

      attributedTo: OneOrMore(t.union([Link, AS2Object])),
      url: OneOrMore(Link),

      bcc: t.array(AudienceValue),
      bto: t.array(AudienceValue),
      cc: t.array(AudienceValue),
      to: t.array(AudienceValue),
    }),
  ]),
);

const AudienceValue = t.union([Link, AS2Object]);

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
  t.partial({
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
