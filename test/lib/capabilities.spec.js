import lib from "../../src/lib/capabilities.js";

describe("Capabilities", () => {
  it("should return an Object", () => {
    expect(lib).to.be.an("object");
  });

  it("should test for performance timing support", () => {
    expect(lib.hasTimings).to.be.an("boolean");
    expect(lib.hasTimings).to.be.true;
  });

  it("should test for sendBeacon support", () => {
    expect(lib.hasTimings).to.be.an("boolean");
    expect(lib.hasTimings).to.be.true;
  });

  it("should test for existence for Fastly Perf cookie", () => {
    expect(lib.hasRanRecently).to.be.an("boolean");
    expect(lib.hasRanRecently).to.be.false;
  });

  it("should test document protocol", () => {
    expect(lib.isHTTP).to.be.an("boolean");
    expect(lib.isHTTP).to.be.true;
  });
});
