import AppBar from "@material-ui/core/AppBar";
import Button from "@material-ui/core/Button";
import Drawer from '@material-ui/core/Drawer';
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import Link from "@material-ui/core/Link";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import { makeStyles } from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import MenuIcon from "@material-ui/icons/Menu";
import classnames from "classnames";
import Facebook from "mdi-material-ui/Facebook";
import Instagram from "mdi-material-ui/Instagram";
import Twitter from "mdi-material-ui/Twitter";
import React from "react";
import PublicConfigContext from "../contexts/PublicConfigContext";

const useStyles = makeStyles(theme => ({
  appBar: {
    backgroundColor: 'transparent'
  },
  copyright: {
    marginBottom: 8,
    marginTop: 8,
  },
  footer: {
    marginTop: "auto",
    padding: theme.spacing(2),
  },
  footerSecondLine: {
    color: theme.palette.grey[500],
  },
  menuIcon: {
    display: "contents",
    justifyContent: "flex-end",
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
    padding: '1.5rem',
  },
  page: {
    backgroundColor: theme.palette.background.default,
    color: theme.palette.text.primary,

    '& a:not(.MuiButton-contained)': {
      color: theme.palette.primary.main,
    },
    '& a:not(.MuiButton-contained):visited': {
      color: theme.palette.primary.dark,
    },
  }
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
  const config = React.useContext(PublicConfigContext);
  const classes = useStyles();
  const [menuDrawerIsOpen, setMenuDrawerIsOpen] = React.useState(false);
  const closeMenuDrawer = React.useCallback(() => setMenuDrawerIsOpen(false), [setMenuDrawerIsOpen]);
  const toggleMenuDrawer = React.useCallback(() => setMenuDrawerIsOpen( ! menuDrawerIsOpen), [setMenuDrawerIsOpen]);
  return (
    <div className={classnames(classes.page, classes.minHeightViewportHeight)}>
      <style>{`body {margin: 0; }`}</style>
      <AppBar position="static" color="inherit" className={classes.appBar} elevation={0}>
        <Toolbar variant="dense">
          <a href="/" style={{ color: "inherit", textDecoration: "none" }}>
            <Typography variant="h6">{config.appBarTitle}</Typography>
          </a>
          <IconButton
            edge="end"
            color="primary"
            aria-label="menu"
            className={classes.menuIcon}
            onClick={toggleMenuDrawer}
            disableRipple
            >
            <MenuIcon />
          </IconButton>
          <Drawer
            anchor="right"
            open={menuDrawerIsOpen}
            ModalProps={{
              BackdropProps: {
                invisible: true,
              },
            }}
            onClose={closeMenuDrawer}
          >
            <List>
              <ListItem button component="a" href="/">
                <ListItemText primary={"Home"} />
              </ListItem>
              <ListItem button component="a" href="/inbox">
                <ListItemText primary={"Inbox"} />
              </ListItem>
            </List>
          </Drawer>
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

function PageMenuDrawer(props: {
  children?: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = React.useState(false);
  const close = React.useCallback(() => {
    setIsOpen(false);
  }, [setIsOpen]);
  return (
    <Drawer
      anchor="right"
      open={isOpen}
      ModalProps={{
        BackdropProps: {
          invisible: true,
        },
      }}
      onClose={close}
    >
      {props.children}
    </Drawer>
  );
}
