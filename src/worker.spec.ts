import { CONFIG_HOST, CONFIG_PATH } from "./constants";
import clientInfoFixture from "./fixtures/clientInfo";
import configFixture from "./fixtures/config";
import { init } from "./worker";
import nock from "nock";

const queryParametersFixture = {
  k: "2e8a8c19-e1c6-4d68-9200-d6a894b39414"
};

describe("worker", (): void => {
  describe("init", (): void => {
    it("should return a promise for all tasks", (): Promise<void> => {
      const { k: token } = queryParametersFixture;

      nock(`https://${token}.eu.u.test.fastly-insights.com`)
        .defaultReplyHeaders({ "access-control-allow-origin": "*" })
        .get("/l")
        .reply(200, clientInfoFixture);
      nock(CONFIG_HOST)
        .defaultReplyHeaders({ "access-control-allow-origin": "*" })
        .get(CONFIG_PATH + token)
        .reply(200, configFixture);

      return init(queryParametersFixture).then(
        (beacons: Beacon[]): void => {
          for (let i = 0; i < beacons.length; i++) {
            const beacon = beacons[i];
            const task = configFixture.tasks[i];
            expect(beacon.task_client_data).toEqual(
              `{"value":"test run ${task.id}"}`
            );
          }
        }
      );
    });
  });
});
