import {
  rewire$beacon as beaconRewire,
  restore as beaconRestore
} from "../../src/lib/beacon";
import {
  rewire$get as getClientInfoRewire,
  restore as getClientInfoRestore
} from "../../src/lib/client-info";

import Lib from "../../src/tasks/task";

const fixture = {
  id: "iad",
  type: "object",
  apiKey: "1111-2222-3333",
  session: "1111.2222.3333",
  hosts: {
    host: "test.com",
    lookup: "u.test.com"
  }
};

describe("Task", () => {
  let task;

  beforeEach(() => {
    task = new Lib(fixture);
  });

  afterEach(() => {
    task = null;
  });

  it("should be a class", () => {
    expect(Lib).to.be.an("function");
    expect(task).to.be.an.instanceOf(Lib);
  });

  it("should initialize config", () => {
    expect(task).to.have.property("config");
    expect(task.config).to.be.an("object");
    expect(task.config).to.have.property("testId");
    expect(task).to.have.property("result");
    expect(task.result).to.be.an("object");
    expect(task).to.have.property("state");
    expect(task.state).to.be.an("object");
    expect(task.state).to.have.property("hasRan");
    expect(task.state.hasRan).to.be.false;
  });

  it("should have a static hasCustomConfiguration property", () => {
    expect(Lib.hasCustomConfiguration).to.exist;
    expect(Lib.hasCustomConfiguration).to.be.false;
  });

  describe("#encode", () => {
    it("should have an encode method", () => {
      expect(task.encode).to.exist;
    });

    it("should be a function", () => {
      expect(task.encode).to.be.an("function");
    });

    it("should serialize the data as JSON by default", () => {
      const fixt = { foo: "bar" };
      const result = task.encode(fixt);
      expect(result).to.not.equal(fixt);
      expect(result).to.be.an("string");
      expect(JSON.parse(result)).to.deep.equal(fixt);
    });
  });

  describe("#send", () => {
    let spy;
    const dataFixture = JSON.stringify({ foo: "bar" });

    beforeEach(() => {
      spy = chai.spy();
      beaconRewire(spy);
    });

    afterEach(() => {
      spy.reset();
    });

    after(() => {
      beaconRestore();
    });

    it("should have an send method", () => {
      expect(task.encode).to.exist;
    });

    it("should be a function", () => {
      expect(task.send).to.be.an("function");
    });

    it("should beacon test results after execution", () => {
      task.send(dataFixture);
      expect(spy).to.have.been.called.once;
    });

    it("should construct a query string with credentials", () => {
      task.send(dataFixture);
      const url = `https://${fixture.hosts.host}/beacon?k=${fixture.apiKey}&s=${
        fixture.session
      }`;
      expect(spy).to.have.been.called.with(url);
    });

    it("should pass test data as beacon payload", () => {
      task.send(dataFixture);
      expect(spy).to.have.been.called.with(dataFixture);
    });
  });

  describe("#generateResult", () => {
    const configFixture = {
      testId: "1234",
      apiKey: "1111",
      server: { host: "www.test.com" },
      type: "test"
    };
    const resultFixture = { foo: "bar" };
    const clientFixture = { baz: "qux" };

    it("should have a generateResult method", () => {
      expect(task.generateResult).to.exist;
    });

    it("should be a function", () => {
      expect(task.generateResult).to.be.an("function");
    });

    it("should return an object", () => {
      const result = task.generateResult(
        configFixture,
        resultFixture,
        clientFixture
      );
      expect(result).to.be.an("object");
    });

    it("should set default properties from the task config", () => {
      const result = task.generateResult(configFixture);
      expect(result).to.have.property("test_id");
      expect(result.test_id).to.equal("1234");
      expect(result).to.have.property("test_api_key");
      expect(result.test_api_key).to.equal("1111");
      expect(result).to.have.property("test_server");
      expect(result.test_server).to.equal(JSON.stringify(configFixture.server));
      expect(result).to.have.property("task_type");
      expect(result.task_type).to.equal("test");
    });

    it("should assign a unix timestamp property of the task run", () => {
      const result = task.generateResult(configFixture);
      expect(result).to.have.property("test_timestamp");
      expect(result.test_timestamp).to.be.an("number");
    });

    it("should set a library version template placeholder", () => {
      const result = task.generateResult(configFixture);
      expect(result).to.have.property("test_lib_version");
      expect(result.test_lib_version).to.equal("<% VERSION %>");
    });

    it("should set a template placeholder property for server-side data", () => {
      const result = task.generateResult(configFixture);
      expect(result).to.have.property("task_server_data");
      expect(result.task_server_data).to.equal("<% SERVER_DATA %>");
    });

    it("should set a client_data property with the serialised task results", () => {
      const result = task.generateResult(configFixture, resultFixture);
      expect(result).to.have.property("task_client_data");
      expect(result.task_client_data).to.equal(JSON.stringify(resultFixture));
    });

    it("should merge the clientInfo data into the result object", () => {
      const result = task.generateResult(
        configFixture,
        resultFixture,
        clientFixture
      );
      expect(result).to.have.property("baz");
      expect(result.baz).to.equal("qux");
    });
  });

  describe("#execute", () => {
    let task;
    const clientInfoFixture = {
      client_ip: "1.1.1.1",
      resolver_ip: "2.2.2.2"
    };
    const runFixture = { rtt: 1 };
    const resultFixture = '{ "foo": "bar" }';
    const runSpy = chai.spy(() => runFixture);
    const clientInfoSpy = chai.spy(() => Promise.resolve(clientInfoFixture));

    class Task extends Lib {
      constructor(data) {
        super(data);
      }

      encode() {
        return resultFixture;
      }

      generateResult() {
        return resultFixture;
      }

      run() {
        return Promise.resolve().then(runSpy);
      }
    }

    before(() => {
      getClientInfoRewire(clientInfoSpy);
    });

    beforeEach(() => {
      task = new Task(fixture);
      chai.spy.on(task, "generateResult");
      chai.spy.on(task, "encode");
      chai.spy.on(task, "send");
    });

    afterEach(() => {
      task = null;
      runSpy.reset();
      clientInfoSpy.reset();
    });

    after(() => {
      getClientInfoRestore();
    });

    it("should have an execute method", () => {
      expect(task).to.have.property("execute");
    });

    it("should have be a function", () => {
      expect(task.execute).to.be.a("function");
    });

    it("should execute inherited #run method", () =>
      task.execute().then(() => {
        expect(runSpy).to.have.been.called.once;
      }));

    it("should call the client-info lib to get client and resolver data", () =>
      task.execute().then(() => {
        expect(clientInfoSpy).to.have.been.called.once;
      }));

    it("should call #generateResult with the task and client results", () =>
      task.execute().then(() => {
        expect(task.generateResult).to.have.been.called.once;
        expect(task.generateResult).to.have.been.called.with(
          task.config,
          runFixture,
          clientInfoFixture
        );
      }));

    it("should assign the result of the run calls to a result property", () => {
      task.execute().then(() => {
        expect(task.result).to.equal(resultFixture);
      });
    });

    it("should call #encode to serialise the results", () =>
      task.execute().then(() => {
        expect(task.encode).to.have.been.called.once;
        expect(task.encode).to.have.been.called.with(resultFixture);
      }));

    it("should call #send to beacon the results", () =>
      task.execute().then(() => {
        expect(task.send).to.have.been.called.once;
        expect(task.send).to.have.been.called.with(resultFixture);
      }));

    it("should return the unencoded results once complete", () => {
      task.execute().then(result => {
        expect(result).to.equal(resultFixture);
      });
    });

    it("should catch any error in processing and resolve a parital result", () => {
      task.run = () => Promise.reject(new Error("error"));
      return task.execute().then(result => {
        expect(result).to.equal(task.result);
      });
    });
  });
});
