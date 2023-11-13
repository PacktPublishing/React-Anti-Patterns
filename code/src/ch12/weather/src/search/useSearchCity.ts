import { RemoteSearchResultItem } from "../models/RemoteSearchResultItem";
import { SearchResultItemType } from "../models/SearchResultItemType";
import { useState } from "react";

const useSearchCity = () => {
  const [query, setQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<SearchResultItemType[]>(
    []
  );
  const [isDropdownOpen, setDropdownOpen] = useState<boolean>(false);

  const fetchCities = () => {
    fetch(
      `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=91c8138e0d479b826ec6e9d617cf4c6c`
    )
      .then((r) => r.json())
      .then((cities) => {
        setSearchResults(
          cities.map(
            (item: RemoteSearchResultItem) => new SearchResultItemType(item)
          )
        );
        openDropdownList();
      });
  };

  const openDropdownList = () => setDropdownOpen(true);
  const closeDropdownList = () => setDropdownOpen(false);

  return {
    fetchCities,
    setQuery,
    searchResults,
    isDropdownOpen,
    openDropdownList,
    closeDropdownList,
  };
};

export { useSearchCity };
