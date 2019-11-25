import compose from "./compose";

describe("compose", (): void => {
  it("should compose functions", (): void => {
    const fn1 = (val: string): string => `fn1(${val})`;
    const fn2 = (val: string): string => `fn2(${val})`;
    const fn3 = (val: string): string => `fn3(${val})`;
    const composedFunction = compose(fn1, fn2, fn3);
    expect(composedFunction("inner")).toBe("fn1(fn2(fn3(inner)))");
  });
});
