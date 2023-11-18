import React from "react";
import '@testing-library/jest-dom';
import { render, screen } from "@testing-library/react";

import { Section } from "../component/Section";

describe("Section", () => {
  it("renders a section with heading and content", () => {
    render(<Section heading="Basic" content="Hello world" />);

    expect(screen.getByText("Basic")).toBeInTheDocument();
    expect(screen.getByText("Hello world")).toBeInTheDocument();
  });
});
