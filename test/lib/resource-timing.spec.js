import * as lib from "../../src/lib/resource-timing";
import fixture from "../fixtures/timing";
import {
  rewire as performanceObserverRewire,
  restore as performanceObserverRestore
} from "../../src/lib/performance-observer";

describe("Resource timing", () => {
  describe("#asyncGetEntry", () => {
    let observerInstanceMock;
    const performanceObserverMock = chai.spy(function(callback) {
      observerInstanceMock = {
        observe: chai.spy(() => {
          callback(
            {
              getEntriesByName() {
                return [fixture];
              }
            },
            observerInstanceMock
          );
        }),
        disconnect: chai.spy(() => {})
      };
      return observerInstanceMock;
    });

    before(() => {
      performanceObserverRewire(performanceObserverMock);
    });

    afterEach(() => {
      performanceObserverMock.reset();
      if (observerInstanceMock) {
        observerInstanceMock.observe.reset();
        observerInstanceMock.disconnect.reset();
      }
    });

    after(() => performanceObserverRestore());

    it("should be a function", () => {
      expect(lib.asyncGetEntry).to.be.a("function");
    });

    it("should return a promise", () => {
      expect(lib.asyncGetEntry("")).to.be.a("promise");
    });

    it("should create an instance of PerformanceObserver", () =>
      lib.asyncGetEntry(fixture.name).then(() => {
        const callback = performanceObserverMock.__spy.calls[0][0];
        expect(performanceObserverMock).to.have.been.called.once;
        expect(callback).to.be.a("function");
      }));

    it("should get the names entry from the observed entry list", () =>
      expect(lib.asyncGetEntry(fixture.name)).to.eventually.equal(fixture));

    it("should call disconnect on the observer once an entry is found", () =>
      lib.asyncGetEntry(fixture.name).then(() => {
        expect(observerInstanceMock.disconnect).to.have.been.called.once;
      }));

    it("should call #observe on the observer to start oberservation", () =>
      lib.asyncGetEntry(fixture.name).then(() => {
        expect(observerInstanceMock.observe).to.have.been.called.once;
        const args = observerInstanceMock.observe.__spy.calls[0][0];
        expect(args).to.be.an("object");
        expect(args).to.have.property("entryTypes");
        expect(args.entryTypes).to.deep.equal(["resource"]);
      }));
  });

  describe("#cloneEntry", () => {
    it("should be a function", () => {
      expect(lib.cloneEntry).to.be.an("function");
    });

    it("should return an Object", () => {
      expect(lib.cloneEntry(fixture)).to.be.an("object");
    });

    it("should return a clone of the entry", () => {
      expect(lib.cloneEntry(fixture)).to.not.equal(fixture);
    });

    it("should only return number and string properties", () => {
      const fixt = { num: 123, str: "foo", func: a => a, arr: [] };
      const result = lib.cloneEntry(fixt);
      expect(result).to.have.property("num");
      expect(result).to.have.property("str");
      expect(result).to.not.have.property("func");
      expect(result).to.not.have.property("arr");
    });
  });

  describe("#removeEntryProps", () => {
    it("should be a function", () => {
      expect(lib.removeEntryProps).to.be.an("function");
    });

    it("should return an Object", () => {
      expect(lib.removeEntryProps(fixture, [])).to.be.an("object");
    });

    it("should return a new object", () => {
      expect(lib.removeEntryProps(fixture, [])).to.not.equal(fixture);
    });

    it("should return an without the given properties", () => {
      const result = lib.removeEntryProps(fixture, ["name"]);
      expect(result).to.not.have.property("name");
    });
  });

  describe("#mormalizeEntry", () => {
    let result;

    beforeEach(() => {
      result = lib.normalizeEntry(fixture);
    });

    afterEach(() => {
      result = null;
    });

    it("should be a function", () => {
      expect(lib.normalizeEntry).to.be.an("function");
    });

    it("should return an object", () => {
      expect(lib.normalizeEntry(fixture)).to.be.an("object");
    });

    it("should remove exteraneous keys", () => {
      expect(result).to.not.have.property("name");
      expect(result).to.not.have.property("entryType");
      expect(result).to.not.have.property("entry_type");
    });

    it("should normalize entry keys to underscore case", () => {
      expect(result).to.not.have.property("workerStart");
      expect(result).to.have.property("worker_start");
    });
  });
});
