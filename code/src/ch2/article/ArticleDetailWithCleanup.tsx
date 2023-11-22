import { useEffect, useState } from "react";
import { ArticleType } from "./types";
import Article from "./Article";

const ArticleDetailWithCleanup = ({ id }: { id: string }) => {
  const [article, setArticle] = useState<ArticleType>();

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    const fetchArticleDetail = async (id: string) => {
      fetch(`/api/articles/${id}`, { signal })
        .then((res) => res.json())
        .then((data) => setArticle(data));
    };

    fetchArticleDetail(id);

    return () => {
      controller.abort();
    };
  }, [id]);

  return (
    <div>
      {article && (
        <Article heading={article.heading} summary={article.summary} />
      )}
    </div>
  );
};

export default ArticleDetailWithCleanup;
