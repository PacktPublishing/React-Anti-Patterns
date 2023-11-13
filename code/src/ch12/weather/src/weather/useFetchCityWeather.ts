import { useState } from "react";
import { CityWeather } from "../models/CityWeather";
import { SearchResultItemType } from "../models/SearchResultItemType";

export const fetchCityWeatherData = async (item: SearchResultItemType) => {
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${item.latitude}&lon=${item.longitude}&appid=91c8138e0d479b826ec6e9d617cf4c6c&units=metric`
  );
  const json = await response.json();
  return new CityWeather(json);
};

const useFetchCityWeather = () => {
  const [cities, setCities] = useState<CityWeather[]>([]);

  const fetchCityWeather = (item: SearchResultItemType) => {
    return fetchCityWeatherData(item).then((cityWeather) => {
      setCities([cityWeather, ...cities]);
    });
  };

  return {
    cities,
    setCities,
    fetchCityWeather,
  };
};

export { useFetchCityWeather };
