import React from "react";
import "./App.css";
import ShoppingApplicationNew from "./ch9/CQRS/ShoppingApplicationNew";
import { ShoppingCartProvider } from "./ch9/CQRS/ShoppingCartContext";

function App() {
  return (
    <div className="app">
      <ShoppingCartProvider>
        <ShoppingApplicationNew />
      </ShoppingCartProvider>
    </div>
  );
}

export default App;
