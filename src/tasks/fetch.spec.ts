/* eslint-disable @typescript-eslint/camelcase */
import configFixture from "../fixtures/config";
import svgFixture from "../fixtures/svg";
import nock from "nock";
import Fetch from "./fetch";
import * as resourceTiming from "../lib/resourceTiming";

jest.mock("../lib/resourceTiming");

const [, , taskDataFixture] = configFixture.tasks;
const resourceTimingFixture = {
  name: taskDataFixture.resource,
  entryType: "resource",
  startTime: 401.78500000183703,
  duration: 33.96500000235392,
  initiatorType: "fetch",
  nextHopProtocol: "http/1.1",
  workerStart: 0,
  redirectStart: 0,
  redirectEnd: 0,
  fetchStart: 401.78500000183703,
  domainLookupStart: 404.2600000029779,
  domainLookupEnd: 412.0850000035716,
  connectStart: 412.0850000035716,
  connectEnd: 428.50000000180444,
  secureConnectionStart: 417.48000000370666,
  requestStart: 428.57000000367407,
  responseStart: 435.3950000004261,
  responseEnd: 435.75000000419095,
  transferSize: 711,
  encodedBodySize: 231,
  decodedBodySize: 231,
  serverTiming: []
};

const normalizeEntryFixture = {
  start_time: 401.78500000183703,
  duration: 33.96500000235392,
  next_hop_protocol: "http/1.1",
  worker_start: 0,
  redirect_start: 0,
  redirect_end: 0,
  fetch_start: 401.78500000183703,
  domain_lookup_start: 404.2600000029779,
  domain_lookup_end: 412.0850000035716,
  connect_start: 412.0850000035716,
  connect_end: 428.50000000180444,
  secure_connection_start: 417.48000000370666,
  request_start: 428.57000000367407,
  response_start: 435.3950000004261,
  response_end: 435.75000000419095,
  transfer_size: 711,
  encoded_body_size: 231,
  decoded_body_size: 231,
  server_timing: []
};

describe("Fetch", (): void => {
  describe("#test", (): void => {
    const task = new Fetch(configFixture, taskDataFixture);
    (resourceTiming.asyncGetEntry as jest.Mock).mockResolvedValue(
      resourceTimingFixture
    );
    (resourceTiming.normalizeEntry as jest.Mock).mockReturnValue(
      normalizeEntryFixture
    );

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

    it("should get the resource timing entry for the request", (): Promise<
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
