/**
 * polyfill for Object.assign()
 * @param args - an array of objects to be assigned on top of each other
 */
export default function assign(...args: any[]): any {
  const to = Object(args[0]);
  for (let index = 1; index < args.length; index++) {
    const nextSource = args[index];

    // eslint-disable-next-line eqeqeq
    if (nextSource != null) {
      // Skip over if undefined or null
      for (const nextKey in nextSource) {
        // Avoid bugs when hasOwnProperty is shadowed
        if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
          to[nextKey] = nextSource[nextKey];
        }
      }
    }
  }
  return to;
}
