import React, { useEffect, useState } from "react";
import { Toggleable } from "./types";

const withAutoClose =
  <T extends Partial<Toggleable>>(
    Component: React.FC<T>,
    duration: number = 2000
  ) =>
  (props: T) => {
    const [show, setShow] = useState<boolean>(true);

    useEffect(() => {
      if (show) {
        const timerId = setTimeout(() => setShow(false), duration);
        return () => clearTimeout(timerId);
      }
    }, [show]);

    return (
      <Component
        {...props}
        isOpen={show}
        toggle={() => setShow((show) => !show)}
      />
    );
  };

export default withAutoClose;
