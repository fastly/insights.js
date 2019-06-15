import "unfetch/polyfill";
import { CONFIG_URL } from "./constants";
import chooseRandomTasks from "./lib/chooseRandomTasks";
import retry from "./util/promiseRetry";
import sequence from "./util/promiseSequence";
import { create as createTask } from "./tasks";
import Task from "./tasks/task";

function runTasks(configuration: Config): Promise<Beacon[]> {
  const {
    settings: { max_tasks: maxTasks },
    tasks
  } = configuration;
  const selectedTasks = chooseRandomTasks(tasks, maxTasks);
  const hydratedTasks = selectedTasks.map(
    (taskData): Task => createTask(configuration, taskData)
  );
  const taskQueue = hydratedTasks.map(
    (task): (() => Promise<Beacon>) => (): Promise<Beacon> => task.execute()
  );

  return sequence(taskQueue);
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
