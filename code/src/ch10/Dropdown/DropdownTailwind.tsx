import "tailwindcss/tailwind.css";
import { useDropdown } from "./useDropdown";
import { Item } from "../types";
import React, { RefObject } from "react";
import { useService } from "./useService";
import { fetchUsers } from "./fetchUsers";

const DropdownTailwind = () => {
  const { data: items, loading, error } = useService<Item[] | null>(fetchUsers);

  const {
    isOpen,
    toggleDropdown,
    selectedIndex,
    selectedItem,
    updateSelectedItem,
    getAriaAttributes,
    dropdownRef,
  } = useDropdown<Item>(items || []);

  return (
    <div
      className="relative"
      onClick={toggleDropdown}
      ref={dropdownRef as RefObject<HTMLDivElement>}
      {...getAriaAttributes()}
    >
      <button className="btn p-2 border rounded min-w-[240px]" tabIndex={0}>
        {selectedItem ? selectedItem.text : "Select an item..."}
      </button>

      {isOpen && (
        <ul
          className="dropdown-menu bg-white shadow-sm rounded mt-2 absolute w-full min-w-[240px]"
          role="listbox"
        >
          {(items || []).map((item, index) => (
            <li
              key={index}
              role="option"
              aria-selected={index === selectedIndex}
              onClick={() => updateSelectedItem(item)}
              className={`p-2 border-b border-gray-200 flex items-center ${
                index === selectedIndex ? "bg-gray-100" : ""
              } hover:bg-blue-100`}
            >
              <div className="flex flex-col">
                <span className="text">{item.text}</span>
                <span className="text-sm text-gray-500">
                  {item.description}
                </span>
              </div>
              <img
                src={item.icon}
                alt={item.text}
                className="w-8 h-8 ml-auto rounded border-2 border-red-500"
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DropdownTailwind;
