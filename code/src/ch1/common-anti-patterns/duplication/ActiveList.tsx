import List from "./List";

function ActiveList(props: { users: { isActive: boolean; name: string }[] }) {
  const filteredUsers = props.users.filter((user) => user.isActive);
  return <List items={filteredUsers} />;
}

export default ActiveList;
