import React, { useEffect, useState } from "react";
import { User } from "../types";
import { transformUser } from "../acl/transformer";

async function fetchUserData<T>(id: string) {
  const response = await fetch(`/api/users/${id}`);
  const rawData = await response.json();

  return transformUser(rawData) as T;
}

function UserProfile({ id }: { id: string }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    async function fetchUser() {
      const response = await fetchUserData<User>(id);
      setUser(response);
    }

    fetchUser();
  }, [id]);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div data-testid="user-profile">
      <h1>{user.name}</h1>
    </div>
  );
}

export { UserProfile };
