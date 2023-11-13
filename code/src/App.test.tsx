import React from "react";
import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders learn react link", () => {
  render(<App />);
  const linkElement = screen.getByText(/My application/i);
  // @ts-ignore
  expect(linkElement).toBeInTheDocument();
});
