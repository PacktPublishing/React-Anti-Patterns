import React from "react";

export const checkAuthorization = () => {
  //checking local storage or send request to remote
  return false;
};

const Login = () => <div>Login</div>;

const withAuthorization = (Component: React.FC): React.FC => {
  return (props: any) => {
    const isAuthorized = checkAuthorization();
    return isAuthorized ? <Component {...props} /> : <Login />;
  };
};

export default withAuthorization;
