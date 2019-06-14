import assign from "../util/assign";

function mean(values: number[]): number {
  return values.reduce((memo: number, i): number => memo + i) / values.length;
}

/**
 * This defines a random number between 0 and "mass", which should cover the entire
 * domain of the probability distribution. Then we will "walk" the probability mass
 * until we exceed the generated value
 */
function basicChooseOne(tasks: TaskData[], mass: number): number {
  const r = mass * Math.random();
  let i = 0;
  let s = tasks[0].weight;
  while (s < r) {
    i += 1;
    s += tasks[i].weight;
  }
  return i;
}

function chooseRenormalize(tasks: TaskData[], k: number): TaskData[] {
  //  If we have more work slots than candidates in the probability distribution,
  //  we return them all
  if (k >= tasks.length) {
    return tasks;
  }

  // Since we are mutating the probabilities vector, we copy it first
  const t = tasks.map((t): TaskData => assign({}, t));

  // This assumes that the probability vector is normalized. If it is not, it
  // should be changed to the sum of the weights
  let remaining = tasks
    .map((t): number => t.weight)
    .reduce((memo, task): number => memo + task);

  // The weight of an additional "ghost" element that we will use to
  // inhibit running tasks that should have low probability
  const probs = tasks.map((t): number => t.weight);
  const dampeningFactor = Math.min(mean(probs), 0.05 * remaining);
  const choices = [];

  for (let j = 0; j < k; j++) {
    // Perform choice adding an additional "ghost" element that can be tweaked
    // to control execution eagerness
    const d = ({ weight: dampeningFactor } as any) as TaskData;
    const i = basicChooseOne(t.concat([d]), remaining + dampeningFactor);

    // If we choose a _real_ task, instead of the _ghost_ task, execute the logic
    // inside the conditional
    if (i < t.length) {
      // Add selected element to the selection set
      choices.push(assign({}, t[i]));

      // Eliminate chosen element from distribution and renormalize
      remaining -= t[i].weight;
      t[i].weight = 0;
    }
  }

  return choices;
}

export default chooseRenormalize;
