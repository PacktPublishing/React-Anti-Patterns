type ArticleType = { heading: string, summary: string };
const Article = ({heading, summary}: ArticleType) => {
  return <article>
    <h3>{heading}</h3>
    <p>{summary}</p>
  </article>
}

export default Article;