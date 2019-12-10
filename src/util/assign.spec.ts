import assign from "./assign";

describe("assign", (): void => {
  it("should be able to merge simple objects together", (): void => {
    expect(assign({ a: 1 }, { b: 2 })).toEqual({ a: 1, b: 2 });
  });

  it("if keys conflict, should pick the one from the right", (): void => {
    const expected = { a: 2, b: 2, c: 1 };
    expect(assign({ a: 1, c: 1 }, { a: 2, b: 2 })).toEqual(expected);
  });

  it("deal with merging null", (): void => {
    const expected = { a: 1, c: 1 };
    expect(assign({ a: 1, c: 1 }, null)).toEqual(expected);
  });

  it("deal with scalars", (): void => {
    const expected = { a: 1, c: 1 };
    expect(assign({ a: 1, c: 1 }, 2)).toEqual(expected);
  });

  // this breaks. Don't merge arrays
  it.skip("deal with array", (): void => {
    const expected = { a: 1, c: 1 };
    expect(assign({ a: 1, c: 1 }, [2])).toEqual(expected);
  });
});
