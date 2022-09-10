import React from "react";
import ReactDOM from "react-dom";
import NoMatch from "./NoMatch";

describe("no match", () => {
  it("renders without crashing", () => {
    expect.assertions(0);

    const div = document.createElement("div");
    ReactDOM.render(<NoMatch />, div);
    ReactDOM.unmountComponentAtNode(div);
  });
});
