import List from "./List";

function AdminList(props: { users: { isAdmin: boolean; name: string }[] }) {
  const filteredUsers = props.users.filter((user) => user.isAdmin);
  return <List items={filteredUsers} />;
}

export default AdminList;
