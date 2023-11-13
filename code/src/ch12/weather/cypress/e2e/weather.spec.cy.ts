import searchResults from "../fixtures/search-result.json";

describe("weather application", () => {
  it("shows the application title", () => {
    cy.visit("http://localhost:3000/");
    cy.contains("Weather Application");
  });

  it("search for a city", () => {
    cy.intercept("GET", "https://api.openweathermap.org/geo/1.0/direct?q=*", {
      statusCode: 200,
      body: searchResults,
    });

    cy.visit("http://localhost:3000/");

    cy.get('[data-testid="search-input"]').type("Melbourne");
    cy.get('[data-testid="search-input"]').type("{enter}");

    cy.get('[data-testid="search-results"] .search-result').should(
      "have.length",
      5
    );
  });

  it("adds city to favorite list", () => {
    cy.intercept("GET", "https://api.openweathermap.org/geo/1.0/direct?q=*", {
      statusCode: 200,
      body: searchResults,
    });

    cy.intercept("GET", "https://api.openweathermap.org/data/2.5/weather*", {
      fixture: "melbourne.json",
    }).as("getWeather");

    cy.visit("http://localhost:3000/");

    cy.get('[data-testid="search-input"]').type("Melbourne");
    cy.get('[data-testid="search-input"]').type("{enter}");

    cy.get('[data-testid="search-results"] .search-result').first().click();

    cy.get('[data-testid="favorite-cities"] .city').should("have.length", 1);

    cy.get(
      '[data-testid="favorite-cities"] .city:contains("Melbourne")'
    ).should("exist");
    cy.get('[data-testid="favorite-cities"] .city:contains("20°C")').should(
      "exist"
    );
  });

  afterEach(() => {
    // Cleanup: Clear localStorage again to ensure no side effects between tests
    cy.clearLocalStorage();
  });

  it("fetches data when initialising when possible", () => {
    const items = [
      {
        name: "Melbourne",
        lat: -37.8142,
        lon: 144.9632,
      },
    ];

    cy.window().then((window: any) => {
      window.localStorage.setItem(
        "favoriteItems",
        JSON.stringify(items, null, 2)
      );
    });

    cy.intercept("GET", "https://api.openweathermap.org/data/2.5/weather*", {
      fixture: "melbourne.json",
    }).as("getWeather");

    cy.visit("http://localhost:3000/");

    cy.get('[data-testid="favorite-cities"] .city').should("have.length", 1);

    cy.get(
      '[data-testid="favorite-cities"] .city:contains("Melbourne")'
    ).should("exist");
    cy.get('[data-testid="favorite-cities"] .city:contains("20°C")').should(
      "exist"
    );
  });
});
