import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import React from "react";

const useStyles = makeStyles(theme => ({}));

/**
 * Common Component to wrap pages with a restricted width, and justified center.
 */
const ResponsiveMaxWidth: React.FunctionComponent = props => {
  const classes = useStyles();
  return (
    <div>
      <Grid container justify="center">
        <Grid item sm={8}>
          {" "}
          {props.children}
        </Grid>
      </Grid>
    </div>
  );
};

export default ResponsiveMaxWidth;
