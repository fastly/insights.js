function includes(arr, searchElement, fromIndex) {
  if (!Array.prototype.includes) {
    const len = arr.length;
    if (len === 0) {
      return false;
    }

    let i = fromIndex | 0;
    i = Math.max(i >= 0 ? i : len - Math.abs(i), 0);

    function sameValueZero(x, y) {
      return (
        x === y ||
        (typeof x === "number" && typeof y === "number" && isNaN(x) && isNaN(y))
      );
    }

    while (i < len) {
      if (sameValueZero(arr[i], searchElement)) {
        return true;
      }
      i++;
    }

    return false;
  } else {
    return arr.includes(searchElement, fromIndex);
  }
}

export default includes;
