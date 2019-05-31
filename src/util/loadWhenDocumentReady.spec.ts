import loadWhenDocumentReady from "./loadWhenDocumentReady";

describe("loadWhenReady", (): void => {
  it("should call function when document is ready", (): void => {
    // Redefine getter for document.readyState to return loading
    Object.defineProperty(document, "readyState", {
      // Must be configurable to allow redefinition later in test
      configurable: true,
      get(): string {
        return "loading";
      }
    });

    // Setup mock and call function
    const mock = jest.fn();
    loadWhenDocumentReady(mock);

    // Mock shouldn't have been called as readystate is loading
    expect(mock).not.toBeCalled();

    // Redefine document.readyState to complete
    Object.defineProperty(document, "readyState", {
      get(): string {
        return "complete";
      }
    });

    // Trigger readystatechange event
    const event = new Event("readystatechange");
    document.dispatchEvent(event);

    // Mock should have been called
    expect(mock).toBeCalled();
  });
});
