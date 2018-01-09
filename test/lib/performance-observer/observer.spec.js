import Lib from "../../../src/lib/performance-observer/observer";
import PerformanceObserverTaskQueue from "../../../src/lib/performance-observer/task-queue";

describe("PerformanceObserver", () => {
  it("should be a function", () => {
    expect(Lib).to.be.a("function");
  });

  it("should return a class", () => {
    expect(new Lib()).to.be.an.instanceOf(Lib);
  });

  it(`should accept a callback argument and assign it a member`, () => {
    const cb = () => {};
    const result = new Lib(cb);
    expect(result).to.have.property("callback");
    expect(result.callback).to.be.an("function");
    expect(result.callback).to.equal(cb);
  });

  it(`should instantiate an entryTypes member`, () => {
    const result = new Lib();
    expect(result).to.have.property("entryTypes");
    expect(result.entryTypes).to.be.an("array");
    expect(result.entryTypes).to.be.empty;
  });

  it(`should instantiate a buffer`, () => {
    const result = new Lib();
    expect(result).to.have.property("buffer");
    expect(result.buffer).to.be.an.instanceOf(Set);
  });

  it(`should default to using the global task queue`, () => {
    const result = new Lib();
    expect(result).to.have.property("taskQueue");
    expect(result.taskQueue).to.be.an.instanceOf(PerformanceObserverTaskQueue);
  });

  describe("#observe", () => {
    let lib;
    const fixture = { entryTypes: ["resource"] };
    const taskQueueFixture = {
      add: chai.spy(() => {})
    };

    beforeEach(() => {
      lib = new Lib(() => {}, taskQueueFixture);
    });

    afterEach(() => taskQueueFixture.add.reset());

    it("should throw if no entryTypes are supplied", () => {
      expect(lib.observe).to.throw;
    });

    it("should validate entryTypes and ignore any invalid types", () => {
      lib.observe({ entryTypes: ["resource", "mark", "bad"] });
      expect(lib.entryTypes).to.have.length(2);
      expect(lib.entryTypes).to.deep.equal(["resource", "mark"]);
    });

    it("should throw if no vaild entryTypes are supplied", () => {
      expect(() => lib.observe({ entryTypes: ["invalid"] })).to.throw;
    });

    it("should queue observer", () => {
      lib.observe(fixture);
      expect(taskQueueFixture.add).to.have.been.called.once;
      expect(taskQueueFixture.add).to.have.been.called.with(lib);
    });
  });

  describe("#disconnect", () => {
    it("should remove observer from the task queue", () => {
      const taskQueueFixture = {
        remove: chai.spy(() => {})
      };
      const lib = new Lib(() => {}, taskQueueFixture);
      lib.disconnect();
      expect(taskQueueFixture.remove).to.have.been.called.once;
      expect(taskQueueFixture.remove).to.have.been.called.with(lib);
    });
  });
});
