import { generateId as lib } from "../../src/lib/unique-id";

const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;

describe("Unique ID", () => {
  it("should be a function", () => {
    expect(lib).to.be.an("function");
  });

  it("should return a string", () => {
    expect(lib()).to.be.an("string");
  });

  it("should generate a v4 UUID", () => {
    expect(lib()).to.match(uuidRegex);
  });

  it("should be unique between invocations", () => {
    expect(lib()).to.not.equal(lib());
  });
});
