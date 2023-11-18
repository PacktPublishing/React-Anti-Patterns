import React from "react";
import '@testing-library/jest-dom';
import { render, screen } from "@testing-library/react";
import { TermsAndConditions } from "../component/TermsAndConditions";
import userEvent from "@testing-library/user-event";

describe("Terms and Conditions", () => {
  it("renders learn react link", async () => {
    render(<TermsAndConditions />);
    const button = screen.getByText("Next");
    expect(button).toBeDisabled();

    const checkbox = screen.getByRole("checkbox");

    await userEvent.click(checkbox);

    expect(button).toBeEnabled();
  });
});
