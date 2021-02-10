import { init, ClientSettingsBuilder } from "open-insights";
import { Provider, Settings } from "open-insights-provider-fastly";

import { Fastly, QueryParameters } from "./@types";
import { hasProperties } from "./util/object";
import getScriptParameters from "./util/scriptQueryParameters";
import { SCRIPT_SRC_REGEXP, CONFIG_HOST, CONFIG_PATH } from "./constants";

// Declare FASTLY global which is used later when assigning the returned state
declare global {
  interface Window {
    FASTLY?: Fastly;
  }
}

// List of required features browser features
const requiredFeatures = ["Worker", "Promise", "fetch"];
// Test whether browser has required feature support
const hasFeatureSupport =
  hasProperties(window, requiredFeatures) &&
  "getEntriesByType" in performance &&
  typeof performance.getEntriesByType === "function";

// Define global state
const state: Fastly = {
  client: {
    hasFeatureSupport,
  },
  // The are certain scenarios (such as the demo website) in which the global
  // FASTLY and the results array already exists.
  results: (window.FASTLY && window.FASTLY.results) || [],
};

function paramsToConfigUrl({ host, k: token }: QueryParameters): string {
  const configHost =
    host === "https://www.fastly-insights.com"
      ? "https://fastly-insights.com"
      : CONFIG_HOST;
  return `${configHost}${CONFIG_PATH}${token}`;
}

const params = getScriptParameters(SCRIPT_SRC_REGEXP);

const settingsBuilder = new ClientSettingsBuilder();
const settings: Settings = {
  max_tasks: 10,
  sample_rate: 1,
  config_url: paramsToConfigUrl(params),
  report_errors: true,
  token: params.token,
};

settingsBuilder.addProvider(new Provider(settings));

// If browser has feature support,
// initialize the library
if (hasFeatureSupport) {
  init(settingsBuilder.toSettings()).then((result) => {
    // We use apply here as we don't want to directly assign i.e.
    // replace the existing results array.
    Array.prototype.push.apply(state.results, result.testResults);
  });
}

// Expose global state as default export
// Webpack assigns this return value to the global window.FASTLY;
export default state;
