import { Item } from "./types";
import React from "react";

const MenuItem = ({ item }: { item: Item }) => {
  return (
    <>
      <img src={item.icon} alt={item.text} />
      <div className="details">
        <div>{item.text}</div>
        <small>{item.description}</small>
      </div>
    </>
  );
};
export const DropdownMenu = ({
  items,
  selectedIndex,
  updateSelectedItem,
}: {
  items: Item[];
  selectedIndex: number;
  updateSelectedItem: (item: Item) => void;
}) => {
  return (
    <div className="dropdown-menu" role="listbox">
      {(items || []).map((item, index) => (
        <div
          role="option"
          aria-selected={index === selectedIndex}
          key={index}
          onClick={() => updateSelectedItem(item)}
          className={`item-container ${
            index === selectedIndex ? "highlighted" : ""
          }`}
        >
          <MenuItem item={item} />
        </div>
      ))}
    </div>
  );
};
