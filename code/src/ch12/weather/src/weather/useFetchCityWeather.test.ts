import '@testing-library/jest-dom';
import { useFetchCityWeather } from "./useFetchCityWeather";
import { act, renderHook, waitFor } from "@testing-library/react";
import { SearchResultItemType } from "../models/SearchResultItemType";

import fetchMock from "jest-fetch-mock";

const searchResultItem = new SearchResultItemType({
  country: "AU",
  lat: -37.8141705,
  lon: 144.9655616,
  name: "Melbourne",
  state: "Victoria",
});

const weatherAPIResponse = JSON.stringify({
  main: {
    temp: 20.0,
  },
  name: "Melbourne",
  weather: [
    {
      description: "clear sky",
      main: "Clear",
    },
  ],
});

describe("fetchCityWeather function", () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  it("returns a list of cities", async () => {
    fetchMock.mockResponseOnce(weatherAPIResponse);

    const { result } = renderHook(() => useFetchCityWeather());

    await act(async () => {
      await result.current.fetchCityWeather(searchResultItem);
    });

    await waitFor(() => {
      expect(result.current.cities.length).toEqual(1);
      // eslint-disable-next-line testing-library/no-wait-for-multiple-assertions
      expect(result.current.cities[0].name).toEqual("Melbourne");
    });
  });
});
