import React from "react";
import { BrowserRouter } from "react-router-dom";
import { render } from "@testing-library/react";
import { ToastSiGG } from "./ToastSiGG";
import colors from "../../config/colors";

describe("SiGG toast", () => {
  it("should render without crashing", () => {
    expect.assertions(1);
    const method = jest.fn();
    const wrapper = render(
      <BrowserRouter>
        <ToastSiGG
          isToastOpen
          toastColor={colors.EC_RED}
          colorText={colors.WHITE}
          toastMessage="Message"
          methodToClose={method}
        />
      </BrowserRouter>
    );

    expect(wrapper).toBeDefined();
  });
});
