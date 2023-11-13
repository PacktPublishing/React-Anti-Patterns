import {transformUser} from "./transformer";

export async function fetchUserData<T>(id: string) {
  const response = await fetch(`/api/users/${id}`);
  const rawData = await response.json();

  return transformUser(rawData) as T;
}