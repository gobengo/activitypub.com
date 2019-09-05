import Grow from "@material-ui/core/Grow";
import Slide from "@material-ui/core/Slide";
import * as React from "react";
import useWebSocket from "react-use-websocket";
import * as urlPackage from "url";
import * as as2Types from "../activitystreams2-io-ts/activitystreams2IoTsTypes";

const { useEffect, useState } = React;

function urlProtocolReplacer(
  getNewProtocol: (parsed: urlPackage.UrlWithStringQuery) => string,
) {
  return (url: string) => {
    const parsed = urlPackage.parse(url);
    const withNewProtocol = urlPackage.format({
      ...parsed,
      protocol: getNewProtocol(parsed),
    });
    return withNewProtocol;
  };
}

interface IWSMessage {
  data: string;
}

type IActivity = as2Types.TypeOf<typeof as2Types.Activity>;
export function PublishedDescendingComparator() {
  return (a: IActivity, b: IActivity): number => {
    const aPublishedDate = new Date(Date.parse(a.published || ""));
    const bPublishedDate = new Date(Date.parse(b.published || ""));
    if (aPublishedDate === bPublishedDate) {
      return 0;
    }
    return aPublishedDate < bPublishedDate ? 1 : -1;
  };
}

export interface IActivityStreamItemProps {
  activity: IActivity;
}

/**
 * React Component to render a stream of Activities.
 * * it will listen for new activities on a WebSocket
 */
export function ActivityStream(props: {
  /** Component to render each activity */
  Item: React.ComponentType<IActivityStreamItemProps>;
  /** Show when there have been no messages yet */
  Empty?: React.ComponentType<{}>;
  /** ws:// url */
  url: string;
  sort?: (activities: IActivity[]) => IActivity[];
}) {
  const sortActivities = props.sort
    ? props.sort
    : (_activities: IActivity[]) =>
        _activities.sort(PublishedDescendingComparator());
  const httpUrl = urlProtocolReplacer(parsedUrl => {
    switch (parsedUrl.protocol) {
      case "wss:":
        return "https:";
      case "ws:":
      default:
        return "http:";
    }
  })(props.url);
  const { Empty, Item } = props;
  const [sendMessage, latestMessage, readyState] = useWebSocket(props.url);
  // const window = global.window;
  const [messages, setMessages] = useState<IWSMessage[]>([]);
  const [activities, setActivities] = useState<
    Array<as2Types.TypeOf<typeof as2Types.Activity>>
  >([]);
  const [
    latestStreamedActivityState,
    setLatestStreamedActivityState,
  ] = useState<{
    activity: IActivity;
    hasTransitioned: boolean;
  } | null>(null);
  React.useEffect(() => {
    (async () => {
      const response = await fetch(httpUrl);
      const responseBodyObject = await response.json();
      if (
        !(responseBodyObject && responseBodyObject.type === "OrderedCollection")
      ) {
        console.warn(
          "Expected OrderedCollection response from url, but got something else",
          {
            httpUrl,
            responseBodyObject,
          },
        );
        return;
      }
      const inbox = responseBodyObject;
      const inboxItems = inbox.items;
      if (!Array.isArray(inboxItems)) {
        console.warn(
          `Expected fetched inbox.items to be an array, but got`,
          inboxItems,
        );
        return;
      }
      setActivities(sortActivities(inboxItems));
    })();
  }, [httpUrl]);

  // update with latestMessage from webSocket
  React.useEffect(() => {
    if (!latestMessage) {
      return;
    }
    setMessages(prev => prev.concat([latestMessage]));
    const parsedMessageData = (() => {
      try {
        return JSON.parse(latestMessage.data);
      } catch (error) {
        console.debug("Error parsing ws message data as JSON", error);
        return;
      }
    })();
    if (!parsedMessageData) {
      return;
    }
    if (as2Types.Activity.is(parsedMessageData)) {
      setLatestStreamedActivityState({
        activity: parsedMessageData,
        hasTransitioned: false,
      });
      setActivities(prev =>
        sortActivities(
          prev.concat(parsedMessageData ? [parsedMessageData] : []),
        ),
      );
    } else {
      console.warn(
        "Got ws message that is JSON, but not Activity",
        parsedMessageData,
      );
      console.warn(
        as2Types.getValidationErrors(as2Types.Activity, parsedMessageData),
      );
    }
    // tslint:disable-next-line: align
  }, [latestMessage]);
  const ItemWithRef = React.forwardRef(
    (_props: IActivityStreamItemProps, ref: React.Ref<HTMLDivElement>) => (
      <div ref={ref}>
        <Item {..._props} />
      </div>
    ),
  );
  return (
    <>
      {activities.length === 0 && Empty && <Empty />}
      {activities.map((activity, index) => {
        const isLatestStreamedActivity =
          latestStreamedActivityState &&
          activity === latestStreamedActivityState.activity;
        const shouldSlideIn =
          isLatestStreamedActivity &&
          latestStreamedActivityState &&
          !latestStreamedActivityState.hasTransitioned;
        if (
          isLatestStreamedActivity &&
          shouldSlideIn &&
          latestStreamedActivityState
        ) {
          latestStreamedActivityState.hasTransitioned = true;
        }
        return (
          <div key={index}>
            {shouldSlideIn ? (
              <Slide in={true} direction="down" mountOnEnter>
                <ItemWithRef activity={activity} />
              </Slide>
            ) : (
              <Item activity={activity} />
            )}
          </div>
        );
      })}
    </>
  );
}

export default ActivityStream;
