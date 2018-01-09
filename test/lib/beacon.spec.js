import * as lib from "../../src/lib/beacon";

describe("Beacon", () => {
  describe("#objectToQuery", () => {
    it("should be a function", () => {
      expect(lib.objectToQuery).to.be.an("function");
    });

    it("should return a string", () => {
      expect(lib.objectToQuery({})).to.be.an("string");
    });

    it("should return empty string if no data passed", () => {
      expect(lib.objectToQuery({})).to.equal("");
    });

    it("should format data as query string", () => {
      expect(lib.objectToQuery({ foo: "bar" })).to.equal("?foo=bar");
      expect(lib.objectToQuery({ foo: "bar", baz: "bob" })).to.equal(
        "?foo=bar&baz=bob"
      );
    });
  });

  describe("#beacon", () => {
    beforeEach(() => {
      chai.spy.on(navigator, "sendBeacon");
    });

    afterEach(() => {
      navigator.sendBeacon.reset();
    });

    it("should be a function", () => {
      expect(lib.beacon).to.be.an("function");
    });

    it("should call navigator.sendBeacon", () => {
      lib.beacon("url", { foo: "bar" });
      expect(navigator.sendBeacon).to.have.been.called();
    });
  });
});
