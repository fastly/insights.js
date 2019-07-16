import prefixKeys from "./prefixKeys";

describe("Prefix keys", (): void => {
  it("should prefix all keys of an object with a given string", (): void => {
    const fixture = { foo: "bar" };
    const result = prefixKeys(fixture, "baz_");

    expect(result).toHaveProperty("baz_foo");
    expect(result).not.toHaveProperty("foo");
  });

  it("should not mutate the original object", (): void => {
    const fixture = Object.freeze({ foo: "bar" });
    expect(prefixKeys.bind(null, fixture, "baz_")).not.toThrow();
  });
});
