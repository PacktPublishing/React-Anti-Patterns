import React, { ChangeEvent, useState } from "react";
import "./search.css";

const SearchInput = ({
  performSearch,
}: {
  performSearch: (key: string) => void;
}) => {
  const [value, setValue] = useState<string>("");

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setValue(value);
    performSearch(value);
  };

  return (
    <div className="searchBox">
      <input
        type="text"
        onChange={onChange}
        value={value}
        placeholder="Type to search..."
      />
    </div>
  );
};

export { SearchInput };
