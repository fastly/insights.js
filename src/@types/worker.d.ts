declare module "workerize-loader?inline!*" {
  class WorkerizeWorker extends Worker {
    public constructor();
    public init(params: QueryParameters): Promise<Config>;
  }

  export default WorkerizeWorker;
}
