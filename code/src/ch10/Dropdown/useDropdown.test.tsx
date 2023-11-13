import { renderHook, act, render, screen } from "@testing-library/react";
import { useDropdown } from "./useDropdown";
import React, { RefObject } from "react";
import userEvent from "@testing-library/user-event";

const items = [{ text: "Apple" }, { text: "Orange" }, { text: "Banana" }];

const SimpleDropdown = () => {
  const {
    isOpen,
    toggleDropdown,
    selectedIndex,
    selectedItem,
    updateSelectedItem,
    getAriaAttributes,
    dropdownRef,
  } = useDropdown(items);

  return (
    <div
      tabIndex={0}
      ref={dropdownRef as RefObject<HTMLDivElement>}
      {...getAriaAttributes()}
    >
      <button onClick={toggleDropdown}>Select</button>
      <p data-testid="selected-item">{selectedItem?.text}</p>
      {isOpen && (
        <ul role="listbox">
          {items.map((item, index) => (
            <li
              key={index}
              role="option"
              aria-selected={index === selectedIndex}
              onClick={() => updateSelectedItem(item)}
            >
              {item.text}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
describe("useDropdown hook", () => {
  describe("state management", () => {
    it("should handle dropdown open/close state", () => {
      const { result } = renderHook(() => useDropdown(items));

      expect(result.current.isOpen).toBe(false);

      act(() => {
        result.current.toggleDropdown();
      });

      expect(result.current.isOpen).toBe(true);

      act(() => {
        result.current.toggleDropdown();
      });

      expect(result.current.isOpen).toBe(false);
    });

    it("should handle item selection", () => {
      const { result } = renderHook(() => useDropdown(items));

      expect(result.current.selectedItem).toBeNull();
      expect(result.current.selectedIndex).toBe(-1);

      const itemToSelect = items[1];
      act(() => {
        result.current.updateSelectedItem(itemToSelect);
      });

      expect(result.current.selectedItem).toEqual(itemToSelect);
      expect(result.current.selectedIndex).toBe(1);
      expect(result.current.isOpen).toBe(false);
    });
  });

  describe("event handlers", () => {
    it("trigger to toggle", async () => {
      render(<SimpleDropdown />);

      const trigger = screen.getByRole("button");

      expect(trigger).toBeInTheDocument();

      await userEvent.click(trigger);

      const list = screen.getByRole("listbox");
      expect(list).toBeInTheDocument();

      await userEvent.click(trigger);

      expect(list).not.toBeInTheDocument();
    });

    it("select item by keyboard", async () => {
      render(<SimpleDropdown />);

      const trigger = screen.getByRole("button");

      expect(trigger).toBeInTheDocument();

      await userEvent.click(trigger);

      const dropdown = screen.getByRole("combobox");
      dropdown.focus();

      await userEvent.type(dropdown, "{arrowdown}");
      await userEvent.type(dropdown, "{enter}");

      await expect(screen.getByTestId("selected-item")).toHaveTextContent(
        items[0].text
      );
    });
  });
});
