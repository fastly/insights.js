import scriptQueryParameters from "./scriptQueryParameters";

function createScriptElement(src: string): void {
  const el = document.createElement("script");
  el.src = src;
  document.body.appendChild(el);
}

function removeScriptElement(src: string): void {
  const scripts: Element[] = [...document.getElementsByTagName("script")];
  const script: Element | undefined = scripts.find(
    (s): boolean => s.getAttribute("src") === src
  );
  if (script instanceof Element) {
    document.body.removeChild(script);
  }
}

describe("scriptQueryParameters", (): void => {
  it("should return empty object if no script tag is found", (): void => {
    const result = scriptQueryParameters(/foo/);
    expect(result).toEqual({});
  });

  it("should return query parameters as object", (): void => {
    const tests = [
      {
        src: "https:://test.com/path?foo=bar",
        matcher: /test\.com/,
        expected: {
          foo: "bar"
        }
      },
      {
        src: "https:://test.com/path?foo=bar&baz=qux%20qaz",
        matcher: /test\.com/,
        expected: {
          foo: "bar",
          baz: "qux qaz"
        }
      }
    ];

    for (const test of tests) {
      createScriptElement(test.src);
      const result = scriptQueryParameters(test.matcher);
      expect(result).toEqual(test.expected);
      removeScriptElement(test.src);
    }
  });
});
