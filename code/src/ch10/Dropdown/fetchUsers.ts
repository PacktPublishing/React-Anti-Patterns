export const fetchUsers = async () => {
  const response = await fetch(
    "https://gist.githubusercontent.com/abruzzi/3dcb7424d635817b2de9323469dfdca3/raw/72a7ce509ebf3fc19982db1f00d95d8aef80dbc9/users.json"
  );

  if (!response.ok) {
    const error = await response.json(); // assume the response body has error info
    throw new Error(`Error: ${error.error || response.status}`);
  }

  return await response.json();
};