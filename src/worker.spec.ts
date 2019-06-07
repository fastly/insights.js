import { CONFIG_HOST, CONFIG_PATH } from "./constants";
import clientInfoFixture from "./fixtures/clientInfo";
import configFixture from "./fixtures/config";
import { init } from "./worker";
import nock from "nock";

describe("worker", (): void => {
  describe("init", (): void => {
    it("should return a promise for all tasks", (): Promise<void> => {
      const token = configFixture.settings.token;
      nock(`https://${token}.eu.u.test.fastly-insights.com`)
        .defaultReplyHeaders({ "access-control-allow-origin": "*" })
        .get("/l")
        .reply(200, clientInfoFixture);
      nock(CONFIG_HOST)
        .defaultReplyHeaders({ "access-control-allow-origin": "*" })
        .get(CONFIG_PATH)
        .reply(200, configFixture);

      return init().then(
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
