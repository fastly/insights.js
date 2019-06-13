const getElements = (element: string): Element[] =>
  [].slice.call(document.getElementsByTagName(element));
const elementHasSource = (el: Element): boolean => el.hasAttribute("src");
const getSrc = (el: Element): string => el.getAttribute("src") || "";

export default function getParameters(srcRegExp: RegExp): QueryParameters {
  const script = getElements("script")
    .filter(elementHasSource)
    .find((s): boolean => !!getSrc(s).match(srcRegExp));

  let result: QueryParameters = {};

  if (script) {
    const src = getSrc(script);
    const url = new URL(src);

    result = Array.from(url.searchParams.entries()).reduce(
      (
        res: QueryParameters,
        [key, value]: [string, string]
      ): QueryParameters => {
        res[key] = value;
        return res;
      },
      {}
    );
  }

  return result;
}
