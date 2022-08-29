import React from "react";
import { BrowserRouter } from "react-router-dom";
import { render } from "@testing-library/react";
import Banner from "./Banner";

describe("banner", () => {
  it("should render without crashing", () => {
    expect.assertions(1);
    const wrapper = render(
      <BrowserRouter>
        <Banner title="Title" subtitle="Subtitle" isLoadingOpen />
      </BrowserRouter>
    );

    expect(wrapper).toBeDefined();
  });
});
