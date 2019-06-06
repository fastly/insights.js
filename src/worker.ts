import "unfetch/polyfill";
import { CONFIG_URL } from "./constants";
import Fetch from "./tasks/fetch";
import Pop from "./tasks/pop";
import Task from "./tasks/task";

interface TaskLookup {
  [key: string]: typeof Task;
}

const TASK_LOOKUP: TaskLookup = {
  pop: Pop,
  fetch: Fetch
};

function runTasks(configuration: Config): Promise<Beacon[]> {
  const promises = configuration.tasks.map(
    (taskData): Promise<Beacon> => {
      const TaskClass = TASK_LOOKUP[taskData.type];
      if (TaskClass) {
        const task = new TaskClass(configuration, taskData);
        return task.execute();
      }
      return Promise.reject(`Unknown task type: ${taskData.type}`);
    }
  );
  return Promise.all(promises);
}

export function init(): Promise<Beacon[]> {
  return fetch(CONFIG_URL)
    .then(
      (res: FetchResponse): Promise<Config> => res.json() as Promise<Config>
    )
    .then(
      (configuration: Config): Promise<Beacon[]> => runTasks(configuration)
    );
  // TODO: deal with errors
}
