export type RemoteUser = {
  user_identification: string;
  user_full_name: string;
  is_premium_user: boolean;
  subscription_details: {
    level: string;
    expiry: string;
  }
}
export type UserSubscription = "Basic" | "Standard" | "Premium" | "Enterprise";
export type User = {
  id: string;
  name: string;
  isPremium: boolean;
  subscription: UserSubscription;
  expire: string;
};