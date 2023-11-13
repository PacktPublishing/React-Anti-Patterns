import {Item} from "./types";
import React, {useContext} from "react";
import {SearchableListContext} from "./SearchableListContext";

export const List = ({items}: { items: Item[] }) => {
  const { onItemClicked } = useContext(SearchableListContext);
  const handleClick = (id: string) => {
    onItemClicked(id);
  };

  return (
    <ol>
      {items.map((item) => (
        <li key={item.id}>
          <h3>{item.name}</h3>
          <p>{item.description}</p>
          <button onClick={() => handleClick(item.id)}>Select</button>
        </li>
      ))}
    </ol>
  );
};