import { createContext } from "react";
import { Item } from "./types";

type SearchableListContextType = {
  onSearch: (keyword: string) => void;
  onItemClicked: (item: Item) => void;
};

const noop = () => {};

const SearchableListContext = createContext<SearchableListContextType>({
  onSearch: noop,
  onItemClicked: noop,
});

export { SearchableListContext };
