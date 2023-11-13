import React, { ChangeEvent, FormEvent, useCallback, useState } from "react";

const ArticleEditor = ({ id }: { id: string }) => {
  const submitChange = useCallback(
    async (summary: string) => {
      try {
        // Make a POST request to update the article item
        await fetch(`/api/articles/${id}`, {
          method: "POST",
          body: JSON.stringify({ id, summary }),
          headers: {
            "Content-Type": "application/json",
          },
        });
      } catch (error) {
        // handling errors
      }
    },
    [id]
  );

  return (
    <div>
      <ArticleForm onSubmit={submitChange} />
    </div>
  );
};

const ArticleForm = ({ onSubmit }: { onSubmit: (summary: string) => void }) => {
  const [summary, setSummary] = useState<string>("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(summary);
  };

  const handleSummaryChange = useCallback(
    (event: ChangeEvent<HTMLTextAreaElement>) => {
      setSummary(event.target.value);
    },
    []
  );

  return (
    <form onSubmit={handleSubmit}>
      <h2>Edit Article</h2>
      <textarea value={summary} onChange={handleSummaryChange} />
      <button type="submit">Save</button>
    </form>
  );
};


export default ArticleEditor;
