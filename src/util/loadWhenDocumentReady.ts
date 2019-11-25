// Utility to load a function when the browsers ready state is complete
export default function loadWhenReady(fn: () => void): void {
  // If document is ready, invoke func
  if (document.readyState === "complete") {
    fn();
    return;
  }

  // Otherwise, attach event listener to invoke when ready
  document.addEventListener("readystatechange", (): void => {
    if (document.readyState === "complete") {
      fn();
    }
  });
}
