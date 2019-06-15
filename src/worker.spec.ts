import { CONFIG_HOST, CONFIG_PATH } from "./constants";
import clientInfoFixture from "./fixtures/clientInfo";
import configFixture from "./fixtures/config";
import { init } from "./worker";
import nock from "nock";

const queryParametersFixture = {
  k: "d00fe9b6-91c6-4434-8e77-14630e263a26"
};

describe("worker", (): void => {
  describe("init", (): void => {
    it("should eventually return an array of Beacons", (): Promise<void> => {
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
            expect(beacon.task_id).toEqual(task.id)
          }
        }
      );
    });
  });
});
