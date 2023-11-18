import '@testing-library/jest-dom';
import { CityWeather } from "./CityWeather";

describe("CityWeather", () => {
  it("convert the remote type to local", () => {
    const remote = {
      main: {
        humidity: 56,
        pressure: 1009,
        temp: 20.0,
      },
      name: "Melbourne",
      weather: [
        {
          description: "clear sky",
          main: "Clear",
        },
      ],
      wind: {
        deg: 30,
        speed: 5.66,
      },
    };

    const model = new CityWeather(remote);

    expect(model.name).toEqual("Melbourne");
    expect(model.temperature).toEqual("20°C");
    expect(model.main).toEqual("clear");
  });

  it("convert the remote type to local - round up temperature", () => {
    const remote = {
      main: {
        humidity: 56,
        pressure: 1009,
        temp: 20.2,
      },
      name: "Melbourne",
      weather: [
        {
          description: "clear sky",
          main: "Clear",
        },
      ],
      wind: {
        deg: 30,
        speed: 5.66,
      },
    };

    const model = new CityWeather(remote);

    expect(model.temperature).toEqual("21°C");
  });
});
