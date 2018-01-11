/*eslint guard-for-in:0*/
import compose from "../util/compose";
import camelCaseToUnderscore from "../util/camel-to-underscore";
import PerformanceObserver from "./performance-observer";

const EXCLUDED_PROPS = ["name", "initiatorType", "entryType"];

function asyncGetEntry(name, timeout = 5000) {
  return new Promise((resolve, reject) => {
    let entry;

    const observer = new PerformanceObserver((list, observer) => {
      const namedEntries = list.getEntriesByName(name);
      entry = namedEntries.shift();

      if (entry) {
        observer.disconnect();
        resolve(entry);
      }
    });

    setTimeout(() => {
      if (!entry) {
        observer.disconnect();
        reject(new Error("Timed out observing resource timing"));
      }
    }, timeout);

    try {
      observer.observe({ entryTypes: ["resource"] });
    } catch (e) {
      reject(e);
    }
  });
}

function cloneEntry(entry) {
  const clone = {};

  for (const key in entry) {
    const type = typeof entry[key];
    if (type === "number" || type === "string") {
      clone[key] = entry[key];
    }
  }
  return clone;
}

function removeEntryProps(entry, props) {
  return Object.keys(entry).reduce((res, key) => {
    if (props.indexOf(key) < 0) {
      res[key] = entry[key];
    }
    return res;
  }, {});
}

function normalizeEntryKeys(entry) {
  return Object.keys(entry).reduce((res, key) => {
    const newKey = camelCaseToUnderscore(key);
    res[newKey] = entry[key];
    return res;
  }, {});
}

function normalizeEntryProps(props) {
  return entry => removeEntryProps(entry, props);
}

const normalizeEntry = compose(
  normalizeEntryKeys,
  normalizeEntryProps(EXCLUDED_PROPS),
  cloneEntry
);

export {
  asyncGetEntry,
  cloneEntry,
  removeEntryProps,
  normalizeEntryKeys,
  normalizeEntryProps,
  normalizeEntry
};
