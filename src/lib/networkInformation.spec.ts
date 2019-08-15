import networkInformation from "./networkInformation";

const fixture = {
  effectiveconnectiontype: "2g"
};

describe("Network Information", (): void => {
  let connection: any;
  beforeEach((): void => {
    connection = window.navigator["connection"];
    Object.defineProperty(window.navigator, "connection", {
      writable: false,
      configurable: true,
      value: fixture
    });
  });

  afterEach((): void => {
    Object.defineProperty(window.navigator, "connection", {
      writable: false,
      configurable: true,
      value: connection
    });
  });

  it("should return a cloned network information object", (): void => {
    const result = networkInformation();
    expect(result).toEqual(fixture);
  });
});
