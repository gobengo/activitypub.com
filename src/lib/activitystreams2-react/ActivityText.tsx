import * as as2 from "activitystreams2";
import { HTMLElement, NodeType, parse, TextNode } from "node-html-parser";
import React, { useCallback, useMemo, useState } from "react";
import Sanitizer, { ISanitizer } from "./sanitizer";

function ensureHtmlHasParagraph(html: string) {
  const parsed = parse(html, { lowerCaseTagName: true });
  const needsParagraphWrapper = (() => {
    if (parsed instanceof TextNode) {
      return true;
    }
    if (parsed.querySelector("p")) {
      return false;
    }
    if (parsed.querySelector("ul")) {
      // <p /> can't contain <ul />
      return false;
    }
    return true;
  })();
  if (needsParagraphWrapper) {
    return `<p>${html}</p>`;
  }
  return html;
}

const ActivityObject = (props: {
  activity: as2.Activity;
  sanitize: ISanitizer;
}) => {
  const { activity, sanitize } = props;
  const { object } = activity;
  if (!object) {
    return null;
  }
  const html =
    typeof object === "string"
      ? // It should be a URI, but sanitie it anyway
        object
      : object.content
      ? object.content
      : null;
  if (!html) {
    return null;
  }
  const formattedHtml = useMemo(() => {
    const sanitizedHtml = sanitize(html);
    const htmlWithParagraph = ensureHtmlHasParagraph(sanitizedHtml);
    return htmlWithParagraph;
  }, [html]);
  return <span dangerouslySetInnerHTML={{ __html: formattedHtml }} />;
};

/**
 * ActivityText.
 * Render an Activity as text.
 */
export default (props: {
  activity: as2.Activity;
  actor: boolean;
  window: Window;
}) => {
  const showActor = props.actor;
  const activity = props.activity;
  const author = activity.actor;
  const sanitize = useCallback(
    (html: string) => Sanitizer(props.window)(html),
    [props.window],
  );
  return (
    <>
      {showActor && (
        <>
          {author}:
          <br />
        </>
      )}
      <ActivityObject activity={activity} sanitize={sanitize} />
    </>
  );
};
