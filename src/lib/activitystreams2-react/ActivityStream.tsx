import * as React from "react";
import useWebSocket from "react-use-websocket";
import * as as2Types from "../activitystreams2-io-ts/activitystreams2IoTsTypes";

const { useEffect, useState } = React;

interface IWSMessage {
  data: string;
}

/**
 * React Component to render a stream of Activities.
 * * it will listen for new activities on a WebSocket
 */
export function ActivityStream(props: {
  /** Component to render each activity */
  Item: React.ComponentType<{
    activity: as2Types.TypeOf<typeof as2Types.Activity>;
  }>;
  /** Show when there have been no messages yet */
  Empty?: React.ComponentType<{}>;
  /** ws:// url */
  url: string;
}) {
  const { Empty, Item } = props;
  const [sendMessage, latestMessage, readyState] = useWebSocket(props.url);
  // const window = global.window;
  const [messages, setMessages] = useState<IWSMessage[]>([]);
  const [activities, setActivities] = useState<
    Array<as2Types.TypeOf<typeof as2Types.Activity>>
  >([]);
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
      setActivities(prev => prev.concat([JSON.parse(latestMessage.data)]));
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
  return (
    <>
      {activities.length === 0 && Empty && <Empty />}
      {activities.map((activity, index) => {
        return <Item key={index} activity={activity} />;
      })}
    </>
  );
}

export default ActivityStream;
