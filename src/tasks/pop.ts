import Task from "./task";

export default class Pop extends Task {
  public constructor(config: Config, taskData: TaskData) {
    super(config, taskData);
  }

  protected test(): Promise<any> {
    return Promise.resolve();
  }
}
