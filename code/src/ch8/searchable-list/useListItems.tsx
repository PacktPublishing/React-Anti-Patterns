import {Item} from "./types";
import {useState} from "react";

export const useListItems = (items: Item[]) => {
  const [listItems, setListItems] = useState<Item[]>(items);

  const performSearch = (key: string) => {
    if (key === "") {
      setListItems(items);
    }

    setListItems(
      items.filter(
        (item) => item.name.includes(key) || item.description.includes(key)
      )
    );
  };

  return {
    listItems,
    performSearch,
  };
};