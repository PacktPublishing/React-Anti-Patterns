import {ChangeEvent, useState} from "react";

export const SearchBox = () => {
  const [query, setQuery] = useState<string>("");
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
  };

  return (
    <div className="search-box">
      <input type="text" value={query} onChange={handleChange}/>
      <button>Search</button>
      <div className="search-results">{query}</div>
    </div>
  );
};