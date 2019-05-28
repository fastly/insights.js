import * as lib from "./worker";

if ("Worker" in window && "Promise" in window) {
  const worker = (lib as any)() as typeof lib;

  console.log("Hello from main thread!");

  worker.init();
}
