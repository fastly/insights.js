import { init, ClientSettingsBuilder } from "@openinsights/openinsights";
import {
  Provider as FastlyProvider,
  Settings,
} from "@fastly/open-insights-provider-fastly";

import { Fastly, QueryParameters } from "./@types";
import { hasProperties } from "./util/object";
import getScriptParameters from "./util/scriptQueryParameters";
import { SCRIPT_SRC_REGEXP, CONFIG_PATH } from "./constants";

// Declare FASTLY global which is used later when assigning the returned state
declare global {
  interface Window {
    FASTLY?: Fastly;
  }
}

// List of required features browser features
const requiredFeatures = ["Promise", "fetch"];
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
      : host;
  return `${configHost}${CONFIG_PATH}${token}`;
}

// If browser has feature support,
// initialize the library
if (hasFeatureSupport) {
  const params = getScriptParameters(SCRIPT_SRC_REGEXP);

  const settingsBuilder = new ClientSettingsBuilder();
  const settings: Settings = {
    config_url: paramsToConfigUrl(params),
    report_errors: true,
    token: params.token,
  };

  settingsBuilder.addProvider(new FastlyProvider(settings));

  init(settingsBuilder.toSettings()).then((result) => {
    // We use apply here as we don't want to directly assign i.e.
    // replace the existing results array, there are also certain scenarios
    // (such as the demo website) in which the results array already exists as
    // an Array-like object and thus using apply() is required.
    Array.prototype.push.apply(
      state.results,
      result.testResults
        .filter((r) => r.beaconData !== undefined)
        /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */
        .map((r) => r!.beaconData!.data)
    );
  });
}

// Expose global state as default export
// Webpack assigns this return value to the global window.FASTLY;
export default state;
