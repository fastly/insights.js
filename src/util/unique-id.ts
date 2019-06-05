/**
 * Generate a random hex digit
 * @param a - a 0, 1, 4, or 8
 */
export function randomHex(a: string): string {
  const intA = parseInt(a, 10);
  return (intA ^ ((Math.random() * 16) >> (intA / 4))).toString(16);
}

/**
 * A unique identifier for this specific test instance/run
 * Implementation from https://gist.github.com/jed/982883
 * Returns a random v4 UUID of the form xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx,
 * where each x is replaced with a random hexadecimal digit from 0 to f,
 * and y is replaced with a random hexadecimal digit from 8 to b.
 */
export function generateId(): string {
  return `${1e7}-${1e3}-${4e3}-${8e3}-${1e11}`.replace(/[018]/g, randomHex);
}
