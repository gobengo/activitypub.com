import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import React from "react";
import { IKoaGetInitialPropsContext } from "../../after-types/GetInitialPropsContext";
import PageLayout from "../components/PageLayout";
import PublicConfigContext from "../contexts/PublicConfigContext";
import { ActivityStreamPageSection } from "../pages/StreamPage";

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
      <Typography variant="h1">ActivityPub.com</Typography>
      <ActivityStreamPageSection
        urls={{
          distbin: config.distbinUrl,
          self: props.urls.self,
          webSocket: `${props.urls.webSocketBase}/${config.streamPathname}`,
        }}
      />
    </PageLayout>
  );
};

HomePage.getInitialProps = async (
  ctx: IKoaGetInitialPropsContext,
): Promise<IHomePageProps> => {
  return {
    urls: {
      self: `${ctx.req.protocol || "http"}://${ctx.req.headers.host}${ctx.req
        .originalUrl ||
        ctx.req.url ||
        ""}`,
      webSocketBase: `${ctx.req.secure ? "wss" : "ws"}://${
        ctx.req.headers.host
      }`,
    },
  };
};

export default HomePage;
