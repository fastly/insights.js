/* eslint "@typescript-eslint/explicit-module-boundary-types": off */

// Utility function to test whether an object has own nested property
// This is used instead of Object.prototype.hasOwnProperty() due to browser support
export function hasProperty(obj: any, prop: string): boolean {
  let hasProp: boolean;
  try {
    hasProp = obj.hasOwnProperty(prop);
  } catch (e) {
    hasProp = !(
      typeof obj !== "object" ||
      obj === null ||
      !(prop in obj) ||
      typeof obj[prop] === "undefined"
    );
  }

  if (hasProp) {
    obj = obj[prop];
  }

  return hasProp;
}

// Utility to test whether an object has all nested properties within a list
export function hasProperties(obj: any, properties: string[]): boolean {
  let hasProps;
  // Try/catch is used to guard against lack of .every() support
  try {
    hasProps = properties.every((prop): boolean => hasProperty(obj, prop));
  } catch (e) {
    console.log("inside");
    hasProps = false;
  }
  return hasProps;
}
