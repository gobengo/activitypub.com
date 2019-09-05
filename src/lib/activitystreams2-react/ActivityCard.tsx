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
import * as as2t from "../activitystreams2-io-ts/activitystreams2IoTsTypes";
import ActivityText from "./ActivityText";

const useStyles = makeStyles({
  avatar: {
    height: "2em",
    width: "2em",
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
  activity: as2t.TypeOf<typeof as2t.Activity>;
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
  const { activity } = props;
  const publishedDate = (() => {
    if (!activity.published) {
      return;
    }
    try {
      const parsed = Date.parse(activity.published);
      if (isNaN(parsed)) {
        throw new Error(`published value parsed to ${parsed}, not Number`);
      }
      return new Date(parsed);
    } catch (error) {
      console.debug("Error parsing activity.published", activity.published, {
        error,
      });
    }
    return;
  })();
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
        subheader={publishedDate && shortDatetimeString(publishedDate)}
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
        {activity.url && (
          <Button
            component="a"
            href={href(activity.url)}
            target="_blank"
            rel="noopener noreferrer"
          >
            Visit URL
          </Button>
        )}
        <Button onClick={handleJsonClick}>
          {shouldShowJson ? "Hide" : "Show"} JSON
        </Button>
      </CardActions>
      <Collapse in={shouldShowJson} timeout="auto" unmountOnExit>
        <CardContent className={classes.firstChildNoTopMargin}>
          <pre className={classes.overflowAuto}>
            {JSON.stringify(props.activity, null, 2)}
          </pre>
        </CardContent>
      </Collapse>
    </Card>
  );
}

export default ActivityCard;

function href(link: as2t.IAS2Object["url"]): string | undefined {
  if (!link) {
    return link;
  }
  if (typeof link === "string") {
    return link;
  }
  if (Array.isArray(link)) {
    for (const v of link) {
      const h = href(v);
      if (h) {
        return h;
      }
    }
    return;
  }
  if (link.type === "Link") {
    return link.href;
  }
  return;
}

function shortDatetimeString(date: Date): string {
  const todayStart = (() => {
    const d = new Date(date);
    d.setHours(0);
    d.setMinutes(0);
    return d;
  })();
  const dateIsToday = Boolean(date > todayStart);
  const lang = (typeof navigator === "object" && navigator.language) || "en-US";
  const formatter = new Intl.DateTimeFormat(lang, {
    day: dateIsToday ? undefined : "numeric",
    month: dateIsToday ? undefined : "long",

    hour: "numeric",
    minute: "numeric",
  });
  return formatter.format(date);
}
