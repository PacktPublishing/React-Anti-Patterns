export interface RemoteSearchResultItem {
  name: string;
  state: string;
  country: string;

  lon: number;
  lat: number;

  local_names?: {
    [key: string]: string
  }
}