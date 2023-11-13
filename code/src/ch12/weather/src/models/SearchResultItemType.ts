import type { RemoteSearchResultItem } from "./RemoteSearchResultItem";

const countryMap = {
  AU: "Australia",
  US: "United States",
  GB: "United Kingdom",
};

class SearchResultItemType {
  private readonly _city: string;
  private readonly _state: string;
  private readonly _country: string;
  private readonly _lat: number;
  private readonly _long: number;

  constructor(item: RemoteSearchResultItem) {
    this._city = item.name;
    this._state = item.state;
    this._country = item.country;
    this._lat = item.lat;
    this._long = item.lon;
  }

  get city() {
    return this._city;
  }

  get state() {
    return this._state;
  }

  get country() {
    // @ts-ignore
    return countryMap[this._country] || this._country;
  }

  get latitude() {
    return this._lat;
  }

  get longitude() {
    return this._long;
  }
}

export { SearchResultItemType };
