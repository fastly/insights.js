import "unfetch/polyfill";
import { CONFIG_URL } from "./constants";
import retry from "./util/promiseRetry";
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

function getConfig(url: string): Promise<Config> {
  const toJSON = (res: FetchResponse): Promise<Config> =>
    res.json() as Promise<Config>;
  const fetchJSON = (): Promise<Config> => fetch(url).then(toJSON);
  return retry(fetchJSON);
}

export function init({ k: apiToken }: QueryParameters): Promise<Beacon[]> {
  const configUrl = `${CONFIG_URL}${apiToken}`;
  return getConfig(configUrl).then(runTasks);
  // TODO: deal with errors
}
