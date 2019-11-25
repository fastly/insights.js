import { SCRIPT_SRC_REGEXP } from "./constants";
import { hasProperties } from "./util/object";
import loadWhenDocumentReady from "./util/loadWhenDocumentReady";
import getScriptParameters from "./util/scriptQueryParameters";
import * as worker from "./worker";

// Declare FASTLY global which is used later when assigning the returned state
declare global {
  interface Window {
    FASTLY?: Fastly;
  }
}

// List of required features browser features
const requiredFeatures = ["Worker", "Promise", "fetch"];
// Test whether browser has required feature support
const hasFeatureSupport = hasProperties(window, requiredFeatures);

// Define global state
const state: Fastly = {
  client: {
    hasFeatureSupport
  },
  // The are certain scenarios (such as the demo website) in which the global
  // FASTLY and the results array already exists.
  results: (window.FASTLY && window.FASTLY.results) || []
};

// Init initializes the library when the browser is ready
export function init(): void {
  loadWhenDocumentReady((): void => {
    const params = getScriptParameters(SCRIPT_SRC_REGEXP);
    worker
      .init(params)
      .then((results: Beacon[]): void => {
        // We use apply here as we don't want to directly assign i.e.
        // replace the existing results array.
        Array.prototype.push.apply(state.results, results);
      })
      .catch((): void => {});
  });
}

// If browser has feature support,
// initialize the library
if (hasFeatureSupport) {
  init();
}

// Expose global state as default export
// Webpack assigns this return value to the global window.FASTLY;
export default state;
