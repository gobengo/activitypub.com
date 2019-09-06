import { asyncComponent } from "@jaredpalmer/after";
import React from "react";

export default [
  {
    component: asyncComponent({
      loader: () => import("./pages/HomePage"),
    }),
    exact: true,
    path: "/",
  },
  {
    component: asyncComponent({
      loader: () => import("./pages/InboxPage"),
    }),
    exact: true,
    path: "/inbox",
  },
];
