function find(arr, predicate, t) {
  let i = 0;
  const len = arr.length;

  while (i < len) {
    const val = arr[i];
    if (predicate.call(t, val, i, arr)) {
      return val;
    }
    i++;
  }

  return undefined;
}

export default find;
