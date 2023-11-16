import React from "react";
import { PanelProps } from "./types";

import useAutoClose from "./useAutoClose";
import useKeyboard from "./useKeyboard";

const ExpandablePanel = ({ heading, content }: PanelProps) => {
  const { isOpen, toggle } = useAutoClose(2000);
  const { handleKeyDown } = useKeyboard(toggle);

  return (
    <article onKeyDown={handleKeyDown} tabIndex={0}>
      <header onClick={toggle}>{heading}</header>
      {isOpen && <section>{content}</section>}
    </article>
  );
};

export default ExpandablePanel;
