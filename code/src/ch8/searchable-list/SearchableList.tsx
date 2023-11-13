import React from "react";
import { SearchInput } from "./SearchInput";
import { Item } from "./types";
import { List } from "./List";
import { useListItems } from "./useListItems";
import { SearchableListContext } from "./SearchableListContext";

type SearchableListProps = {
  items: Item[];
  onSearch?: (keyword: string) => void;
  onItemClicked?: (id: string) => void;
};

const noop = () => {};

const SearchableList = ({
  items,
  onSearch = noop,
  onItemClicked = noop,
}: SearchableListProps) => {
  const { listItems, performSearch } = useListItems(items);

  return (
    <SearchableListContext.Provider
      value={{ onSearch: onSearch, onItemClicked: onItemClicked }}
    >
      <div>
        <SearchInput performSearch={performSearch} />
        <List items={listItems} />
      </div>
    </SearchableListContext.Provider>
  );
};

export { SearchableList };
