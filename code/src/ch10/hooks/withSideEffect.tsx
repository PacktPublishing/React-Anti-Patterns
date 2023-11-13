import React, { ReactNode } from "react";
import { useService } from "./useService";
import fetchPostById from "../../ch4/single-responsibilty-principle/fetchPostById";

const DefaultLoading = () => <div>Loading...</div>;
const DefaultError = () => <div>Error...</div>;

type WithChildren<T = {}> = T & { children?: ReactNode; data: any };

const withSideEffect =
  <T extends unknown>(
    fetchFunc: () => Promise<T>,
    Component: React.FC<WithChildren<T>>,
    Loading: React.FC = DefaultLoading,
    Error: React.FC = DefaultError
  ) =>
  (props: WithChildren<T>) => {
    const { loading, error, data } = useService(fetchFunc);

    if (loading) {
      return <Loading />;
    }

    if (error) {
      return <Error />;
    }

    return <Component {...props} data={data} />;
  };

type BlogPostType = { title: string; description: string };
const BlogPost = ({ data }: { data: BlogPostType }) => {
  return (
    <div>
      <h2>{data.title}</h2>
    </div>
  );
};

const fetchFunc = () => fetchPostById("blog-id");
withSideEffect(fetchFunc, BlogPost);

export default withSideEffect;
