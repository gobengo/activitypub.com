import React from "react";
import ReactDOM from "react-dom";
import HomePage from "./HomePage";

describe("<HomePage />", () => {
  test("renders without exploding", () => {
    const div = document.createElement("div");
    ReactDOM.render(<HomePage />, div);
  });
});
