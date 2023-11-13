import { Product } from "../types";
import "./product.css";
import LineItem from "./LineItem";

const ProductList = ({
  products,
  addToCart,
}: {
  products: Product[];
  addToCart: (id: string) => void;
}) => (
  <div>
    <h2>Product List</h2>
    {products.map((product) => (
      <LineItem
        key={product.id}
        product={product}
        performAction={addToCart}
        label="Add to Cart"
      />
    ))}
  </div>
);

export default ProductList;
