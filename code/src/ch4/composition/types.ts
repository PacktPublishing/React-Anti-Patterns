export type User = {
  name: string;
  avatar: string;
  friends: string[];
};
export type Post = {
  author: string;
  summary: string;
};
export type UserDashboardProps = {
  user: User;
  posts: Post[];
};