import {useCallback, useContext} from "react";

import InteractionContext, {
  InteractionMeasurement
} from "./InteractionContext";

interface ButtonType {
  name: string;
  onClick: (e: any) => void;
  children: React.ReactNode
}

const Button = ({ name, onClick: providedOnClick, children }: ButtonType) => {
  const interactionContext = useContext<InteractionMeasurement | null>(
    InteractionContext
  );

  const handleClick = useCallback(
    (e: any) => {
      interactionContext && interactionContext.measure(name, e.timeStamp);
      providedOnClick(e);
    },
    [providedOnClick, interactionContext, name]
  );

  return <button onClick={handleClick}>{children}</button>;
};

export default Button;