import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import { Location } from "history";
import React, { useContext, useEffect, useState } from "react";
import * as as2Types from "../../activitystreams2-io-ts/activitystreams2IoTsTypes";
import ActivityCard from "../../activitystreams2-react/ActivityCard";
import ActivityStream from "../../activitystreams2-react/ActivityStream";
import { IGetInitialPropsContext } from "../../after-types/GetInitialPropsContext";
import PageLayout from "../components/PageLayout";
import ConfigContext from "../contexts/ConfigContext";

const useStyles = makeStyles(theme => ({
  activity: {
    "&:first-child": {
      marginTop: 0,
    },
    marginTop: "1em",
  },
}));

interface IStreamPageProps {
  location: Location;
  webSocketBaseUrl: string | undefined;
}

interface IActivityStreams2Activity {
  "@context": string;
}

const StreamPage = (props: IStreamPageProps) => {
  // console.log("StreamPage", { props });
  const classes = useStyles();
  const config = useContext(ConfigContext);
  return (
    <PageLayout>
      <Typography variant="h2" component="h1" gutterBottom>
        ActivityPub.com Activity Stream
      </Typography>
      <ActivityStreamPageSection webSocketBaseUrl={props.webSocketBaseUrl} />
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

if (module.hot) {
  module.hot.accept();
}

export function ActivityStreamPageSection(props: {
  webSocketBaseUrl: string | undefined;
}) {
  const classes = useStyles();
  const config = useContext(ConfigContext);
  return (
    <>
      <Typography variant="body1" component="span">
        <p>
          This page shows a real-time stream of all activities received by the
          ActivityPub.com ActivityPub Inbox.
        </p>
        <p>
          That means you can see here all the (public) objects on the fediverse
          that include 'https://activitypub.com' in their{" "}
          <a href="https://www.w3.org/TR/activitystreams-vocabulary/#audienceTargeting">
            Audience Targeting
          </a>{" "}
          properties.
        </p>
      </Typography>
      <ActivityStream
        url={`${props.webSocketBaseUrl}/${config.streamPathname}`}
        Empty={() => (
          <Typography variant="body1">
            (No activities have streamed in yet. Try posting one!)
          </Typography>
        )}
        Item={({ activity }) => (
          <div className={classes.activity}>
            <ActivityCard activity={activity} window={window} />
          </div>
        )}
      />
    </>
  );
}
