import assign from "../../util/assign";
import prefixKeys from "../../util/prefix-keys";

import Task from "../task";
import { asyncGetEntry, normalizeEntry } from "../../lib/resource-timing";

class Fetch extends Task {
  constructor(config) {
    super(config);
    this.url = `https://${this.config.host}/o.svg?u=${this.config.testId}`;
    this.url = this.url.toLowerCase();
  }

  fetchObjectAndId() {
    return fetch(this.url).then(res => res.headers.get("X-Datacenter"));
  }

  run() {
    let subjectId;

    const delay = /any[2]?-v4/.test(this.url) ? 1000 : 0;

    return Promise.all([
      this.fetchObjectAndId(),
      asyncGetEntry(this.url, 5000, delay)
    ])
      .then(([id, entry]) => (subjectId = id) && entry)
      .then(normalizeEntry)
      .then(timing =>
        prefixKeys(assign({ id: subjectId }, timing), "subject_")
      );
  }
}

export default Fetch;
