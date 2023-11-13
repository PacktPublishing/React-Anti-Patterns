import React, { useState } from "react";
import "./App.css";
import { MenuList } from "./views/MenuList";
import { ShoppingCart } from "./views/ShoppingCart";
import { IMenuItem } from "./models/IMenuItem";

function App() {
  const [cartItems, setCartItems] = useState<IMenuItem[]>([]);

  const addItem = (item: IMenuItem) => {
    setCartItems([...cartItems, item]);
  };

  return (
    <>
      <h1>The Code Oven</h1>
      <div className="main">
        <MenuList onAddMenuItem={addItem} />
        <ShoppingCart cartItems={cartItems} />
      </div>
    </>
  );
}

export default App;
