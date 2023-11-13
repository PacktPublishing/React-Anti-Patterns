import React from "react";
import { ButtonProps } from "../types";

const noop = () => {};

const Button = ({
  onClick = noop,
  children,
  disabled = false,
}: ButtonProps) => {
  return (
    <button disabled={disabled} onClick={onClick}>
      {children}
    </button>
  );
};

export default Button;
