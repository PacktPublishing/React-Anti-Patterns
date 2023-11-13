import { add } from "./math";

describe("calculator", () => {
  describe("addition", () => {
    it("adds positive numbers correctly", () => {
      // @ts-ignore
      expect(add(1, 2)).toBe(3);
    });

    it("adds negative numbers correctly", () => {
      // @ts-ignore
      expect(add(-1, -2)).toBe(-3);
    });

    // More tests...
  });

  describe("subtraction", () => {
    it("subtracts positive numbers", () => {});
  });

  // Other describe blocks for multiplication and division
});
