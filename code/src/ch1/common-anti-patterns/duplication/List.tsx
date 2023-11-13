const List = ({ items }: { items: { name: string }[] }) => {
  return (
    <ul>
      {items.map((item) => (
        <li>{item.name}</li>
      ))}
    </ul>
  );
};

export default List;
