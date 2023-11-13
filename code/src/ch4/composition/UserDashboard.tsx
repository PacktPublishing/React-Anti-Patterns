import { UserDashboardProps } from "./types";
import { UserProfile } from "./UserProfile";
import { FriendList } from "./FriendList";
import { PostList } from "./PostList";

function UserDashboard({ user, posts }: UserDashboardProps) {
  return (
    <div>
      <UserProfile user={user} />
      <FriendList friends={user.friends} />
      <PostList posts={posts} />
    </div>
  );
}

export default UserDashboard;
