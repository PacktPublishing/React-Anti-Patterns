import '@testing-library/jest-dom';
import { SearchResultItemType } from "./SearchResultItemType";

describe("SearchResultItemType", () => {
  it("convert the remote type to local", () => {
    const remote = {
      country: "US",
      lat: 28.106471,
      local_names: {
        en: "Melbourne",
        ja: "メルボーン",
        ru: "Мельбурн",
        uk: "Мелборн",
      },
      lon: -80.6371513,
      name: "Melbourne",
      state: "Florida",
    };

    const model = new SearchResultItemType(remote);

    expect(model.city).toEqual("Melbourne");
    expect(model.state).toEqual("Florida");
    expect(model.country).toEqual("United States");
  });
});
