import createDOMPurify from "dompurify";

// const window = jsdom.jsdom("", {
//   features: {
//     FetchExternalResources: false, // disables resource loading over HTTP / filesystem
//     ProcessExternalResources: false, // do not execute JS within script blocks
//   },
// }).defaultView;

export type ISanitizer = (html: string) => string;

export default (options: { window: Window }): ISanitizer => (
  html: string,
): string => {
  const DOMPurify = createDOMPurify(window);
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ["#text", "p"],
  });
};

export const HtmlToText = (options: { window: Window }): ISanitizer => (
  html: string,
): string => {
  const DOMPurify = createDOMPurify(window);
  return DOMPurify.sanitize(html, { ALLOWED_TAGS: ["#text"] });
};
