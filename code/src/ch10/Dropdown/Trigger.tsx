import React from "react";

export const Trigger = ({
  text,
  onClick,
}: {
  text: string;
  onClick: () => void;
}) => {
  return (
    <div className="trigger" tabIndex={0} onClick={onClick}>
      <span className="selection">{text}</span>
      <span className="icon material-symbols-outlined">expand_more</span>
    </div>
  );
};
