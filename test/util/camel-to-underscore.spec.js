import camelCaseToUnderscore from "../../src/util/camel-to-underscore";

describe("util#camelCaseToUnderscore", () => {
  it("should be a function", () => {
    expect(camelCaseToUnderscore).to.be.an("function");
  });

  it("should return a string", () => {
    expect(camelCaseToUnderscore("fooBar")).to.be.an("string");
  });

  it("should convert a camelCase string to an underscore case", () => {
    expect(camelCaseToUnderscore("fooBar")).to.equal("foo_bar");
  });

  it("should leave normal strings intact", () => {
    expect(camelCaseToUnderscore("foobar")).to.equal("foobar");
  });
});
