import { createContext } from "react";

type SearchableListContextType = {
  onSearch: (keyword: string) => void;
  onItemClicked: (id: string) => void;
};

const noop = () => {};

const SearchableListContext = createContext<SearchableListContextType>({
  onSearch: noop,
  onItemClicked: noop,
});

export { SearchableListContext };
