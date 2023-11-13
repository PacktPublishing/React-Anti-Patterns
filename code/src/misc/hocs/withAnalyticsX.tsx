import React, { ReactNode, useEffect } from "react";

type WithChildren<T = {}> = T & { children?: ReactNode };

const withAnalyticsX =
  <T extends {}>(Component: React.FC<WithChildren<T>>) =>
  (props: WithChildren<T>) => {
    const { children, ...rest } = props;

    const now = performance.now();

    useEffect(() => {
      const later = performance.now();
      console.log(`The initial rendering took: ${later - now} ms`);
    }, []);

    return <Component {...(rest as T)}>{children}</Component>;
  };

export default withAnalyticsX;
