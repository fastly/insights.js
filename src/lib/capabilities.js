const hasTimings =
  "performance" in window &&
  "undefined" !== typeof window.performance &&
  "undefined" !== typeof window.performance.getEntriesByType;

const hasBeacon =
  "navigator" in window &&
  "undefined" !== typeof window.navigator &&
  "undefined" !== typeof window.navigator.sendBeacon;

const entries = hasTimings
  ? window.performance.getEntriesByType("resource")
  : null;
const timingsNotBroken = hasTimings && entries.length > 0;

export default {
  hasBeacon,
  hasTimings: hasTimings && timingsNotBroken,
  hasRanRecently: document.cookie.indexOf("fastlyPerf=") > -1,
  isHTTP: window.location.protocol === "http:"
};
