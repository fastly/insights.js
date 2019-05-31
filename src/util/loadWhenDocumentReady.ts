// Utility to load a function when the browsers ready state is complete
export default function loadWhenReady(fn: () => void): void {
  if (document.readyState !== "complete") {
    document.addEventListener(
      "readystatechange",
      (): void => {
        if (document.readyState === "complete") {
          fn();
        }
      }
    );
  } else {
    fn();
  }
}
