import React, { useContext } from "react";
import {
  ShoppingCartContext,
  ShoppingCartProvider,
  useTotalPrice,
} from "./ShoppingCartContext";
import { Item } from "./type";

const items: Item[] = [
  {
    id: "p1",
    name: "iPad",
    price: 666,
  },
  {
    id: "p2",
    name: "iPhone",
    price: 777,
  },
];

const ProductList = ({ addToCart }: { addToCart: (item: Item) => void }) => {
  return (
    <div>
      <h2>Product List</h2>
      <ul>
        {items.map((item) => (
          <li key={item.id}>
            {item.name}: {item.price}
            <button onClick={() => addToCart(item)}>Add to Card</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

const ShoppingApplicationNew = () => {
  const context = useContext(ShoppingCartContext);
  const { items, addItem, removeItem } = context;
  const totalPrice = useTotalPrice();

  return (
    <div>
      <ProductList addToCart={addItem} />

      <h2>Shopping Cart</h2>
      <ul>
        {items.map((item) => (
          <li key={item.uniqKey}>
            {item.name} - {item.price}
            <button onClick={() => removeItem(item)}>Remove</button>
          </li>
        ))}
      </ul>
      <p>Total Price: {totalPrice}</p>
    </div>
  );
};

export default ShoppingApplicationNew;
