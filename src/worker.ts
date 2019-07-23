import "unfetch/polyfill";
import { CONFIG_PATH } from "./constants";
import chooseRandomTasks from "./lib/chooseRandomTasks";
import retry from "./util/promiseRetry";
import sequence from "./util/promiseSequence";
import { create as createTask } from "./tasks";
import Task from "./tasks/task";

declare const PRODUCTION: string;

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

export function init({
  host,
  k: apiToken
}: QueryParameters): Promise<Beacon[]> {
  const configHost = PRODUCTION ? host : "https://test.fastly-insights.com";
  const configUrl = `${configHost}${CONFIG_PATH}${apiToken}`;
  return getConfig(configUrl)
    .then(runTasks)
    .catch(
      (): Promise<Beacon[]> => {
        // TODO: deal with errors
        return Promise.resolve([]);
      }
    );
}
