import { RemoteCityWeather } from "./RemoteCityWeather";

export class CityWeather {
  private readonly _name: string;
  private readonly _main: string;
  private readonly _temp: number;

  constructor(weather: RemoteCityWeather) {
    this._name = weather.name;
    this._temp = weather.main.temp;
    this._main = weather.weather[0].main;
  }

  get name() {
    return this._name;
  }

  get degree() {
    return Math.ceil(this._temp);
  }

  get temperature() {
    if (this._temp == null) {
      return "-/-";
    }
    return `${Math.ceil(this._temp)}°C`;
  }

  get main() {
    return this._main.toLowerCase();
  }
}
