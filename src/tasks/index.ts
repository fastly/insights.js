import Task from "./task";
import Fetch from "./fetch";
import Pop from "./pop";

interface Dictionary<T> {
  [key: string]: T;
}

interface TaskConstructor {
  new (config: Config, taskData: TaskData): Task;
}

const Tasks: Dictionary<TaskConstructor> = {
  fetch: Fetch,
  pop: Pop
};

export function create(config: Config, taskData: TaskData): Task {
  return new Tasks[taskData.type](config, taskData);
}
