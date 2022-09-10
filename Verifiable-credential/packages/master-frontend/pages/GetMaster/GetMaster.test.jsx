import React from "react";
import ReactDOM from "react-dom";
import { render, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import GetMaster from "./GetMaster";

describe("getMaster", () => {
  // eslint-disable-next-line jest/no-hooks
  beforeEach(() => {
    localStorage.clear();
  });

  // eslint-disable-next-line jest/no-hooks
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("renders without crashing", () => {
    expect.assertions(0);

    const div = document.createElement("div");
    ReactDOM.render(<GetMaster />, div);
    ReactDOM.unmountComponentAtNode(div);
  });

  it("should display a message if the VA has already been issued", () => {
    expect.assertions(1);

    localStorage.setItem("Master-VA-issued", "yes");

    const { container } = render(<GetMaster />);
    expect(container).toHaveTextContent("Your Master's Degree has been sent.");
  });

  it("should display an error if the request to /api/masters/verifiable-attestations fails", async () => {
    // Because of waitFor, we don't know exactly how many assertions there will be
    expect.hasAssertions();

    localStorage.setItem("Master-DID", "test");

    const { container } = render(<GetMaster />);

    // Mock error
    const mockErrorFetchPromise = Promise.resolve({
      status: 400,
    });
    const fetchSpy = jest
      .spyOn(global, "fetch")
      .mockImplementationOnce(() => mockErrorFetchPromise);

    // Submit
    const getMasterButton = container.querySelector("button[type=button]");
    fireEvent.click(getMasterButton);

    expect(container).toHaveTextContent("Sending request...");

    // Wait for request to finish
    await waitFor(() => expect(fetchSpy).toHaveBeenCalledTimes(1));
    expect(fetchSpy).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ did: "test" }),
      })
    );
  });

  it("should display a message if the request to /api/masters/verifiable-attestations succeeds", async () => {
    // Because of waitFor, we don't know exactly how many assertions there will be
    expect.hasAssertions();

    localStorage.setItem("Master-DID", "test");

    const { container } = render(<GetMaster />);

    // Mock error
    const mockErrorFetchPromise = Promise.resolve({
      status: 201,
    });
    const fetchSpy = jest
      .spyOn(global, "fetch")
      .mockImplementationOnce(() => mockErrorFetchPromise);

    // Submit
    const getMasterButton = container.querySelector("button[type=button]");
    fireEvent.click(getMasterButton);

    expect(container).toHaveTextContent("Sending request...");

    // Wait for request to finish
    await waitFor(() => expect(fetchSpy).toHaveBeenCalledTimes(1));
    expect(fetchSpy).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ did: "test" }),
      })
    );

    expect(container).toHaveTextContent("Your Master's Degree has been sent.");
  });
});
