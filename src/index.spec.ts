import state, { init } from "./index";
import Worker from "workerize-loader!./worker";

const mockInit = jest.fn();
jest.mock(
  "workerize-loader!./worker",
  (): jest.Mock => {
    return jest.fn().mockImplementation(
      (): any => {
        return { init: mockInit };
      }
    );
  }
);

describe("index", (): void => {
  beforeAll(
    (): void => {
      (Worker as jest.Mock).mockClear();
      mockInit.mockClear();
    }
  );

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
      expect(Worker).toHaveBeenCalled();
      expect(mockInit).toHaveBeenCalled();
    });
  });
});
