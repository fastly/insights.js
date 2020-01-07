import "unfetch/polyfill";
import { CONFIG_PATH } from "./constants";
import chooseRandomTasks from "./lib/chooseRandomTasks";
import filterTasksByClientClassification from "./lib/filterTasksByClientClassification";
import retry from "./util/promiseRetry";
import sequence from "./util/promiseSequence";
import { create as createTask } from "./tasks";
import Task from "./tasks/task";

function runTasks(configuration: Config): Promise<Beacon[]> {
  const {
    client,
    settings: { max_tasks: maxTasks },
    tasks
  } = configuration;
  const possibleTasks = filterTasksByClientClassification(tasks, client);
  const selectedTasks = chooseRandomTasks(possibleTasks, maxTasks);
  const hydratedTasks = selectedTasks.map(
    (taskData): Task => createTask(configuration, taskData)
  );
  const taskQueue = hydratedTasks.map((task): (() => Promise<
    Beacon
  >) => (): Promise<Beacon> => task.execute());

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
  const configHost =
    host === "https://www.fastly-insights.com"
      ? "https://fastly-insights.com"
      : host;
  const configUrl = `${configHost}${CONFIG_PATH}${apiToken}`;
  return getConfig(configUrl)
    .then(runTasks)
    .catch((): Beacon[] => {
      // TODO: deal with errors
      return [];
    });
}
