import arrayFrom from "core-js/library/fn/array/from";

import Lib from "../../../src/lib/performance-observer/task-queue";
import PerformanceObserverEntryList from "../../../src/lib/performance-observer/entry-list";
import entriesFixture from "../../fixtures/resource-timing-entries";

const windowContextFixture = {
  performance: {
    getEntries() {
      return entriesFixture;
    }
  }
};

const observersFixture = new Set([
  {
    entryTypes: ["resource"],
    buffer: new Set(),
    callback() {}
  },
  {
    entryTypes: ["mark"],
    buffer: new Set(),
    callback() {}
  },
  {
    entryTypes: ["resource"],
    buffer: new Set(),
    callback() {}
  }
]);

describe("PerformanceObserverTaskQueue", () => {
  let lib;

  beforeEach(() => {
    chai.spy.on(windowContextFixture.performance, "getEntries");
    lib = new Lib({ context: windowContextFixture });
  });

  afterEach(() => {
    windowContextFixture.performance.getEntries.reset();
    lib = null;
  });

  it("should be a function", () => {
    expect(Lib).to.be.an("function");
  });

  it("should return a class", () => {
    expect(new Lib()).to.be.an.instanceOf(Lib);
  });

  describe("#getNewEntries", () => {
    it("should return an Array", () => {
      expect(lib.getNewEntries()).to.be.an("array");
    });

    it("should call the context performance.getEntries() method", () => {
      lib.getNewEntries();
      expect(windowContextFixture.performance.getEntries).to.have.been.called();
    });

    it("should only return new entries", () => {
      lib.processedEntries.add(entriesFixture[0]);
      const result = lib.getNewEntries();
      expect(result).to.have.length(8);
    });
  });

  describe("#getObserversForType", () => {
    it("should return an array", () => {
      const result = lib.getObserversForType(observersFixture, "resource");
      expect(result).to.be.an("array");
    });

    it("should filter observers list by entryType", () => {
      const result = lib.getObserversForType(observersFixture, "resource");
      expect(result).to.have.length("2");
    });
  });

  describe("#processBuffer", () => {
    const [fixture] = arrayFrom(observersFixture);
    const entryListFixture = new PerformanceObserverEntryList(entriesFixture);

    beforeEach(() => {
      fixture.buffer = new Set(entriesFixture);
      chai.spy.on(fixture, "callback");
    });

    afterEach(() => {
      fixture.buffer.clear();
      fixture.callback.reset();
    });

    it("should instantiate new EntryList from the observers buffer", () => {
      lib.processBuffer(fixture);
      const list = fixture.callback.__spy.calls[0][0];
      expect(list).to.be.an.instanceOf(PerformanceObserverEntryList);
      expect(list).to.deep.equal(entryListFixture);
    });

    it("should clear the observers buffer", () => {
      lib.processBuffer(fixture);
      const buffer = arrayFrom(fixture.buffer);
      expect(buffer).to.be.empty;
    });

    it("should call the observers callback method", () => {
      lib.processBuffer(fixture);
      expect(fixture.callback).to.have.been.called.once;
      expect(fixture.callback).to.have.been.called.with.exactly(
        entryListFixture,
        fixture
      );
    });

    it(`shouldn't call the observer callback method if the buffer is empty`, () => {
      fixture.buffer.clear();
      lib.processBuffer(fixture);
      expect(fixture.callback).to.not.have.been.called;
    });
  });

  describe("#processEntries", () => {
    beforeEach(() => {
      lib.registeredObservers = observersFixture;
      chai.spy.on(lib, "getNewEntries");
      chai.spy.on(lib, "getObserversForType");
      chai.spy.on(lib, "processEntries");
    });

    afterEach(() => {
      lib.processedEntries = new Set();
      lib.registeredObservers = new Set();
      lib.getNewEntries.reset();
      lib.getObserversForType.reset();
      lib.processEntries.reset();
    });

    it("should call getNewEntries to fetch new entires", () => {
      lib.processEntries();
      expect(lib.getNewEntries).to.have.been.called;
    });

    it("should get the interested observers for each entry", () => {
      lib.processEntries();
      expect(lib.getObserversForType).to.have.been.called.exactly(9);
    });

    it("should add each entry to each interested observers buffer", () => {
      const [fixture1, fixture2, fixture3] = arrayFrom(observersFixture);
      lib.processEntries();
      expect(fixture1.buffer.size).to.equal(9);
      expect(fixture2.buffer.size).to.equal(0);
      expect(fixture3.buffer.size).to.equal(9);
    });

    it("should mark each entry as processed", () => {
      lib.processEntries();
      expect(lib.processedEntries.size).to.equal(9);
    });

    it("should schdule a task to call processBuffer for each observer", done => {
      setTimeout(() => {
        expect(lib.processEntries).to.have.been.called.exactly.twice;
        done();
      }, 0);
    });
  });

  describe("#add", () => {
    const [fixture] = arrayFrom(observersFixture);

    beforeEach(() => {
      chai.spy.on(lib, "observe");
    });

    afterEach(() => {
      lib.registeredObservers.clear();
      lib.observe.reset();
    });

    it("should add the observer to list of registeredObservers", () => {
      expect(lib.registeredObservers.has(fixture)).to.be.false;
      lib.add(fixture);
      expect(lib.registeredObservers.has(fixture)).to.be.true;
    });

    it("should call the observe method if it is the first observer", () => {
      lib.add(fixture);
      expect(lib.observe).to.have.been.called.once;
    });

    it(`shouldn't call the observe method if it is not the first observer`, () => {
      lib.registeredObservers.add(observersFixture[2]);
      lib.add(fixture);
      expect(lib.observe).to.not.have.been.called;
    });
  });

  describe("#remove", () => {
    const [fixture] = arrayFrom(observersFixture);

    beforeEach(() => {
      lib.registeredObservers.add(fixture);
      chai.spy.on(lib, "disconnect");
    });

    afterEach(() => {
      lib.registeredObservers.clear();
      lib.disconnect.reset();
    });

    it("should remove the observer from the list of registeredObservers", () => {
      expect(lib.registeredObservers.has(fixture)).to.be.true;
      lib.remove(fixture);
      expect(lib.registeredObservers.has(fixture)).to.be.false;
    });

    it("should call the disconnect method if it was the last observer", () => {
      lib.remove(fixture);
      expect(lib.disconnect).to.have.been.called.once;
    });

    it(`shouldn't call the disconnect method if it was not the last observer`, () => {
      lib.registeredObservers.add(observersFixture[2]);
      lib.remove(fixture);
      expect(lib.disconnect).to.not.have.been.called;
    });
  });

  describe("#observe", () => {
    afterEach(() => {
      clearInterval(lib.intervalId);
    });

    it("should set the intervalId property", () => {
      expect(lib.intervalId).to.not.exist;
      lib.observe();
      expect(lib.intervalId).to.exist;
    });
  });

  describe("#disconnect", () => {
    it("should clear the intervalId", () => {
      lib.disconnect();
      expect(lib.intervalId).to.not.exist;
    });
  });
});
