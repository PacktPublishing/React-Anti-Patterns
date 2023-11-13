import React from "react";
import { User } from "../types";

function UserProfile({ user }: { user: User }) {
  const fullName = user && user.name ? user.name : "Loading…";
  const subscriptionLevel =
    user && user.subscription ? user.subscription : "Basic";
  const subscriptionExpiry = user && user.expire ? user.expire : "Never";

  return (
    <div>
      <h1>{fullName}</h1>
      <p>Subscription Level: {subscriptionLevel}</p>
      <p>Subscription Expiry: {subscriptionExpiry}</p>
    </div>
  );
}

export { UserProfile };
