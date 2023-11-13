import { CityWeather } from "../models/CityWeather";
import React from "react";

import './weather.css';

const Weather = ({ cityWeather }: { cityWeather: CityWeather | undefined }) => {
  if (cityWeather) {
    return (
      <div className="city weather-container">
        <h3>{cityWeather.name}</h3>
        <div className="details">
          <span className="temperature">{cityWeather.temperature}</span>
          <div className="weather">
            <span className="weather-category">{cityWeather.main}</span>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export { Weather };
