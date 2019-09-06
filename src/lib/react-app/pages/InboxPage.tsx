import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import React, { useContext, useEffect, useState } from "react";
import * as urlPackage from "url";
import ActivityCard from "../../activitystreams2-react/ActivityCard";
import ActivityStream from "../../activitystreams2-react/ActivityStream";
import { IGetInitialPropsContext } from "../../after-types/GetInitialPropsContext";
import { incomingMessageIsSecure, incomingMessageUrl } from "../../http/incomingMessage";
import PageLayout from "../components/PageLayout";
import PublicConfigContext from "../contexts/PublicConfigContext";

const useStyles = makeStyles(theme => ({
  activity: {
    marginTop: "1em",
  },
}));

interface IInboxPageProps {
  urls: {
    home: string;
    self: string;
    webSocketBase: string;
  };
}

interface IActivityStreams2Activity {
  "@context": string;
}

const InboxPage = (props: IInboxPageProps) => {
  // console.log("InboxPage", { props });
  const classes = useStyles();
  const config = useContext(PublicConfigContext);
  return (
    <PageLayout>
      <Typography variant="h2" component="h1" gutterBottom>
        ActivityPub Inbox
      </Typography>
      <InboxStreamPageSection
        urls={{
          ...props.urls,
          distbin: config.distbinUrl,
          self: props.urls.self,
          webSocket: `${props.urls.webSocketBase}${config.streamPathname}`,
        }}
        // distbinUrl={config.distbinUrl}
        // selfAbsoluteUrl={props.selfAbsoluteUrl}
        // webSocketUrl={}
      />
    </PageLayout>
  );
};

InboxPage.getInitialProps = async (
  ctx: IGetInitialPropsContext,
): Promise<IInboxPageProps> => {
  try {
    return {
      urls: {
        home: new urlPackage.URL("/", incomingMessageUrl(ctx.req)).toString(),
        self: new urlPackage.URL(incomingMessageUrl(ctx.req)).toString(),
        webSocketBase: `${incomingMessageIsSecure(ctx.req) ? "wss" : "ws"}://${
          ctx.req.headers.host
        }`,
      },
    };
  } catch (error) {
    console.error("Error in InboxPage.getInitialProps", error);
    throw error;
  }
};

function DistbinInstructions(props: {
  urls: {
    distbin: string;
    self: string;
    webSocket: string;
  };
}) {
  const { urls } = props;
  const linkToNewDistbinPost = (() => {
    const distbinUrlWithQuery = new URL(urls.distbin);
    const query = {
      "attributedTo.name": "Anonymous",
      content: `I'm trying out #ActivityPub by posting on ${urls.distbin} in reply to ${props.urls.self} .\n\n`,
      inReplyTo: props.urls.self,
    };
    for (const [key, value] of Object.entries(query)) {
      distbinUrlWithQuery.searchParams.append(key, value);
    }
    return distbinUrlWithQuery.toString();
  })();
  return <>
    <p>
      Try posting an Activity. How? Use
      ActivityPub. Use an ActivityPub client to post a social web
      activity that cc's {props.urls.self}.
    </p>
    <p>
      If you don't already have a favorite ActivityPub client, you can
      use the really simple one at{" "}
      <a href={linkToNewDistbinPost}>{props.urls.distbin}</a>.
      <a href={linkToNewDistbinPost}>This link</a> will even fill out
      the form there for you so can just hit 'post'.
    </p>
  </>;
}

/**
 * Include an ActivityStream configured for this app.
 * It includes some helpful text when the stream is empty.
 */
export function InboxStreamPageSection(props: {
  urls: {
    distbin: string;
    self: string;
    home: string;
    webSocket: string;
  };
}) {
  const { urls } = props;
  const distbinUrl = urls.distbin;
  const classes = useStyles();
  return (
    <>
      <Typography variant="body1" component="span">
        <p>
          This page shows a real-time stream of all activities received by the
          ActivityPub.com Inbox. You can learn about
          inboxes <a href="https://www.w3.org/TR/activitypub/#inbox">here</a>.
        </p>
        <p>
          That means you can see here all the (public) objects on the fediverse
          that include "{props.urls.home}" in their{" "}
          <a href="https://www.w3.org/TR/activitystreams-vocabulary/#audienceTargeting">
            Audience Targeting
          </a>{" "}
          properties.
        </p>
        <DistbinInstructions {...props} />
      </Typography>
      <ActivityStream
        url={props.urls.webSocket}
        Empty={() => (
          <Typography variant="body1" component="span">
            <p>No activities have streamed in yet.</p>
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

export default InboxPage;

if (module.hot) {
  module.hot.accept();
}
