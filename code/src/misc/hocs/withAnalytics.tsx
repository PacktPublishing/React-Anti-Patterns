import { ButtonProps } from "../../ch9/types";
import React from "react";

const withAnalytics =
  (Component: React.FC<ButtonProps>) => (props: ButtonProps) => {
    const { onClick = () => {}, children, ...rest } = props;

    const clickHandler = () => {
      const now = performance.now();
      onClick();
      const later = performance.now();
      console.log(`The action took: ${later - now} ms`);
    };

    return (
      <Component {...rest} onClick={clickHandler}>
        {children}
      </Component>
    );
  };

export default withAnalytics;
