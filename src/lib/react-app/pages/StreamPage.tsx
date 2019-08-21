import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import { Location } from "history";
import * as iots from "io-ts";
import React, { useContext, useEffect, useState } from "react";
import useWebSocket from "react-use-websocket";
import * as as2Types from "../../activitystreams2-io-ts/activitystreams2IoTsTypes";
import ActivityText from "../../activitystreams2-react/ActivityText";
import { IGetInitialPropsContext } from "../../after-types/GetInitialPropsContext";
import PageLayout from "../components/PageLayout";
import ConfigContext from "../contexts/ConfigContext";

const useStyles = makeStyles(theme => ({}));

interface IWSMessage {
  data: string;
}

interface IStreamPageProps {
  location: Location;
  webSocketBaseUrl: string | undefined;
}

interface IActivityStreams2Activity {
  "@context": string;
}

const StreamPage = (props: IStreamPageProps) => {
  // console.log("StreamPage", { props });
  const config = useContext(ConfigContext);
  const classes = useStyles();
  if (!props.webSocketBaseUrl) {
    throw new Error("webSocketBaseUrl is required");
  }
  const [sendMessage, latestMessage, readyState] = useWebSocket(
    `${props.webSocketBaseUrl}${config.streamPathname}`,
  );
  const [messages, setMessages] = useState<IWSMessage[]>([]);
  const [activities, setActivities] = useState<
    Array<iots.TypeOf<typeof as2Types.Activity>>
  >([]);
  useEffect(() => {
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
  }, [latestMessage]);
  return (
    <PageLayout>
      <Typography variant="h1">StreamPage</Typography>
      <Typography variant="body1">Stream of all incoming messages.</Typography>
      <ul>
        {activities.map((activity, index) => {
          return (
            <li key={index}>
              <ActivityText activity={activity} />
              <details>
                <pre>{JSON.stringify(activity, null, 2)}</pre>
              </details>
            </li>
          );
        })}
      </ul>
    </PageLayout>
  );
};

StreamPage.getInitialProps = async (
  ctx: IGetInitialPropsContext,
): Promise<IStreamPageProps> => {
  return {
    location: ctx.location,
    webSocketBaseUrl: `ws://${ctx.req.headers.host}`,
  };
};

export default StreamPage;
