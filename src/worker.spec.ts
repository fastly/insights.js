import * as worker from "./worker";

describe("worker", (): void => {
  describe("init", (): void => {
    it("should expose an init method", (): void => {
      expect(worker).toHaveProperty("init");
    });

    it("should return undefined", (): void => {
      const init = jest.fn(worker.init);
      init();
      expect(init).toHaveReturnedWith(undefined);
    });
  });
});
