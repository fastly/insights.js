declare module "workerize-loader!*" {
  class WorkerizeWorker extends Worker {
    public constructor();
    public init(): void;
  }

  export const mockInit: jest.Mock;
  export default WorkerizeWorker;
}
