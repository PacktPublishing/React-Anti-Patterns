import React from "react";
import { render, screen } from "@testing-library/react";
import App from "./App";

describe("weather application", () => {
  it("shows page title", () => {
    render(<App />);
    expect(screen.getByText("Weather Application")).toBeInTheDocument();
  });
});
