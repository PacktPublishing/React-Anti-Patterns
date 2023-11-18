import '@testing-library/jest-dom';
import { render, screen } from "@testing-library/react";
import React from "react";
import App from "./App";

test("renders application", () => {
  render(<App />);

  const root = screen.getByTestId("applicationContainer");
  expect(root).toBeInTheDocument();
});
