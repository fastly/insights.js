import arrayFrom from "core-js/library/fn/array/from";

import EntryList from "./entry-list";

class PerformanceObserverTaskQueue {
  constructor({
    registeredObservers = new Set(),
    processedEntries = new Set(),
    interval = 100,
    validTypes = ["mark", "measure", "navigation", "resource"],
    context = window || self
  } = {}) {
    this.registeredObservers = registeredObservers;
    this.processedEntries = processedEntries;
    this.interval = interval;
    this.validTypes = validTypes;
    this.context = context;
    this.intervalId = null;
  }

  getNewEntries() {
    const entries = this.context.performance.getEntries();
    return entries.filter(e => !this.processedEntries.has(e));
  }

  getObserversForType(observers, type) {
    return arrayFrom(observers).filter(observer => {
      return observer.entryTypes.some(t => t === type);
    });
  }

  processBuffer(observer) {
    const entries = arrayFrom(observer.buffer);
    const entryList = new EntryList(entries);
    observer.buffer.clear();

    if (entries.length) {
      observer.callback.call(undefined, entryList, observer);
    }
  }

  processEntries() {
    // Get all new entries
    const entries = this.getNewEntries();

    // For each entry
    entries.forEach(entry => {
      // Get interested observers for entry type
      const { entryType: type } = entry;
      const observers = this.getObserversForType(
        this.registeredObservers,
        type
      );
      // Add the entry to observer buffer
      observers.forEach(observer => {
        observer.buffer.add(entry);
      });
      // Mark the entry as processed
      this.processedEntries.add(entry);
    });

    // Queue task to process all observer buffers
    requestAnimationFrame(() => {
      this.registeredObservers.forEach(this.processBuffer);
    });
  }

  add(observer) {
    this.registeredObservers.add(observer);

    if (this.registeredObservers.size === 1) {
      this.observe();
    }
  }

  remove(observer) {
    this.registeredObservers.delete(observer);

    if (!this.registeredObservers.size) {
      this.disconnect();
    }
  }

  observe() {
    this.intervalId = setInterval(
      this.processEntries.bind(this),
      this.interval
    );
  }

  disconnect() {
    this.intervalId = clearInterval(this.intervalId);
  }
}

export default PerformanceObserverTaskQueue;
