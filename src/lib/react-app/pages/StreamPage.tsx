import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import { Location } from "history";
import React, { useContext, useEffect, useState } from "react";
import useWebSocket from "react-use-websocket";
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
  useEffect(() => {
    if (latestMessage) {
      setMessages(prev => prev.concat([latestMessage]));
    }
  }, [latestMessage]);
  return (
    <PageLayout>
      <Typography variant="h1">StreamPage</Typography>
      <Typography variant="body1">Stream of all incoming messages.</Typography>
      <ul>
        {messages.map((message, index) => {
          return <li key={index}>{message.data}</li>;
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
