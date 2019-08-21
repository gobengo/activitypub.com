import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import { MDXProvider } from "@mdx-js/react";
import React from "react";
import { createMuiComponentsForMdx } from "../components/MaterialUiMdxProvider";
import PageLayout from "../components/PageLayout";
import SampleMarkdown from "../components/SampleMarkdown.md";

const useStyles = makeStyles(theme => ({}));

const SamplePage = () => {
  const classes = useStyles();
  return (
    <PageLayout>
      <Typography variant="h1">SamplePage</Typography>
      <Typography variant="body1" component="p">
        This is a sample page!
      </Typography>
      <Typography variant="h2">SamplePage H2</Typography>
      <Typography variant="body1" component="p">
        This is a sample page!
      </Typography>
      <Typography component="span">
        {/** Showing how to override default component mapping of headers (starting at h4) */}
        <MDXProvider components={createMuiComponentsForMdx(4)}>
          <SampleMarkdown />
        </MDXProvider>
      </Typography>
    </PageLayout>
  );
};

export default SamplePage;
