import { useEffect, useState } from "react";

type User = {
  name: string;
  age: number;
  address: string;
};

type RemoteUser = {
  firstName: string;
  lastName: string;
  age: number;
  addressLine1: string;
  city: string;
  country: string;
};

function UserProfile({ userId }: { userId: string }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    fetch(`/api/users/${userId}`)
      .then((response) => response.json())
      .then((data: RemoteUser) => {
        // Transforming data right inside the component
        const transformedUser = {
          name: `${data.firstName} ${data.lastName}`,
          age: data.age,
          address: `${data.addressLine1}, ${data.city}, ${data.country}`,
        };
        setUser(transformedUser);
      });
  }, [userId]);

  return (
    <div>
      {user && (
        <>
          <p>Name: {user.name}</p>
          <p>Age: {user.age}</p>
          <p>Address: {user.address}</p>
        </>
      )}
    </div>
  );
}

export default UserProfile;
