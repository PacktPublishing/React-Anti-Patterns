import {User} from "./types";

export const UserProfile = ({user}: { user: User }) => {
  return (
    <>
      <h1>{user.name}</h1>
      <img src={user.avatar} alt="profile"/>
    </>
  );
};