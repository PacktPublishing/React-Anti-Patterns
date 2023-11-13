interface RemoteCityWeather {
  name: string;
  main: {
    temp: number;
    humidity: number;
  };
  weather: {
    main: string;
    description: string;
  }[];
  wind: {
    deg: number;
    speed: number;
  };
}

export type { RemoteCityWeather };
