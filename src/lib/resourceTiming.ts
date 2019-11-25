/*eslint guard-for-in:0*/
import PerformanceObserver from "@fastly/performance-observer-polyfill";
import compose from "../util/compose";
import camelCaseToSnakeCase from "../util/camelCaseToSnakeCase";

const EXCLUDED_PROPS = ["name", "initiatorType", "entryType"];

/**
 * Asyncronusly gets a resource timing entry from the performance timeline
 * by its name (url). It starts a PerformanceObserver to observe the timeling
 * for the entry and resolves with the entry once successful. If the timeout is
 * reached before and entry is returned it rejects the Promise.
 *
 * @param {string}  name        URL of the of the entry
 * @param {number=} timeout     Optional parameter.
 *
 * @returns {Promise<ResourceTimingEntry>}
 *
 */
function asyncGetEntry(
  name: string,
  timeout = 5000
): Promise<ResourceTimingEntry> {
  return new Promise((resolve, reject): void => {
    let entry: PerformanceEntry | undefined;

    const observer = new PerformanceObserver(
      (
        list: PerformanceObserverEntryList,
        observer: PerformanceObserver
      ): void => {
        const namedEntries = list.getEntriesByName(name);
        entry = namedEntries.shift();

        if (entry) {
          observer.disconnect();
          resolve((entry as any) as ResourceTimingEntry);
        }
      }
    );

    setTimeout((): void => {
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

function cloneEntry(entry: ResourceTimingEntry): ResourceTimingEntry {
  const result: ResourceTimingEntry = {};
  for (const key in entry) {
    const type = typeof entry[key];
    if (type === "number" || type === "string") {
      result[key] = entry[key];
    }
  }
  return result;
}

function removeEntryProps(
  entry: ResourceTimingEntry,
  props: string[]
): ResourceTimingEntry {
  const result: ResourceTimingEntry = {};
  return Object.keys(entry).reduce((res, key): ResourceTimingEntry => {
    if (props.indexOf(key) < 0) {
      res[key] = entry[key];
    }
    return res;
  }, result);
}

function normalizeEntryKeys(entry: ResourceTimingEntry): ResourceTimingEntry {
  const result: ResourceTimingEntry = {};
  return Object.keys(entry).reduce((res, key): ResourceTimingEntry => {
    const newKey = camelCaseToSnakeCase(key);
    res[newKey] = entry[key];
    return res;
  }, result);
}

function normalizeEntryProps(
  props: string[]
): (entry: ResourceTimingEntry) => ResourceTimingEntry {
  return (entry): ResourceTimingEntry => removeEntryProps(entry, props);
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
