import { Product } from "../types";
import LineItem from "./LineItem";

const Cart = ({
  cartItems,
  removeFromCart,
}: {
  cartItems: Product[];
  removeFromCart: (id: string) => void;
}) => (
  <div>
    <h2>Shopping Cart</h2>
    {cartItems.map((item) => (
      <LineItem
        key={item.id}
        product={item}
        performAction={removeFromCart}
        label="Remove from Cart"
      />
    ))}
  </div>
);

export default Cart;
