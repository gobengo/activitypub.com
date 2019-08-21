import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import React from "react";
import PageLayout from "../components/PageLayout";

const useStyles = makeStyles(theme => ({
  homeImage: {
    width: "100%",
  },
}));

const HomePage = () => {
  const classes = useStyles();
  return (
    <PageLayout>
      <Typography variant="h3">HomePage</Typography>
      <Typography variant="body1">There's no place like home.</Typography>
    </PageLayout>
  );
};

export default HomePage;
