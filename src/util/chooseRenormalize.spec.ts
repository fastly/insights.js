import chooseRenormalize from "./chooseRenormalize";

describe("chooseRenormalize", (): void => {
  it("should select the right values, k>1", (): void => {
    const probs = [
      0.14285714285714285,
      0.09523809523809523,
      0.09523809523809523,
      0.047619047619047616,
      0.047619047619047616,
      0.09523809523809523,
      0.047619047619047616,
      0.09523809523809523,
      0.047619047619047616,
      0.017857142857142856,
      0.017857142857142856,
      0.017857142857142856,
      0.017857142857142856,
      0.017857142857142856,
      0.017857142857142856,
      0.017857142857142856,
      0.017857142857142856,
      0.14285714285714285
    ];
    const output = chooseRenormalize(probs, 8);
    const expected = [6, 5, 7, 4, 8, 3, 9, 2];
    expect(output).toEqual(expected);
  });

  it("should select the right values - k=1", (): void => {
    const probs = [
      0.047619047619047616,
      0.09523809523809523,
      0.047619047619047616,
      0.09523809523809523,
      0.047619047619047616,
      0.09523809523809523,
      0.09523809523809523,
      0.047619047619047616,
      0.14285714285714285,
      0.14285714285714285,
      0.017857142857142856,
      0.017857142857142856,
      0.017857142857142856,
      0.017857142857142856,
      0.017857142857142856,
      0.017857142857142856,
      0.017857142857142856,
      0.017857142857142856
    ];
    const output = chooseRenormalize(probs, 1);
    const expected = [7];
    expect(output).toEqual(expected);
  });

  it("should select the right values - k>=probs.length", (): void => {
    const probs = [
      0.047619047619047616,
      0.09523809523809523,
      0.047619047619047616
    ];
    const output = chooseRenormalize(probs, 3);
    const expected = [0, 1, 2];
    expect(output).toEqual(expected);
  });
});
