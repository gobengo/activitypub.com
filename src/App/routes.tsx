import { asyncComponent } from "@jaredpalmer/after";
import React from "react";

export default [
  {
    component: asyncComponent({
      loader: () => import("./pages/HomePage"), // required
    }),
    exact: true,
    path: "/",
  },
  {
    component: asyncComponent({
      loader: () => import("./pages/SamplePage"), // required
    }),
    exact: true,
    path: "/sample",
  },
];
