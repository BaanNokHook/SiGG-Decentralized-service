import React from "react";
import ReactDOM from "react-dom";
import { render, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import ApplyMaster from "./ApplyMaster";

describe("applyMaster", () => {
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
    ReactDOM.render(<ApplyMaster />, div);
    ReactDOM.unmountComponentAtNode(div);
  });

  it("should display a message if the VA has already been issued", () => {
    expect.assertions(1);

    localStorage.setItem("Master-VA-requested", "yes");

    const { container } = render(<ApplyMaster />);
    expect(container).toHaveTextContent("Your application has been sent.");
  });

  it("should display an error if the request to /api/masters/verifiable-attestations fails", async () => {
    // Because of waitFor, we don't know exactly how many assertions there will be
    expect.hasAssertions();

    localStorage.setItem("Master-DID", "test");

    const { container } = render(<ApplyMaster />);

    // Mock error
    const mockErrorFetchPromise = Promise.resolve({
      status: 400,
    });
    const fetchSpy = jest
      .spyOn(global, "fetch")
      .mockImplementationOnce(() => mockErrorFetchPromise);

    // Submit
    const applyMasterButton = container.querySelector("button[type=button]");
    fireEvent.click(applyMasterButton);

    expect(container).toHaveTextContent("Sending request...");

    // Wait for request to finish
    await waitFor(() => expect(fetchSpy).toHaveBeenCalledTimes(1));
    expect(fetchSpy).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({
          redirectURL: "http://localhost/get-master",
          did: "test",
        }),
      })
    );
  });

  it("should display a message if the request to /api/masters/verifiable-attestations succeeds", async () => {
    // Because of waitFor, we don't know exactly how many assertions there will be
    expect.hasAssertions();

    localStorage.setItem("Master-DID", "test");

    const { container } = render(<ApplyMaster />);

    // Mock error
    const mockErrorFetchPromise = Promise.resolve({
      status: 201,
    });
    const fetchSpy = jest
      .spyOn(global, "fetch")
      .mockImplementationOnce(() => mockErrorFetchPromise);

    // Submit
    const applyMasterButton = container.querySelector("button[type=button]");
    fireEvent.click(applyMasterButton);

    expect(container).toHaveTextContent("Sending request...");

    // Wait for request to finish
    await waitFor(() => expect(fetchSpy).toHaveBeenCalledTimes(1));
    expect(fetchSpy).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({
          redirectURL: "http://localhost/get-master",
          did: "test",
        }),
      })
    );

    expect(container).toHaveTextContent("Your application has been sent.");
  });
});
