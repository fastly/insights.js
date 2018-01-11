import PerformanceObserverTaskQueue from "./task-queue.js";

const VALIDTYPES = ["mark", "measure", "navigation", "resource"];
const ERRORS = {
  "no-entry-types": `Failed to execute 'observe' on 'PerformanceObserver': required member entryTypes is undefined.`,
  "invalid-entry-types": `Failed to execute 'observe' on 'PerformanceObserver': A Performance Observer MUST have at least one valid entryType in its entryTypes attribute.`
};

const isValidType = type => VALIDTYPES.some(t => type === t);

const globalTaskQueue = new PerformanceObserverTaskQueue();

class PerformanceObserver {
  constructor(callback = () => {}, taskQueue = globalTaskQueue) {
    this.callback = callback;
    this.entryTypes = [];
    this.buffer = new Set();
    this.taskQueue = taskQueue;
  }

  observe({ entryTypes } = {}) {
    if (!entryTypes) {
      throw new Error(ERRORS["no-entry-types"]);
    }

    entryTypes = entryTypes.filter(isValidType);

    if (!entryTypes.length) {
      throw new Error(ERRORS["invalid-entry-types"]);
    }

    this.entryTypes = entryTypes;

    this.taskQueue.add(this);
  }

  disconnect() {
    this.taskQueue.remove(this);
  }
}

export default PerformanceObserver;
