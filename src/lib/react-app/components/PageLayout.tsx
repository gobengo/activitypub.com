import AppBar from "@material-ui/core/AppBar";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Link from "@material-ui/core/Link";
import { makeStyles } from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import classnames from "classnames";
import Facebook from "mdi-material-ui/Facebook";
import Instagram from "mdi-material-ui/Instagram";
import Linkedin from "mdi-material-ui/Linkedin";
import Twitter from "mdi-material-ui/Twitter";
import React from "react";
import { appBarTitle } from "../../../config/public";

const useStyles = makeStyles(theme => ({
  appBar: {},
  copyright: {
    marginBottom: 8,
    marginTop: 8,
  },
  footer: {
    backgroundColor: theme.palette.grey[100],
    color: theme.palette.getContrastText(theme.palette.grey[100]),
    marginTop: "auto",
    padding: theme.spacing(2),
  },
  footerSecondLine: {
    color: theme.palette.grey[500],
  },
  minHeightViewportHeight: {
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
  },
  minHeightViewportHeightContent: {
    flex: "1",
  },
  pad: {
    padding: theme.spacing(5),
  },
}));

const Copyright = () => {
  const classes = useStyles();
  return (
    <Typography variant="body2" align="center">
      {"© "}
      {new Date().getFullYear()}
    </Typography>
  );
};

const Footer = () => {
  const classes = useStyles();
  return (
    <footer className={classes.footer}>
      <Grid
        container
        justify="center"
        spacing={1}
        className={classes.footerSecondLine}
      >
        <Grid container justify="center">
          {/* <Grid item>
            <Copyright />
          </Grid> */}
        </Grid>
      </Grid>
    </footer>
  );
};

/**
 * Common Component to wrap all pages with.
 * Adds AppBar to top of page, padding, footer etc.
 */
const PageLayout: React.FunctionComponent = props => {
  const classes = useStyles();
  return (
    <div className={classes.minHeightViewportHeight}>
      <style>{`body {margin: 0; }`}</style>
      <AppBar position="static" color="primary" className={classes.appBar}>
        <Toolbar variant="dense">
          <a href="/" style={{ color: "inherit", textDecoration: "none" }}>
            <Typography variant="h6">{appBarTitle}</Typography>
          </a>
        </Toolbar>
      </AppBar>
      <div
        className={classnames(
          classes.minHeightViewportHeightContent,
          classes.pad,
        )}
      >
        {props.children}
      </div>
      <Footer />
    </div>
  );
};

export default PageLayout;
