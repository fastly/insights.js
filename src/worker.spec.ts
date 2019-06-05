import { init } from "./worker";
import configFixture from "./fixtures/config";
import { CONFIG_HOST, CONFIG_PATH } from "./constants";
import nock from "nock";

describe("worker", (): void => {
  describe("init", (): void => {
    it("should return a promise", (): Promise<void> => {
      nock(CONFIG_HOST)
        .defaultReplyHeaders({ "access-control-allow-origin": "*" })
        .get(CONFIG_PATH)
        .reply(200, configFixture);

      return init().then(
        (output): void => {
          expect(output.settings.token).toEqual(
            "d00fe9b6-91c6-4434-8e77-14630e263a26"
          );
        }
      );
    });
  });
});
