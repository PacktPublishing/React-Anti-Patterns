import React from "react";
import {act, render, screen} from "@testing-library/react";
import { TermsAndConditions } from "../component/TermsAndConditions";
import userEvent from "@testing-library/user-event";

describe('Terms and Conditions', () => {
  it("renders learn react link", () => {
    render(<TermsAndConditions />);
    const button = screen.getByText('Next');
    expect(button).toBeDisabled();

    const checkbox = screen.getByRole('checkbox');

    act(() => {
      userEvent.click(checkbox);
    })

    expect(button).toBeEnabled();
  });
})
