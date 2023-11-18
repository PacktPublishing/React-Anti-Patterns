import { render, screen } from "@testing-library/react";
import '@testing-library/jest-dom';
import { SearchResultItem } from "./SearchResultItem";
import { SearchResultItemType } from "../models/SearchResultItemType";

describe("search result item", () => {
  it("shows a city name, the state, and the country", () => {
    render(
      <SearchResultItem
        item={
          new SearchResultItemType({
            country: "AU",
            lat: -37.8141705,
            lon: 144.9655616,
            name: "Melbourne",
            state: "Victoria",
          })
        }
        onItemClick={() => {}}
      />
    );
    expect(screen.getByText("Melbourne")).toBeInTheDocument();
    expect(screen.getByText("Victoria")).toBeInTheDocument();
    expect(screen.getByText("Australia")).toBeInTheDocument();
  });
});
