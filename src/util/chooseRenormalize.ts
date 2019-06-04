function mean(values: number[]): number {
  return values.reduce((memo: number, i: number) => memo + i) / values.length;
}

/**
 * This defines a random number between 0 and "mass", which should cover the entire
 * domain of the probability distribution. Then we will "walk" the probability mass
 * until we exceed the generated value
 */
function basicChooseOne(probs: number[], mass: number): number {
  // const r = mass * Math.random() // FiXME
  const r = mass * 0.5;
  let i = 0;
  let s = probs[0];
  while (s < r) {
    i += 1;
    s += probs[i];
  }
  return i;
}

function chooseRenormalize(probs: number[], k: number): number[] {
  //  If we have more work slots than candidates in the probability distribution,
  //  we return them all
  if (k >= probs.length)
    return Array(probs.length)
      .fill(null)
      .map((x: null, index: number) => index);

  // Since we are mutating the probabilities vector, we copy it first
  const p = probs.map(x => x);

  // This assumes that the probability vector is normalized. If it is not, it
  // should be changed to the sum of the weights
  let remaining = 1;

  // The weight of an additional "ghost" element that we will use to
  // inhibit running tasks that should have low probability
  const dampeningFactor = Math.min(mean(probs), 0.05);
  const choices = [];

  for (let j = 0; j < k; j++) {
    // Perform choice adding an additional "ghost" element that can be tweaked
    // to control execution eagerness
    const i = basicChooseOne(
      p.concat([dampeningFactor]),
      remaining + dampeningFactor
    );

    // If we choose a _real_ task, instead of the _ghost_ task, execute the logic
    // inside the conditional
    if (i < p.length) {
      // Eliminate chosen element from distribution and renormalize
      remaining -= p[i];
      p[i] = 0;

      // Add selected element to the selection set
      choices.push(i);
    }
  }

  return choices;
}

export default chooseRenormalize;
