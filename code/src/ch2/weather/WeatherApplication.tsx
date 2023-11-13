import { Notification } from "./Notification";
import { SearchBox } from "./SearchBox";
import { WeatherList } from "./WeatherList";
import { Heading } from "./Heading";

const WeatherApplication = () => {
  return (
    <>
      <Heading title="Weather" />
      <SearchBox />
      <Notification />
      <WeatherList />
    </>
  );
};

export default WeatherApplication;
