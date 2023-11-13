import { Weather } from "./Weather";
import React from "react";
import { CityWeather } from "../models/CityWeather";

const WeatherList = ({ cities }: { cities: CityWeather[] }) => {
  return (
    <div data-testid="favorite-cities" className="favorite-cities">
      {cities.map((city) => (
        <Weather key={city.name} cityWeather={city} />
      ))}
    </div>
  );
};

export { WeatherList };
