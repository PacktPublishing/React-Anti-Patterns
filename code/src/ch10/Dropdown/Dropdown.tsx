import React, { RefObject, useCallback } from "react";
import "./Dropdown.css";
import { Item } from "./types";
import { useDropdown } from "./useDropdown";
import { DropdownMenu } from "./DropdownMenu";
import { useService } from "./useService";
import Loading from "./Loading/Loading";
import Error from "./Error/Error";
import { fetchUsers } from "./fetchUsers";
import { Trigger } from "./Trigger";

const Dropdown = () => {
  const { data, loading, error } = useService(fetchUsers);

  const {
    toggleDropdown,
    dropdownRef,
    isOpen,
    selectedItem,
    selectedIndex,
    updateSelectedItem,
    getAriaAttributes,
  } = useDropdown<Item>(data || []);

  const renderContent = useCallback(() => {
    if (loading) return <Loading />;
    if (error) return <Error />;
    if (data) {
      return (
        <DropdownMenu
          items={data}
          updateSelectedItem={updateSelectedItem}
          selectedIndex={selectedIndex}
        />
      );
    }
    return null;
  }, [data, error, loading, selectedIndex, updateSelectedItem]);

  return (
    <div
      className="dropdown"
      ref={dropdownRef as RefObject<HTMLDivElement>}
      {...getAriaAttributes()}
    >
      <Trigger
        onClick={toggleDropdown}
        text={selectedItem ? selectedItem.text : "Select an item..."}
      />
      {isOpen && renderContent()}
    </div>
  );
};

export default Dropdown;
