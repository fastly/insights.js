import Lib from "../../../src/lib/performance-observer/entry-list";

const fixture = [
  {
    name: "http://example.com/1",
    type: "resource"
  },
  {
    name: "http://example.com/2",
    type: "resource"
  },
  {
    name: "MyMark",
    type: "mark"
  }
];

describe("IntervalPerformanceObserverEntryList", () => {
  let list;

  beforeEach(() => {
    list = new Lib(fixture);
  });

  afterEach(() => {
    list = null;
  });

  it("should be a function", () => {
    expect(Lib).to.be.a("function");
  });

  it("should return a class", () => {
    expect(list).to.be.an.instanceOf(Lib);
  });

  describe("#getEntries", () => {
    it("should return an array", () => {
      expect(list.getEntries()).to.be.an("array");
    });

    it("should return all entries in the list", () => {
      expect(list.getEntries()).to.have.length(3);
      expect(list.getEntries()).to.equal(fixture);
    });
  });

  describe("#getEntriesByType", () => {
    it("should return an array", () => {
      expect(list.getEntriesByType()).to.be.an("array");
    });

    it("should return all entries in the list matching the given type", () => {
      const result = list.getEntriesByType("resource");
      expect(result).to.have.length(2);
      expect(result).to.deep.equal([fixture[0], fixture[1]]);
    });
  });

  describe("#getEntriesByName", () => {
    it("should return an array", () => {
      expect(list.getEntriesByName()).to.be.an("array");
    });

    it("should return all entries in the list matching the given name", () => {
      const result = list.getEntriesByName("http://example.com/1");
      expect(result).to.have.length(1);
      expect(result).to.deep.equal([fixture[0]]);
    });

    it("should return all entries in the list matching the given name and type", () => {
      const result = list.getEntriesByName("MyMark", "mark");
      expect(result).to.have.length(1);
      expect(result).to.deep.equal([fixture[2]]);
    });
  });
});
