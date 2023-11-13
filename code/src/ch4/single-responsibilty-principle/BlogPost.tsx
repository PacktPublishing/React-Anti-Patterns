import React from "react";
import { useFetchPost } from "./useFetchPost";
import { LikeButton } from "./LikeButton";

const BlogPost = ({ id }: { id: string }) => {
  const post = useFetchPost(id);

  return (
    <div>
      <h2>{post.title}</h2>
      <p>{post.summary}</p>
      <LikeButton />
    </div>
  );
};

export default BlogPost;
