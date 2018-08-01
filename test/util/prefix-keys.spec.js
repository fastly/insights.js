import lib from "../../src/util/prefix-keys";

describe("Prefix keys", () => {
  it("should be a function", () => {
    expect(lib).to.be.an("function");
  });

  it("should prefix all keys of an object with a given string", () => {
    const fixture = { foo: "bar" };
    const result = lib(fixture, "baz_");

    expect(result).to.have.property("baz_foo");
    expect(result).to.not.have.property("foo");
  });

  it("should not mutate the original object", () => {
    const fixture = Object.freeze({ foo: "bar" });
    expect(lib.bind(null, fixture, "baz_")).to.not.throw();
  });
});
