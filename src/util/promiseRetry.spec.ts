import retry from "./promiseRetry";

jest.useFakeTimers();

describe("promiseRetry", (): void => {
  it("should retry the promise function if it rejected", (): Promise<void> => {
    const mockFunc = jest.fn();

    // Create a promise generating function that will
    // finally resolve on third attempt.
    mockFunc
      .mockReturnValueOnce(Promise.reject(false))
      .mockReturnValueOnce(Promise.reject(false))
      .mockReturnValue(Promise.resolve(true));

    // As we recurse the `wait` promise func which pushes a `setTimeout`
    // onto the micro task queue, this is a horrible hack to get all
    // fake timers on the task queue to advance after each tick.
    Promise.resolve()
      .then((): void => {})
      .then((): void => {})
      .then((): typeof jest => jest.runAllTimers())
      .then((): void => {})
      .then((): void => {})
      .then((): typeof jest => jest.runAllTimers());

    return retry(mockFunc, 4, 0).then((result): void => {
      expect(result).toEqual(true);
    });
  });

  it("should delay the retry by the supplied amount of time", (): Promise<
    void
  > => {
    const mockFunc = jest.fn();
    const delayFixture = 100;

    mockFunc
      .mockReturnValueOnce(Promise.reject(false))
      .mockReturnValue(Promise.resolve(true));

    Promise.resolve()
      .then((): void => {})
      .then((): void => {})
      .then((): typeof jest => jest.advanceTimersByTime(delayFixture));

    return retry(mockFunc, 2, delayFixture).then((result): void => {
      expect(result).toEqual(true);
    });
  });
});
