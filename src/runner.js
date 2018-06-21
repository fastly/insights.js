import assign from "./util/assign";
import sequence from "./util/sequence";

export default class Runner {
  constructor(tasks) {
    this.version = "<% VERSION %>";
    this.state = {
      initialized: false,
      running: false,
      hasRan: false
    };
    this.tasks = tasks;
    this.taskQueue = [];
  }

  // Certain tasks require dynamic configuration
  getCustomTaskConfiguration(tasks, config) {
    // Filter tasks which need custom configh and call static configure method
    return Object.keys(tasks)
      .filter(task => tasks[task].hasCustomConfiguration)
      .map(task => tasks[task].configure(config))
      .reduce((a, b) => a.concat(b), []);
  }

  // Hydrate each task config with additonal global properties
  // Such as: apiKey, session etc
  composeTaskConfig({ apiKey, session, server, hosts }, taskConfig) {
    return assign({}, taskConfig, { apiKey, session, server, hosts });
  }

  init(config) {
    //Exit if no config
    if (!config) {
      return Promise.reject("Config required to initialize");
    }

    // Exit if already initialized
    if (this.state.initialized) {
      return Promise.reject("Already initialized");
    }

    // Finish initilization
    this.state.initialized = true;

    const Tasks = this.tasks;

    // Assign config
    this.config = config;
    this.config.hosts = config.settings.hosts;

    // Generate task list
    const defaultTasks = config.tasks || [];
    const customTasks = this.getCustomTaskConfiguration(Tasks, config);
    const allTasks = (this.taskConfig = [].concat(defaultTasks, customTasks));
    const hydratedTasks = (this.taskConfig = allTasks.map(task =>
      this.composeTaskConfig(config, task)
    ));

    // Init each tasklist to a Task instance
    const tasks = hydratedTasks.map(task => new Tasks[task.type](task));

    // Generate queue task of functions to run
    this.taskQueue = tasks.map(task => () => task.execute());

    // Run tasks!
    return this.run();
  }

  run() {
    // Exit if runner isn't initialized
    if (!this.state.initialized) {
      return Promise.reject("Runner must be initialized before running");
    }

    // Exit if we've already ran the task queue
    if (this.state.hasRan || this.state.running) {
      return Promise.reject("Already ran");
    }

    this.state.running = true;

    // Run tests sequentially
    return sequence(this.taskQueue)
      .then(data => (this.results = data))
      .then(() => {
        this.state.running = false;
        return (this.state.hasRan = true);
      });
  }
}
