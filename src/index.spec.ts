import state, { init } from "./index";
import * as worker from "./worker";

jest.mock("./worker");

describe("index", (): void => {
  beforeAll((): void => {
    (worker.init as jest.Mock).mockClear();
  });

  describe("state", (): void => {
    it("should return global state as default export", (): void => {
      expect(state).toEqual(expect.anything());
    });

    it("should set whether the client has feature support", (): void => {
      expect(state).toHaveProperty("client.hasFeatureSupport");
      expect(state.client.hasFeatureSupport).toBeFalsy();
    });
  });

  describe("init", (): void => {
    it("should invoke the woker init method when ready", (): void => {
      init();
      expect(worker.init).toHaveBeenCalled();
    });
  });
});
