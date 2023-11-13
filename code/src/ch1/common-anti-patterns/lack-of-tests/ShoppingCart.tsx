import { useState } from "react";
import { Item } from "../../types";

function ShoppingCart() {
  const [items, setItems] = useState<Item[]>([]);

  const addItem = (item: Item) => {
    setItems([...items, item]);
  };

  const removeItem = (itemId: string) => {
    setItems(items.filter((item) => item.id !== itemId));
  };

  const calculateTotal = () => {
    return items.reduce((total, item) => total + item.price, 0);
  };

  return (
    <div>
      {/* Render items and controls for adding/removing */}
      <p>Total: ${calculateTotal()}</p>
    </div>
  );
}

export default ShoppingCart;
