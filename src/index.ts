import { SCRIPT_SRC_REGEXP } from "./constants";
import { hasProperties } from "./util/object";
import loadWhenDocumentReady from "./util/loadWhenDocumentReady";
import getScriptParameters from "./util/scriptQueryParameters";
import Worker from "workerize-loader?inline!./worker";

// List of required features browser features
const requiredFeatures = ["Worker", "Promise", "fetch"];
// Test whether browser has required feature support
const hasFeatureSupport = hasProperties(window, requiredFeatures);

// Define global state
const state: Fastly = {
  client: {
    hasFeatureSupport
  }
};

// Init initializes the library when the browser is ready
export function init(): void {
  loadWhenDocumentReady(
    (): void => {
      const params = getScriptParameters(SCRIPT_SRC_REGEXP);
      const worker = new Worker();
      worker.init(params);
    }
  );
}

// If browser has feature support,
// initialize the library
if (hasFeatureSupport) {
  init();
}

// Expose global state as default export
// Webpack assigns this return value to the global window.FASTLY;
export default state;
