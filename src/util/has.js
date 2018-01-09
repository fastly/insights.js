export default function hasOwnNestedProperty(obj, propertyPath) {
  return propertyPath.split(".").every(prop => {
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
  });
}
