import { ButtonProps } from "../types";
import Button from "./Button";
import React, { useEffect } from "react";

const AnalyticsButton = (props: ButtonProps) => {
  const now = performance.now();

  useEffect(() => {
    const later = performance.now();
    console.log(`The action took: ${later - now} ms`);
  }, [now]);

  return <Button {...props} />;
};

export default AnalyticsButton;
