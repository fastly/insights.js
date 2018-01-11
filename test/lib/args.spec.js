import * as lib from "../../src/lib/args.js";
const id = Date.now().toString();

describe("Args", () => {
  before(() => {
    const script = document.createElement("script");
    script.src = `/fastly.js?id=${id}`;
    script.setAttribute("id", "fastlyjs");
    document.body.appendChild(script);
  });

  after(() => {
    const script = document.getElementById("fastlyjs");
    document.body.removeChild(script);
  });

  describe("#parse", () => {
    it("should return an object", () => {
      expect(lib.parse()).to.be.an("object");
    });

    it("should parse query string arguments passed to script", () => {
      expect(lib.parse().id).to.be.an("string");
      expect(lib.parse().id).to.equal(id);
    });
  });
});
