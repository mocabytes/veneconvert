import { parseNumber } from "../parseNumber";

describe("parseNumber", () => {
  it("parses integers", () => {
    expect(parseNumber("10")).toBe(10);
    expect(parseNumber("0")).toBe(0);
  });

  it("parses dot decimals", () => {
    expect(parseNumber("2.5")).toBe(2.5);
  });

  it("normalizes comma decimals", () => {
    expect(parseNumber("1,5")).toBe(1.5);
    expect(parseNumber("3,25")).toBe(3.25);
  });

  it("trims surrounding whitespace", () => {
    expect(parseNumber("  3,25  ")).toBe(3.25);
  });

  it("returns NaN for empty strings", () => {
    expect(parseNumber("")).toBeNaN();
  });

  it("returns NaN for non-numeric input", () => {
    expect(parseNumber("abc")).toBeNaN();
  });
});
