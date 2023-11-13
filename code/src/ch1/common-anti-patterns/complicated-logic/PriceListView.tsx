import { Item } from "../../types";

function PriceListView({ items }: { items: Item[] }) {
  // Business logic within the view
  const filterExpensiveItems = (items: Item[]) => {
    return items.filter((item) => item.price > 100);
  };

  const expensiveItems = filterExpensiveItems(items);

  return (
    <div>
      {expensiveItems.map((item) => (
        <div key={item.id}>
          {item.name}: ${item.price}
        </div>
      ))}
    </div>
  );
}

export default PriceListView;
