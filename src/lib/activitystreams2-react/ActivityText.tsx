import { Activity } from "activitystreams2";
import React from "react";

/**
 * ActivityText.
 * Render an Activity as text.
 */
export default (props: { activity: Activity }) => {
  const author = props.activity.actor;
  return <>{author}</>;
};
