import React, { ChangeEvent, useContext, useState } from "react";
import { SearchableListContext } from "./SearchableListContext";
import { Item } from "./types";

const ListItem = ({ item }: { item: Item }) => {
  const { onItemClicked } = useContext(SearchableListContext);

  return (
    <li onClick={() => onItemClicked(item)}>
      <h2>{item.name}</h2>
      <p>{item.description}</p>
    </li>
  );
};

const List = ({ items }: { items: Item[] }) => {
  return (
    <section data-testid="searchable-list">
      <ul>
        {items.map((item) => (
          <ListItem item={item} />
        ))}
      </ul>
      <footer>Total items: {items.length}</footer>
    </section>
  );
};

const SearchInput = ({ onSearch }: { onSearch: (keyword: string) => void }) => {
  const { onSearch: providedOnSearch } = useContext(SearchableListContext);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onSearch(e.target.value);
    providedOnSearch(e.target.value);
  };

  return <input type="text" onChange={handleChange} />;
};

type SearchableListProps = {
  items: Item[];
  onSearch: (keyword: string) => void;
  onItemClicked: (item: Item) => void;
};

const SearchableList = ({
  items,
  onSearch,
  onItemClicked,
}: SearchableListProps) => {
  const [filteredItems, setFilteredItems] = useState<Item[]>(items);

  const handleSearch = (keyword: string) => {
    setFilteredItems(items.filter((item) => item.name.includes(keyword)));
  };

  return (
    <SearchableListContext.Provider value={{ onSearch, onItemClicked }}>
      <SearchInput onSearch={handleSearch} />
      <List items={filteredItems} />
    </SearchableListContext.Provider>
  );
};

export default SearchableList;
