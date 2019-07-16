import assign from "../util/assign";
import prefixKeys from "../util/prefixKeys";

import Task from "./task";
import { asyncGetEntry, normalizeEntry } from "../lib/resourceTiming";

export default class Pop extends Task {
  public constructor(config: Config, taskData: TaskData) {
    super(config, taskData);
  }

  private fetchObjectAndId(): Promise<string> {
    return fetch(this.data.resource).then(
      (res): string => res.headers.get("X-Datacenter") || ""
    );
  }

  protected test(): Promise<ResourceTimingEntry> {
    return Promise.all([
      this.fetchObjectAndId(),
      asyncGetEntry(this.data.resource)
    ]).then(
      ([id, entry]): ResourceTimingEntry => {
        // eslint-disable-next-line @typescript-eslint/camelcase
        const meta = { id, attempted_id: this.data.id };
        const timing = normalizeEntry(entry);
        return prefixKeys(assign(meta, timing), "subject_");
      }
    );
  }
}
