import chooseRandomTasks from "./chooseRandomTasks";
import { mockRandomForEach } from "jest-mock-random";

describe("chooseRandomTasks", (): void => {
  mockRandomForEach([0.5]);

  it("should select the right values", (): void => {
    const probs = [
      { weight: 0.14285714285714285 },
      { weight: 0.09523809523809523 },
      { weight: 0.09523809523809523 },
      { weight: 0.047619047619047616 },
      { weight: 0.047619047619047616 },
      { weight: 0.09523809523809523 },
      { weight: 0.047619047619047616 },
      { weight: 0.09523809523809523 },
      { weight: 0.047619047619047616 },
      { weight: 0.017857142857142856 },
      { weight: 0.017857142857142856 },
      { weight: 0.017857142857142856 },
      { weight: 0.017857142857142856 },
      { weight: 0.017857142857142856 },
      { weight: 0.017857142857142856 },
      { weight: 0.017857142857142856 },
      { weight: 0.017857142857142856 },
      { weight: 0.14285714285714285 }
    ] as TaskData[];
    const output = chooseRandomTasks(probs, 8);
    const expected = [
      { weight: 0.047619047619047616 },
      { weight: 0.09523809523809523 },
      { weight: 0.09523809523809523 },
      { weight: 0.047619047619047616 },
      { weight: 0.047619047619047616 },
      { weight: 0.047619047619047616 },
      { weight: 0.017857142857142856 },
      { weight: 0.09523809523809523 }
    ];
    expect(output).toEqual(expected);
  });

  it("should select the right values - k=1", (): void => {
    const probs = [
      { weight: 0.047619047619047616 },
      { weight: 0.09523809523809523 },
      { weight: 0.047619047619047616 },
      { weight: 0.09523809523809523 },
      { weight: 0.047619047619047616 },
      { weight: 0.09523809523809523 },
      { weight: 0.047619047619047616 },
      { weight: 0.14285714285714285 },
      { weight: 0.14285714285714285 },
      { weight: 0.017857142857142856 },
      { weight: 0.017857142857142856 },
      { weight: 0.017857142857142856 },
      { weight: 0.017857142857142856 },
      { weight: 0.017857142857142856 },
      { weight: 0.017857142857142856 },
      { weight: 0.017857142857142856 },
      { weight: 0.017857142857142856 }
    ] as TaskData[];
    const output = chooseRandomTasks(probs, 1);
    const expected = [{ weight: 0.047619047619047616 }];
    expect(output).toEqual(expected);
  });

  it("should select the right values - k>=probs.length", (): void => {
    const probs = [
      { weight: 0.047619047619047616 },
      { weight: 0.09523809523809523 },
      { weight: 0.047619047619047616 }
    ] as TaskData[];
    const output = chooseRandomTasks(probs, 3);
    const expected = [
      { weight: 0.047619047619047616 },
      { weight: 0.09523809523809523 },
      { weight: 0.047619047619047616 }
    ];
    expect(output).toEqual(expected);
  });
});
