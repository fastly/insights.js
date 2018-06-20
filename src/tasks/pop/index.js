import assign from "../../util/assign";

import Task from "../task";
import { transform as popsToTasks } from "./configure-tasks";
import { asyncGetEntry, normalizeEntry } from "../../lib/resource-timing";

class Pop extends Task {
  constructor(config) {
    super(config);
    this.url = `https://${this.config.host}/o.svg?u=${this.config.testId}`;
    this.url = this.url.toLowerCase();
  }

  static get hasCustomConfiguration() {
    return true;
  }

  static configure(config) {
    // Initialise tasks from config
    const requiredPopCount = 4;
    const randomPopCount = 4;
    return popsToTasks(config, requiredPopCount, randomPopCount);
  }

  fetchObjectAndId() {
    return fetch(this.url).then(res => res.headers.get("X-Datacenter"));
  }

  prefixKeys(obj, prefix) {
    return Object.keys(obj).reduce((clone, key) => {
      clone[prefix + key] = obj[key];
      return clone;
    }, {});
  }

  run() {
    let subjectId;

    return Promise.all([this.fetchObjectAndId(), asyncGetEntry(this.url)])
      .then(([id, entry]) => (subjectId = id) && entry)
      .then(normalizeEntry)
      .then(timing => {
        const meta = { id: subjectId, attempted_id: this.config.id };
        const data = this.prefixKeys(assign(meta, timing), "subject_");
        return data;
      });
  }
}

export default Pop;
