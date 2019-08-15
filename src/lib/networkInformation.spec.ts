import networkInformation from "./networkInformation";

const mock = {
  effectiveType: "2g",
  onchange: (): void => {}
};

describe("Network Information", (): void => {
  let connection: any;
  beforeEach((): void => {
    connection = window.navigator["connection"];
    Object.defineProperty(window.navigator, "connection", {
      writable: false,
      configurable: true,
      value: mock
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
    expect(result).toEqual({ effectiveType: "2g" });
  });
});
