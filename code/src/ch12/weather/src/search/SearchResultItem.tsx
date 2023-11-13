import React from "react";
import { SearchResultItemType } from "../models/SearchResultItemType";

export const SearchResultItem = ({
  item,
  onItemClick,
}: {
  item: SearchResultItemType;
  onItemClick: (item: SearchResultItemType) => void;
}) => {
  return (
    <li className="search-result" onClick={() => onItemClick(item)}>
      <span className="city">{item.city}</span>
      <span className="state">{item.state}</span>
      <span className="country">{item.country}</span>
    </li>
  );
};
