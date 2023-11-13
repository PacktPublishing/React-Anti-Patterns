type Item = { id: string; name: string };

function SearchableList({
  items,
  onItemClick,
}: {
  items: Item[];
  onItemClick: (id: string) => void;
}) {
  return (
    <div className="searchable-list">
      {/* Potentially some search functionality here */}
      <List items={items} onItemClick={onItemClick} />
    </div>
  );
}

function List({
  items,
  onItemClick,
}: {
  items: Item[];
  onItemClick: (id: string) => void;
}) {
  return (
    <ul className="list">
      {items.map((item) => (
        <ListItem key={item.id} data={item} onItemClick={onItemClick} />
      ))}
    </ul>
  );
}

function ListItem({
  data,
  onItemClick,
}: {
  data: Item;
  onItemClick: (id: string) => void;
}) {
  return (
    <li className="list-item" onClick={() => onItemClick(data.id)}>
      {data.name}
    </li>
  );
}

export default SearchableList;
