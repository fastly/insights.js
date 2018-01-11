import Lib from "../src/runner";

class TaskFixture {
  constructor() {
    this.type = "defaultTask";
  }
  static get hasCustomConfiguration() {
    return false;
  }
  static configure() {
    return [{ type: "defaultTask", id: "a" }];
  }
  execute() {
    return Promise.resolve();
  }
}

class CustomTaskFixture1 extends TaskFixture {
  constructor() {
    super();
    this.type = "customTask1";
  }
  static get hasCustomConfiguration() {
    return true;
  }
  static configure() {
    return [{ type: "customTask1", id: "b" }];
  }
}

class CustomTaskFixture2 extends CustomTaskFixture1 {
  constructor() {
    super();
    this.type = "CustomTask2";
  }
  static configure() {
    return [{ type: "customTask2", id: "c" }];
  }
}

const tasksFixture = {
  defaultTask: TaskFixture,
  customTask1: CustomTaskFixture1,
  customTask2: CustomTaskFixture2
};

const configFixture = {
  server: {
    host: "LHR"
  },
  tasks: [{ type: "defaultTask", id: "d" }]
};

describe("Runner", () => {
  let lib;

  beforeEach(() => {
    lib = new Lib(tasksFixture);
  });

  afterEach(() => {
    lib = null;
  });

  it("should be a class", () => {
    expect(Lib).to.be.an("function");
    expect(lib).to.be.an.instanceOf(Lib);
  });

  describe("#constructor", () => {
    it("should initialize version property", () => {
      expect(lib).to.have.property("version");
      expect(lib.version).to.be.an("string");
    });

    it("should initialize default state", () => {
      expect(lib).to.have.property("state");
      expect(lib.state).to.be.an("object");
      expect(lib.state.initialized).to.be.false;
      expect(lib.state.hasRan).to.be.false;
    });

    it("should initialize an empty task queue", () => {
      expect(lib).to.have.property("taskQueue");
      expect(lib.taskQueue).to.have.lengthOf(0);
    });
  });

  describe("#getCustomTaskConfiguration", () => {
    it("should be a function", () => {
      expect(lib.getCustomTaskConfiguration).to.be.an("function");
    });

    it("should return an Array", () => {
      const result = lib.getCustomTaskConfiguration(
        tasksFixture,
        configFixture
      );
      expect(result).to.be.an("array");
    });

    it("should filter task list by hasCustomConfiguration", () => {
      const result = lib.getCustomTaskConfiguration(
        tasksFixture,
        configFixture
      );
      expect(result).to.not.deep.include({ type: "defaultTask", id: "a" });
    });

    it("should call the #configure method on each task", () => {
      chai.spy.on(CustomTaskFixture1, "configure");
      lib.getCustomTaskConfiguration(tasksFixture, configFixture);
      expect(CustomTaskFixture1.configure).to.have.been.called.once;
      expect(CustomTaskFixture1.configure).to.have.been.called.with(
        configFixture
      );
      CustomTaskFixture1.configure.reset();
    });

    it("should flatten the task list into a single array", () => {
      const result = lib.getCustomTaskConfiguration(
        tasksFixture,
        configFixture
      );
      expect(result[0]).to.not.be.an("array");
    });
  });

  describe("#composeTaskConfig", () => {
    const configFixture = {
      apiKey: "1",
      session: "2",
      server: { host: "foo.com" }
    };
    const taskConfigFixture = { type: "defaultTask", id: "e" };

    it("should be a function", () => {
      expect(lib.composeTaskConfig).to.be.a("function");
    });

    it("should return an object", () => {
      expect(lib.composeTaskConfig(configFixture, {})).to.be.an("object");
    });

    it("should compose the task conifg with various global config properties", () => {
      const result = lib.composeTaskConfig(configFixture, taskConfigFixture);
      expect(result).to.have.property("apiKey");
      expect(result).to.have.property("session");
      expect(result).to.have.property("server");
    });
  });

  describe("#init", () => {
    it("should be a function", () => {
      expect(lib.init).to.be.an("function");
    });

    it("should return a Promise", () => {
      expect(lib.init()).to.be.a("promise");
    });

    it("should exit if no config supplied", () => {
      return expect(lib.init()).to.eventually.be.rejected;
    });

    it("should exit if already initialized", () => {
      lib.state.initialized = true;
      return expect(lib.init(configFixture)).to.eventually.be.rejected;
    });

    it("should set the state to initialized", () => {
      return lib.init(configFixture).then(() => {
        expect(lib.state.initialized).to.be.true;
      });
    });

    it("should assign the config argument to a config property", () => {
      return lib.init(configFixture).then(() => {
        expect(lib.config).to.deep.equal(configFixture);
      });
    });

    it("should call #getCustomTaskConfiguration to generate dynamic task list", () => {
      chai.spy.on(lib, "getCustomTaskConfiguration");
      return lib.init(configFixture).then(() => {
        expect(lib.getCustomTaskConfiguration).to.have.been.called.once;
        lib.getCustomTaskConfiguration.reset();
      });
    });

    it("should merge default and custom tasks into an exported task list", () => {
      return lib.init(configFixture).then(() => {
        expect(lib.taskConfig).to.exist;
        expect(lib.taskConfig).to.be.an("array");
        expect(lib.taskConfig).to.have.length(3);
      });
    });

    it("should initialize a queue of task functions to execute (taskQueue)", () => {
      return lib.init(configFixture).then(() => {
        expect(lib.taskQueue).to.exist;
        expect(lib.taskQueue).to.be.an("array");
        expect(lib.taskQueue[0]).to.be.an("function");
      });
    });

    it("should invoke the #run method and return its result", () => {
      chai.spy.on(lib, "run");
      const result = lib.init(configFixture);
      return Promise.all([
        result.then(() => expect(lib.run).to.have.been.called),
        expect(result).to.eventually.be.true
      ]).then(() => lib.run.reset());
    });
  });

  describe("#run", () => {
    beforeEach(() => {
      lib.state.initialized = true;
      lib.taskQueue = [1, 2, 3].map(i => chai.spy(() => Promise.resolve(i)));
    });

    afterEach(() => {
      lib.state.initialized = false;
      lib.taskQueue = [];
    });

    it("should be a function", () => {
      expect(lib.run).to.be.an("function");
    });

    it("should return a Promise", () => {
      lib.state.initialized = false;
      expect(lib.run()).to.be.a("promise");
    });

    it("should exit if not initialized", () => {
      lib.state.initialized = false;
      return expect(lib.run()).to.eventually.be.rejected;
    });

    it("should exit if already ran", () => {
      lib.state.hasRan = true;
      return expect(lib.run()).to.eventually.be.rejected;
    });

    it("should exit if already running", () => {
      lib.state.running = true;
      return expect(lib.run()).to.eventually.be.rejected;
    });

    it("should invoke each function of the task queue", () => {
      return lib.run().then(() => {
        expect(lib.taskQueue[0]).to.have.been.called;
        expect(lib.taskQueue[1]).to.have.been.called;
        expect(lib.taskQueue[2]).to.have.been.called;
      });
    });

    it("should set persist the task results to the results property", () => {
      return lib.run().then(() => {
        expect(lib.results).to.exist;
        expect(lib.results).to.be.an("array");
        expect(lib.results).to.deep.equal([1, 2, 3]);
      });
    });

    it("should set the state to hasRan", () => {
      return lib.run().then(() => {
        expect(lib.state.hasRan).to.be.true;
      });
    });
  });
});
