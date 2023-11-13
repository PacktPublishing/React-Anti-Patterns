import {PostType} from "./types";
import {useEffect, useState} from "react";
import fetchPostById from "./fetchPostById";

const EmptyBlogPost = {
  id: "",
  title: "A title",
  summary: "A short summary of a title",
};
export const useFetchPost = (id: string): PostType => {
  const [post, setPost] = useState<PostType>(EmptyBlogPost);

  useEffect(() => {
    // @ts-ignore
    fetchPostById(id).then((post) => setPost(post));
  }, [id]);

  return post;
};