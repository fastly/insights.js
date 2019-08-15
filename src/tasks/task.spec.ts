import configFixture from "../fixtures/config";
import clientInfoFixture from "../fixtures/clientInfo";
import nock from "nock";
import Task from "./task";

class MockDerviedClass extends Task {
  public constructor(config: Config, taskData: TaskData) {
    super(config, taskData);
  }

  protected test(): Promise<any> {
    return Promise.resolve({ id: this.data.id });
  }
}

describe("task", (): void => {
  describe("#execute", (): void => {
    it("should eventually return a Beacon", (): Promise<void> => {
      const testId = configFixture.test.id;
      nock(`https://${testId}.eu.u.test.fastly-insights.com`)
        .defaultReplyHeaders({ "access-control-allow-origin": "*" })
        .get("/l")
        .reply(200, clientInfoFixture);

      const config = configFixture;
      const task = new MockDerviedClass(config, config.tasks[0]);

      return task.execute().then((result: Beacon): void => {
        expect(result.client_ip).toEqual("1.2.3.4");
        expect(result.client_asn).toEqual(10225);
        expect(result.resolver_asn).toEqual(33);
        /* eslint-disable @typescript-eslint/camelcase */
        const expectedValue = { client_connection: {}, id: config.tasks[0].id };
        expect(result.task_client_data).toEqual(JSON.stringify(expectedValue));
      });
    });
  });
});
