import React from "react";
import { ButtonProps } from "../types";
import logo from "./logo.svg";
import "./style.css";

const withLoading =
  (Component: React.FC<ButtonProps>) => (props: ButtonProps) => {
    const { children, ...rest } = props;

    return (
      <Component {...rest}>
        <div className="loading-container">
          <div className="spinner">
            <img src={logo} alt="" />
          </div>
          {children}
        </div>
      </Component>
    );
  };

export default withLoading;
