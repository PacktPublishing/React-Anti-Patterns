const quotes = [
  {
    content:
      "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
    author: "Martin Fowler",
  },
  {
    content: "Truth can only be found in one place: the code.",
    author: "Robert C. Martin",
  },
  {
    content:
      "Optimism is an occupational hazard of programming: feedback is the treatment.",
    author: "Kent Beck",
  },
];

describe("quote of the day", () => {
  it("display the heading", () => {
    cy.visit("https://icodeit-juntao.github.io/quote-of-the-day/");
    cy.contains("Quote of the day");
  });

  it("display a quote", () => {
    cy.visit("https://icodeit-juntao.github.io/quote-of-the-day/");
    cy.get('[data-testid="quote-container"]').should("have.length", 1);
  });

  it("display the quote content", () => {
    cy.intercept("GET", "https://api.quotable.io/quotes/random*", {
      statusCode: 200,
      body: quotes,
    });
    cy.visit("https://icodeit-juntao.github.io/quote-of-the-day/");
    cy.contains(
      "Any fool can write code that a computer can understand. Good programmers write code that humans can understand."
    );
    cy.contains("Martin Fowler");
  });
});
