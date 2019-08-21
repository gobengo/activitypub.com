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
      loader: () => import("./pages/SamplePage"),
    }),
    exact: true,
    path: "/sample",
  },
  {
    component: asyncComponent({
      loader: () => import("./pages/StreamPage"),
    }),
    exact: true,
    path: "/stream",
  },
];
