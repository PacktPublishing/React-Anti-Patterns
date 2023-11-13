import React, { useEffect } from "react";
import "./App.css";
import { SearchResultItemType } from "./models/SearchResultItemType";
import { SearchCityInput } from "./search/SearchCityInput";
import {
  fetchCityWeatherData,
  useFetchCityWeather,
} from "./weather/useFetchCityWeather";
import { WeatherList } from "./weather/WeatherList";

function App() {
  const { cities, setCities, fetchCityWeather } = useFetchCityWeather();

  const onItemClick = (item: SearchResultItemType) => {
    setTimeout(() => {
      const items = JSON.parse(localStorage.getItem("favoriteItems") || "[]");

      const newItem = {
        name: item.city,
        lon: item.longitude,
        lat: item.latitude,
      };

      localStorage.setItem(
        "favoriteItems",
        JSON.stringify([newItem, ...items], null, 2)
      );
    }, 0);

    return fetchCityWeather(item);
  };

  useEffect(() => {
    const hydrate = async () => {
      const items = JSON.parse(localStorage.getItem("favoriteItems") || "[]");

      const promises = items.map((item: any) => {
        const searchResultItem = new SearchResultItemType(item);
        return fetchCityWeatherData(searchResultItem);
      });

      const cities = await Promise.all(promises);
      setCities(cities);
    };

    hydrate();
  }, []);

  return (
    <div className="app">
      <h1>Weather Application</h1>

      <SearchCityInput onItemClick={onItemClick} />

      <WeatherList cities={cities} />
    </div>
  );
}

export default App;
