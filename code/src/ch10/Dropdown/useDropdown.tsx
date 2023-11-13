import React, { useEffect, useRef, useState } from "react";

const getNextIndexOf = (total: number) => (current: number) => {
  if (current === total - 1) {
    return 0;
  } else {
    return current + 1;
  }
};

const getPreviousIndexOf = (total: number) => (current: number) => {
  if (current === 0) {
    return total - 1;
  } else {
    return current - 1;
  }
};

export const useDropdown = <T extends { text: string }>(items: T[]) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const [selectedItem, setSelectedItem] = useState<T | null>(null);

  const getAriaAttributes = () => ({
    role: "combobox",
    "aria-expanded": isOpen,
    "aria-activedescendant": selectedItem ? selectedItem.text : undefined,
  });

  const getNextIndex = getNextIndexOf(items.length);
  const getPreviousIndex = getPreviousIndexOf(items.length);

  const dropdownRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "Enter":
        case " ":
          e.preventDefault();
          setSelectedItem(items[selectedIndex]);
          setIsOpen((isOpen) => !isOpen);
          break;
        case "ArrowDown":
          e.preventDefault();
          setSelectedIndex(getNextIndex);
          break;
        case "ArrowUp":
          e.preventDefault();
          setSelectedIndex(getPreviousIndex);
          break;
        case "Home":
          e.preventDefault();
          setSelectedIndex(0);
          break;
        case "End":
          e.preventDefault();
          setSelectedIndex(items.length - 1);
          break;
        case "Escape":
          e.preventDefault();
          setIsOpen(false);
          if (dropdownRef.current) {
            dropdownRef.current.blur();
          }
          break;
        default:
          break;
      }
    };

    if (dropdownRef.current) {
      dropdownRef.current.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      if (dropdownRef.current) {
        dropdownRef.current.removeEventListener("keydown", handleKeyDown);
      }
    };
  }, [dropdownRef, getNextIndex, getPreviousIndex, items, selectedIndex]);

  const toggleDropdown = () => {
    setIsOpen((isOpen) => !isOpen);
  }

  const updateSelectedItem = (item: T) => {
    setSelectedItem(item);
    setSelectedIndex(items.indexOf(item));
    setIsOpen(false);
  };

  return {
    isOpen,
    toggleDropdown,
    selectedIndex,
    selectedItem,
    dropdownRef,
    updateSelectedItem,
    getAriaAttributes,
  };
};
