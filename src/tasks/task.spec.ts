import configFixture from "../fixtures/config";
import clientInfoFixture from "../fixtures/clientInfo";
import nock from "nock";
import Task from "./task";

describe("task", (): void => {
  it("should be able to execute", (): Promise<void> => {
    const token = configFixture.settings.token;
    nock(`https://${token}.eu.u.test.fastly-insights.com`)
      .defaultReplyHeaders({ "access-control-allow-origin": "*" })
      .get("/l")
      .reply(200, clientInfoFixture);

    const config = configFixture;
    const task = new Task(config, config.tasks[0]);
    return task.execute().then(
      (result: Beacon): void => {
        expect(result.client_ip).toEqual("1.2.3.4");
        expect(result.client_asn).toEqual(10225);
        expect(result.resolver_asn).toEqual(33);
        const expectedValue = { value: `test run ${config.tasks[0].id}` };
        expect(result.task_client_data).toEqual(JSON.stringify(expectedValue));
      }
    );
  });
});
