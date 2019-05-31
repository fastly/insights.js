// Utility function to test whether an object has own nested property
// This is used instead of Object.prototype.hasOwnProperty() due to browser support
// Accpets object path in dot notation form
export function hasProperty(obj: any, propertyPath: string): boolean {
  return propertyPath.split(".").every(
    (prop: string): boolean => {
      if (
        typeof obj !== "object" ||
        obj === null ||
        !(prop in obj) ||
        typeof obj[prop] === "undefined"
      ) {
        return false;
      } else {
        obj = obj[prop];
        return true;
      }
    }
  );
}

// Utility to test whether an object has all nested properties within a list
export function hasProperties(obj: any, properties: string[]): boolean {
  let hasProps;
  // Try/catch is used to guard against lack of .every() support
  try {
    hasProps = properties.every((prop): boolean => hasProperty(obj, prop));
  } catch (e) {
    hasProps = false;
  }
  return hasProps;
}
