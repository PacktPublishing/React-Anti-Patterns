import React from "react";
import { IMenuItem } from "../models/IMenuItem";
import { useShoppingCart } from "../hooks/useShoppingCart";

const navigate = (route: string) => {};

export const ShoppingCart = ({ cartItems }: { cartItems: IMenuItem[] }) => {
  const { totalPrice, totalDiscount, placeOrder } = useShoppingCart(cartItems);

  const handleClick = () => {
    placeOrder().then(() => navigate("/order-status"));
  };

  return (
    <div data-testid="shopping-cart" className="shopping-cart">
      <h2>Shopping Cart</h2>
      <ol>
        {cartItems.map((item) => (
          <li key={item.id}>
            <h3>{item.name}</h3>
            <span>${item.price}</span>
          </li>
        ))}
      </ol>
      <div className="number">Total Discount: ${totalDiscount}</div>
      <div className="number">Total: ${totalPrice - totalDiscount}</div>
      <button disabled={cartItems.length === 0} onClick={handleClick}>
        Place My Order
      </button>
    </div>
  );
};
