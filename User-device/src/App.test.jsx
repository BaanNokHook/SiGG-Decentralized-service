import React from "react";
import ReactDOM from "react-dom";
import App from "./App";

describe("app", () => {
  it("renders without crashing", () => {
    expect.assertions(0);

    const div = document.createElement("div");
    ReactDOM.render(<App />, div);
    ReactDOM.unmountComponentAtNode(div);
  });
});
