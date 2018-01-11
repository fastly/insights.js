export default function camelCaseToUnderscore(str) {
  return str
    .replace(/(?:^|\.?)([A-Z])/g, (x, y) => "_" + y.toLowerCase())
    .replace(/^_/, "");
}
