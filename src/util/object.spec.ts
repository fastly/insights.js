import { hasProperty, hasProperties } from "./object";

describe("hasProperty", (): void => {
  it("should assert whether an object has a property", (): void => {
    const obj = { foo: "bar" };
    expect(hasProperty(obj, "foo")).toBeTruthy();
    expect(hasProperty(obj, "baz")).toBeFalsy();
  });
});

describe("hasProperties", (): void => {
  it("should test whether an object contains all properties from a list", (): void => {
    const obj = { foo: "bar", baz: { qux: 1 } };
    const validFeatures = ["foo", "baz"];
    const invalidFeatures = ["bar", "qux"];

    expect(hasProperties(obj, validFeatures)).toBeTruthy();
    expect(hasProperties(obj, invalidFeatures)).toBeFalsy();
  });
});
