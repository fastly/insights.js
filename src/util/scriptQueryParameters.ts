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
    const urlAndQuery = src.split("?");

    if (urlAndQuery.length === 2 && urlAndQuery[1] !== "") {
      const query = urlAndQuery[1];
      const queryParts = query.split("&");

      result = queryParts.reduce((data, part): QueryParameters => {
        const pair = part.split("=");
        const key = pair[0] || "";
        const value = pair[1] || "";

        data[decodeURIComponent(key)] = decodeURIComponent(value);

        return data;
      }, result);
    }
  }

  return result;
}
