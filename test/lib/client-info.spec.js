import lookupFixture from "../fixtures/lookup";
import * as lib from "../../src/lib/client-info";

const urlFixture = "https://www.test.com/lookup";

describe("Client info", () => {
  let mock;

  before(() => {
    mock = fetchMock.get({
      name: "lookup-host",
      method: "get",
      times: 1,
      response: {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        },
        body: lookupFixture
      },
      matcher: /lookup/
    });
  });

  afterEach(() => {
    lib.reset(urlFixture);
    mock.reset();
  });

  after(() => {
    fetchMock.restore();
  });

  describe("#get", () => {
    it("should be a function", () => {
      expect(lib.get).to.be.an("function");
    });

    it("should fetch client information from the lookup service", () =>
      lib.get(urlFixture).then(() => {
        expect(mock.done("lookup-host")).to.be.true;
      }));

    it("should memoize the first call and return cached response", () =>
      lib
        .get(urlFixture)
        .then(() => lib.get(urlFixture))
        .then(() => {
          expect(mock.done("lookup-host")).to.be.true;
        }));
  });

  describe("#normalizeResponse", () => {
    it("should be a function", () => {
      expect(lib.normalizeResponse).to.be.an("function");
    });

    it("should return an object", () => {
      const result = lib.normalizeResponse({ foo: "bar" });
      expect(result).to.be.an("object");
    });

    it("should parse asn strings to intergers", () => {
      const result = lib.normalizeResponse(lookupFixture);
      expect(result.client_asn).to.be.a("number");
      expect(result.resolver_asn).to.be.a("number");
    });
  });
});
