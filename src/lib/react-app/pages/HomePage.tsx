import Button from "@material-ui/core/Button";
import Link from "@material-ui/core/Link";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import React from "react";
import { IGetInitialPropsContext } from "../../after-types/GetInitialPropsContext";
import { incomingMessageIsSecure, incomingMessageUrl } from "../../http/incomingMessage";
import PageLayout from "../components/PageLayout";
import PublicConfigContext from "../contexts/PublicConfigContext";
import { InboxStreamPageSection } from "./InboxPage";

const useStyles = makeStyles(theme => ({
  homeImage: {
    width: "100%",
  },
}));

interface IHomePageProps {
  urls: {
    self: string;
    webSocketBase: string;
  };
}

const HomePage = (props: IHomePageProps) => {
  const classes = useStyles();
  const config = React.useContext(PublicConfigContext);
  return (
    <PageLayout>
      <Typography variant="body1" component="span">
        <section>
          <Typography variant="h2">What is ActivityPub?</Typography>
          <p>According to <cite><a href="https://activitypub.rocks/">activitypub.rocks</a></cite>: </p>
          <blockquote cite="https://activitypub.rocks">
            <p>
              ActivityPub is a decentralized social networking protocol based on
              the <Link href="https://www.w3.org/TR/activitystreams-core/">ActivityStreams 2.0</Link> data format.
              ActivityPub is an official W3C recommended standard published by
              the <a href="https://www.w3.org/wiki/Socialwg">W3C Social Web Working Group</a>.
              It provides a client to server API for creating, updating and deleting content, as
              well as a federated server to server API for delivering notifications and subscribing to content.
            </p>
          </blockquote>
          <p>
            <Button variant="outlined" color="primary" href="https://activitypub.rocks">
              Learn more at ActivityPub.rocks
            </Button>
          </p>
        </section>
        <section>
          <Typography variant="h2">See it in Action</Typography>
          <Typography component="span">
            <p>
              This website is itself a part of the ActivityPub fediverse.
              Posts that include {props.urls.self} in their audience will display
              on the <a href="/inbox">Inbox Page</a> for everyone to see.
            </p>
            <p>
              <Button
                color="primary"
                variant="contained"
                href="/inbox"
              >View the ActivityPub.com Inbox</Button>
            </p>
          </Typography>
        </section>
      </Typography>
      {/* <Typography variant="h1">ActivityPub.com</Typography> */}
      {/* <InboxStreamPageSection
        urls={{
          distbin: config.distbinUrl,
          self: props.urls.self,
          webSocket: `${props.urls.webSocketBase}${config.streamPathname}`,
        }}
      /> */}
    </PageLayout>
  );
};

HomePage.getInitialProps = async (
  ctx: IGetInitialPropsContext,
): Promise<IHomePageProps> => {
  try {
    return {
      urls: {
        self: incomingMessageUrl(ctx.req),
        webSocketBase: `${incomingMessageIsSecure(ctx.req) ? "wss" : "ws"}://${
          ctx.req.headers.host
        }`,
      },
    };
  } catch (error) {
    console.error("Error in HomePage.getInitialProps", error);
    throw error;
  }
};

export default HomePage;
