import { QueryParameters } from "../@types";

const getElements = (element: string): Element[] =>
  [].slice.call(document.getElementsByTagName(element));
const elementHasSource = (el: Element): boolean => el.hasAttribute("src");
const getSrc = (el: Element): string => el.getAttribute("src") || "";

export default function getParameters(srcRegExp: RegExp): QueryParameters {
  const script = getElements("script")
    .filter(elementHasSource)
    .find((s): boolean => !!getSrc(s).match(srcRegExp));

  const result: QueryParameters = {};

  if (script) {
    const src = getSrc(script);
    const url = new URL(src);

    // Also return the full hostname so we can use for configuration.
    result.host = url.origin;

    // We can't use url.searchParams.entries().reduce() here as lib.d.ts
    // doesn't declare the entries iterable type on the object :(
    url.searchParams.forEach((value: string, key: string): void => {
      result[key] = value;
    });
  }

  return result;
}
