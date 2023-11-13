import withSideEffect from "../ch10/hooks/withSideEffect";

const UserList = ({ data }: { data: any[] }) => {
  return (
    <ol>
      {data && data.map((x) => (
        <li key={x.id}>{x.name}</li>
      ))}
    </ol>
  );
};

const fetchUsers = async () => {
  const req = await fetch(
    "https://gist.githubusercontent.com/abruzzi/3dcb7424d635817b2de9323469dfdca3/raw/dbb41e82b7be19980e235ee90595014299efc8f8/users.json"
  );
  return await req.json();
};

export default withSideEffect(fetchUsers, UserList);
