import random
import functools

# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
def main():
  random.seed(1)
  tests = [
      {
        'probs': [0.14285714285714285, 0.09523809523809523, 0.09523809523809523, 0.047619047619047616, 0.047619047619047616, 0.09523809523809523, 0.047619047619047616, 0.09523809523809523, 0.047619047619047616, 0.017857142857142856, 0.017857142857142856, 0.017857142857142856, 0.017857142857142856, 0.017857142857142856, 0.017857142857142856, 0.017857142857142856, 0.017857142857142856, 0.14285714285714285],
        'k': 8,
        'kwargs': {'max_retries': 3},
      },
      {
        'k': 1,
        'probs': [0.047619047619047616, 0.09523809523809523, 0.047619047619047616, 0.09523809523809523, 0.047619047619047616, 0.09523809523809523, 0.09523809523809523, 0.047619047619047616, 0.14285714285714285, 0.14285714285714285, 0.017857142857142856, 0.017857142857142856, 0.017857142857142856, 0.017857142857142856, 0.017857142857142856, 0.017857142857142856, 0.017857142857142856, 0.017857142857142856],
        'kwargs': {'max_retries': 3},
      },
  ]
  for test in tests:
      output = choose_renormalize(test['probs'], test['k'], **test['kwargs'])
      print output

# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
def basic_choose_one(probs, mass=1):
    #
    # This defines a random number between 0 and "mass", which should cover the entire
    # domain of the probability distribution. Then we will "walk" the probability mass
    # until we exceed the generated value
    # r = mass * random.random()
    r = mass * 0.5
    i = 0
    s = probs[0]
    while s < r:
        i += 1
        s += probs[i]

    return i

def mean(array):
    return functools.reduce(lambda a,b : a+b, array) / len(array)

def choose_renormalize(probs, k, **kwargs):
    #
    # If we have more work slots than candidates in the probability distribution,
    # we return them all
    #if k >= len(probs):
    #    return range(len(probs))


    #
    # Initializing list to be returned
    choices = []
    #
    # Since we are mutating the probabilities vector, we copy it first
    p = probs[:]
    #
    # This assumes that the probability vector is normalized. If it is not, it
    # should be changed to the sum of the weights
    remaining = 1
    #
    # The weight of an additional "ghost" element that we will use to
    # inhibit running tasks that should have low probability
    DAMPENING_FACTOR = min(mean(probs), 0.05)
    #
    for j in range(k):
        #
        # Perform choice adding an additional "ghost" element that can be tweaked
        # to control execution eagerness
        i = basic_choose_one(p + [DAMPENING_FACTOR],
                             mass=remaining + DAMPENING_FACTOR)
        #
        # If we choose a _real_ task, instead of the _ghost_ task, execute the logic
        # inside the conditional
        if i < len(p):
            #
            # Add selected element to the selection set
            choices.append(i)
            #
            # Eliminate chosen element from distribution and renormalize
            remaining -= p[i]
            p[i] = 0
    #
    # Return list with task selections
    return choices

# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
if __name__ == "__main__":
    main()
