import { useState } from "react";
import { Item } from "./type";
import { ShoppingCartProvider } from "./ShoppingCartContext";

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
const ShoppingApplication = () => {
  const [cart, setCart] = useState<Item[]>([]);

  const addItemToCart = (item: Item) => {
    setCart([...cart, { ...item, uniqKey: `${item.id}-${Date.now()}` }]);
  };

  const removeItemFromCart = (key: string) => {
    setCart(cart.filter((item) => item.uniqKey !== key));
  };

  const totalPrice = cart.reduce((total, item) => total + item.price, 0);

  return (
    <div>
      <ShoppingCartProvider>
        <div>hello</div>
      </ShoppingCartProvider>

      <ProductList addToCart={addItemToCart} />

      <h2>Shopping Cart</h2>
      <ul>
        {cart.map((item) => (
          <li key={item.uniqKey}>
            {item.name} - {item.price}
            <button onClick={() => removeItemFromCart(item.uniqKey ?? item.id)}>
              Remove
            </button>
          </li>
        ))}
      </ul>
      <p>Total Price: {totalPrice}</p>
    </div>
  );
};


export default ShoppingApplication;
