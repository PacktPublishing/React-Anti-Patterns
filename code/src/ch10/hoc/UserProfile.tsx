import React, { useEffect, useState } from "react";
import { checkAuthorization } from "./withAuthorization";

const Login = () => <div>Login</div>;

const UserProfile = ({ name, email }: { name: string; email: string }) => {
  const [isAuthorized, setIsAuthorized] = useState(checkAuthorization());

  useEffect(() => {
    const id = setTimeout(() => {
      setIsAuthorized(false);
    }, 120 * 1000);

    return () => {
      clearTimeout(id);
    };
  });

  return isAuthorized ? (
    <div>
      <h3>{name}</h3>
      <p>{email}</p>
    </div>
  ) : (
    <Login />
  );
};

export default UserProfile;
