import sequence from "./promiseSequence";

describe("promiseSequence", (): void => {
  it("should invoke each promise generating function in sequence", (): Promise<
    void
  > => {
    const mockFuncOne = jest.fn().mockReturnValue(Promise.resolve(1));
    const mockFuncTwo = jest.fn().mockReturnValue(Promise.resolve(2));
    const mockFuncThree = jest.fn().mockReturnValue(Promise.resolve(3));

    const fixture = [mockFuncOne, mockFuncTwo, mockFuncThree];

    const result = sequence(fixture);

    return Promise.resolve()
      .then(
        (): Promise<void> => {
          expect(mockFuncOne).toHaveBeenCalledTimes(1);
          expect(mockFuncTwo).toHaveBeenCalledTimes(0);
          expect(mockFuncTwo).toHaveBeenCalledTimes(0);
          return Promise.resolve();
        }
      )
      .then(
        (): Promise<void> => {
          expect(mockFuncOne).toHaveBeenCalledTimes(1);
          expect(mockFuncTwo).toHaveBeenCalledTimes(1);
          expect(mockFuncThree).toHaveBeenCalledTimes(0);
          return Promise.resolve();
        }
      )
      .then(
        (): void => {
          expect(mockFuncOne).toHaveBeenCalledTimes(1);
          expect(mockFuncTwo).toHaveBeenCalledTimes(1);
          expect(mockFuncThree).toHaveBeenCalledTimes(1);
        }
      )
      .then(
        (): Promise<any> => {
          return result;
        }
      )
      .then(
        (results): void => {
          expect(results).toEqual([1, 2, 3]);
        }
      );
  });
});
