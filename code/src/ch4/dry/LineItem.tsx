import { Product } from "../types";

const LineItem = ({
  product,
  performAction,
  label,
}: {
  product: Product;
  performAction: (id: string) => void;
  label: string;
}) => {
  const { id, image, name, price } = product;

  return (
    <div key={id} className="product">
      <img src={image} alt={name} />
      <div>
        <h2>{name}</h2>
        <p>${price}</p>
        <button onClick={() => performAction(id)}>{label}</button>
      </div>
    </div>
  );
};

export default LineItem;
