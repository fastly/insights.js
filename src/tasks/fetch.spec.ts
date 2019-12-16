import configFixture from "../fixtures/config";
import svgFixture from "../fixtures/svg";
import nock from "nock";
import Fetch from "./fetch";

describe("POP", (): void => {
  describe("#test", (): void => {
    const [, , taskDataFixture] = configFixture.tasks;
    const task = new Fetch(configFixture, taskDataFixture);

    let mockRequest: nock.Scope;

    beforeEach((): void => {
      const url = new URL(taskDataFixture.resource);
      const { protocol, host, pathname } = url;
      mockRequest = nock(`${protocol}//${host}`)
        .get(pathname)
        .reply(200, svgFixture, {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Expose-Headers": "X-Datacenter",
          "Timing-Allow-Origin": "*",
          "X-Datacenter": "LHR",
          "Content-Type": "application/json"
        });
    });

    afterEach((): void => {
      nock.restore();
      nock.activate();
    });

    it("should fetch the given resource", (): Promise<void> => {
      return task.execute().then((): void => {
        expect(mockRequest.isDone()).toBeTruthy();
      });
    });

    it("should get the datacenter ID from the response header", (): Promise<
      void
    > => {
      return task.execute().then((beacon: Beacon): void => {
        const result = JSON.parse(beacon.task_client_data);
        expect(result).toHaveProperty("subject_id");
        expect(result.subject_id).toEqual("LHR");
      });
    });

    it("should get the resource timing extry for the request", (): Promise<
      void
    > => {
      return task.execute().then((beacon: Beacon): void => {
        const result = JSON.parse(beacon.task_client_data);
        expect(result).toHaveProperty("subject_request_start");
        expect(typeof result.subject_request_start).toEqual("number");
      });
    });

    it("should prefix all result data keys with subject_", (): Promise<
      void
    > => {
      return task.execute().then((beacon: Beacon): void => {
        const result = JSON.parse(beacon.task_client_data);
        Object.keys(result)
          .filter((key): boolean => !key.includes("client_"))
          .forEach((key): void => {
            expect(key).toContain("subject_");
          });
      });
    });
  });
});
