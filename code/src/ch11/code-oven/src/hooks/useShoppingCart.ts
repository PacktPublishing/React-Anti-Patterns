import { IMenuItem } from "../models/IMenuItem";
import { useMemo } from "react";

export const useShoppingCart = (items: IMenuItem[]) => {
  const totalPrice = useMemo(
    () => items.reduce((acc, item) => (acc += item.price), 0),
    [items]
  );

  const totalDiscount = useMemo(
    () => items.reduce((acc, item) => (acc += item.calculateDiscount()), 0),
    [items]
  );

  const placeOrder = async () => {
    const url = "https://api.code-oven.com/orders";

    const payload = {
      items: items,
      totalPrice,
      totalDiscount,
    };

    const result = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    return result.json();
  };

  return {
    items,
    totalPrice,
    totalDiscount,
    placeOrder,
  };
};
