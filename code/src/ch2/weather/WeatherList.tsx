import {WeatherType} from "./types";

const Weather = ({cityName, temperature, weather}: WeatherType) => {
  return (
    <div>
      <span>{cityName}</span>
      <span>{temperature}</span>
      <span>{weather}</span>
    </div>
  );
};
export const WeatherList = () => {
  return (
    <>
      <Weather cityName="Melbourne" temperature={4} weather="Windy"/>
      <Weather cityName="Beijing" temperature={24} weather="Clear"/>
    </>
  );
};