import { useMenuItems } from "../hooks/useMenuItems";
import React from "react";
import { IMenuItem } from "../models/IMenuItem";
import { SpecialDiscountStrategy } from "../models/strategy/SpecialDiscountStrategy";

function isTodayFriday(): boolean {
  const today = new Date();
  return today.getDay() === 3;
}

export const MenuList = ({
  onAddMenuItem,
}: {
  onAddMenuItem: (item: IMenuItem) => void;
}) => {
  const { menuItems } = useMenuItems();

  const handleAddMenuItem = (item: IMenuItem) => {
    if (isTodayFriday()) {
      item.discountStrategy = new SpecialDiscountStrategy();
    }

    onAddMenuItem(item);
  };

  return (
    <div data-testid="menu-list" className="menu-list ">
      <ol>
        {menuItems.map((item) => (
          <li key={item.id}>
            <h3>{item.name}</h3>
            <span>${item.price}</span>
            <div>
              {item.ingredients.map((ingredient) => (
                <span>{ingredient}</span>
              ))}
            </div>
            <button onClick={() => handleAddMenuItem(item)}>Add</button>
          </li>
        ))}
      </ol>
    </div>
  );
};
