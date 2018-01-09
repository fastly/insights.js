export default class PerformanceObserverEntryList {
  constructor(list) {
    this.list = list;
  }

  getEntries() {
    return this.list;
  }

  getEntriesByType(type) {
    return this.list.filter(e => e.type === type);
  }

  getEntriesByName(name, type) {
    return this.list
      .filter(e => e.name === name)
      .filter(e => (type ? e.type === type : true));
  }
}
