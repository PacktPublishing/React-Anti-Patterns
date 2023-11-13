import { SearchResultItemType } from "../models/SearchResultItemType";
import { useSearchCity } from "./useSearchCity";
import React, { ChangeEvent, KeyboardEvent } from "react";
import { SearchResultItem } from "./SearchResultItem";

export const SearchCityInput = ({
  onItemClick,
}: {
  onItemClick: (item: SearchResultItemType) => void;
}) => {
  const {
    fetchCities,
    setQuery,
    isDropdownOpen,
    closeDropdownList,
    searchResults,
  } = useSearchCity();

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      fetchCities();
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) =>
    setQuery(e.target.value);

  const handleItemClick = (item: SearchResultItemType) => {
    onItemClick(item);
    closeDropdownList();
  };

  return (
    <>
      <div className="search-bar">
        <input
          type="text"
          data-testid="search-input"
          onKeyDown={handleKeyDown}
          onChange={handleChange}
          placeholder="Enter city name (e.g. Melbourne, New York)"
        />
      </div>

      {isDropdownOpen && (
        <div className="search-results-popup">
          {searchResults.length > 0 && (
            <ul data-testid="search-results" className="search-results">
              {searchResults.map((item, index) => (
                <SearchResultItem
                  key={index}
                  item={item}
                  onItemClick={handleItemClick}
                />
              ))}
            </ul>
          )}
        </div>
      )}
    </>
  );
};
