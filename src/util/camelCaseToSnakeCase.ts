export default function camelCaseToSnakeCase(str: string): string {
  return str
    .replace(/(?:^|\.?)([A-Z])/g, (x, y): string => "_" + y.toLowerCase())
    .replace(/^_/, "");
}
