import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import React from "react";
import { IKoaGetInitialPropsContext } from "../../after-types/GetInitialPropsContext";
import PageLayout from "../components/PageLayout";
import { ActivityStreamPageSection } from "../pages/StreamPage";

const useStyles = makeStyles(theme => ({
  homeImage: {
    width: "100%",
  },
}));

interface IHomePageProps {
  webSocketBaseUrl: string | undefined;
}

const HomePage = (props: IHomePageProps) => {
  const classes = useStyles();
  return (
    <PageLayout>
      <Typography variant="h1">ActivityPub.com</Typography>
      <ActivityStreamPageSection webSocketBaseUrl={props.webSocketBaseUrl} />
    </PageLayout>
  );
};

HomePage.getInitialProps = async (
  ctx: IKoaGetInitialPropsContext,
): Promise<IHomePageProps> => {
  return {
    webSocketBaseUrl: `${ctx.req.secure ? "wss" : "ws"}://${
      ctx.req.headers.host
    }`,
  };
};

export default HomePage;
