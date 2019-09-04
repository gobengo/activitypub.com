import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import Collapse from "@material-ui/core/Collapse";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import classnames from "classnames";
import React, { useContext, useEffect, useState } from "react";
import * as as2Types from "../activitystreams2-io-ts/activitystreams2IoTsTypes";
import ActivityText from "./ActivityText";

const useStyles = makeStyles({
  avatar: {
    height: "1em",
    width: "1em",
  },
  firstChildNoTopMargin: {
    "& *:first-child": {
      marginTop: 0,
    },
  },
  lastChildNoBottomMargin: {
    "& *:last-child": {
      marginBottom: 0,
    },
  },
  overflowAuto: {
    overflow: "auto",
  },
});

export function ActivityCard(props: {
  activity: as2Types.TypeOf<typeof as2Types.Activity>;
  window: Window;
}) {
  const classes = useStyles();
  const [shouldShowJson, setShouldShowJson] = React.useState(false);
  const handleJsonClick = () => setShouldShowJson(!shouldShowJson);
  const author = props.activity.actor || props.activity.attributedTo;
  const firstAuthor = Array.isArray(author) ? author[0] : author;
  const authorName =
    firstAuthor &&
    (typeof firstAuthor === "string"
      ? firstAuthor
      : "type" in firstAuthor && firstAuthor.type === "Link"
      ? "href" in firstAuthor
        ? firstAuthor.href
        : undefined
      : "name" in firstAuthor && firstAuthor.name);
  return (
    <Card>
      <CardHeader
        avatar={
          <Avatar aria-label="avatar" className={classes.avatar}>
            {authorName ? authorName[0] : ""}
          </Avatar>
        }
        // action={
        //   <IconButton aria-label="settings">
        //     <MoreVertIcon />
        //   </IconButton>
        // }
        title={authorName}
        // subheader="September 14, 2016"
      />
      <CardContent
        className={classnames(
          classes.firstChildNoTopMargin,
          classes.lastChildNoBottomMargin,
        )}
      >
        <Typography component="section">
          <ActivityText
            activity={props.activity}
            actor={false}
            window={props.window}
          />
        </Typography>
      </CardContent>
      <CardActions>
        <Button onClick={handleJsonClick}>
          {shouldShowJson ? "Hide" : "Show"} JSON
        </Button>
      </CardActions>
      <Collapse in={shouldShowJson} timeout="auto" unmountOnExit>
        <CardContent>
          <pre className={classes.overflowAuto}>
            {JSON.stringify(props.activity, null, 2)}
          </pre>
        </CardContent>
      </Collapse>
    </Card>
  );
}

export default ActivityCard;
