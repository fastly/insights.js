declare module "workerize-loader!*" {
  class WorkerizeWorker extends Worker {
    public constructor();
    public init(params: QueryParameters): Promise<Config>;
  }

  export default WorkerizeWorker;
}
