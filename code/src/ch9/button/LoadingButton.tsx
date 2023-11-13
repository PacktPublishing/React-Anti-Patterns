import React from "react";
import Button from "./Button";
import { ButtonProps } from "../types";
import logo from "./logo.svg";
import "./style.css";

const LoadingButton = (props: ButtonProps) => {
  const { children, ...rest } = props;

  return (
    <Button {...rest}>
      <div className="loading-container">
        <div className="spinner">
          <img src={logo} alt="" />
        </div>
        {children}
      </div>
    </Button>
  );
};

export default LoadingButton;
