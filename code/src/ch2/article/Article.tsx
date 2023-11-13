import { ArticleType } from "./types";
import React, { useContext } from "react";
import ThemeContext from "../theme/ThemeContext";

import "./article.css";

const Article = ({ heading, summary }: ArticleType) => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <article className={theme}>
      <h3>{heading}</h3>
      <p>{summary}</p>
      <button onClick={toggleTheme}>Toggle</button>
    </article>
  );
};

export default Article;


