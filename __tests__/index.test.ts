import { greet } from "../src/index";

describe("greet function", () => {
  it("should return the greeting message with the given name", () => {
    const name = "John";
    const expected = "Hello, John!";
    const result = greet(name);
    expect(result).toBe(expected);
  });

  it("should return an empty string if no name is provided", () => {
    const name = "";
    const expected = "Hello, !";
    const result = greet(name);
    expect(result).toBe(expected);
  });
});
