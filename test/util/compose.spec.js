import lib from "../../src/util/compose";

const multiply10 = n => n * 10;
const add4 = n => n + 4;
const subtract2 = n => n - 2;

describe("Util#compose", () => {
  it("should be a function", () => {
    expect(lib).to.be.an("function");
  });

  it("should return a function", () => {
    expect(lib(add4, subtract2)).to.be.an("function");
  });

  it("should compose functions", () => {
    const func = lib(subtract2, add4, multiply10);
    expect(func(4)).to.equal(42);
  });
});
