import {RemoteUser, User, UserSubscription} from "../types";

export const transformUser = (remoteUser: RemoteUser): User => {
  return {
    id: remoteUser.user_identification ?? 'N/A',
    name: remoteUser.user_full_name ?? 'Unknown User',
    isPremium: remoteUser.is_premium_user ?? false,
    subscription: (remoteUser.subscription_details?.level ?? 'Basic') as UserSubscription,
    expire: remoteUser.subscription_details?.expiry ?? 'Never',
  };
};