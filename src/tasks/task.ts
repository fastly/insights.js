import assign from "../util/assign";
import { generateId } from "../util/unique-id";
import { beacon } from "../util/beacon";
import { getClientInfo } from "../util/client-info";

interface State {
  hasRan: boolean;
}

class Task {
  public config: any = {};
  public result: any = {};
  public state: State = { hasRan: false };

  public constructor(config: any) {
    // TODO: more strict typing here
    this.config = assign({}, config, { testId: generateId() });
  }

  public static get hasCustomConfiguration(): boolean {
    return false;
  }

  public encode(data: Beacon): string {
    return JSON.stringify(data);
  }

  public send(data: any): void {
    const {
      apiKey,
      session,
      hosts: { host }
    } = this.config;
    const url = `https://${host}/b?k=${apiKey}&s=${session}`;
    beacon(url, data);
  }

  /**
   * Creates an object that can be beaconed to the server
   * @param result - comes from this.run()
   * @param clientInfo - comes from getClientInfo()
   */
  public generateResult(result: any, clientInfo: ClientInfo): any {
    const { testId, apiKey, server, type, id } = this.config;
    /* eslint-disable @typescript-eslint/camelcase */
    return assign(
      {
        test_id: testId,
        test_api_key: apiKey,
        test_lib_version: "<% VERSION %>",
        test_server: JSON.stringify(server),
        test_timestamp: Math.floor(Date.now() / 1000), // Unix timestamp in seconds
        task_type: type,
        task_id: id,
        task_schema_version: "0.0.0",
        task_client_data: JSON.stringify(result),
        task_server_data: "<% SERVER_DATA %>"
      },
      clientInfo
    );
    /* eslint-disable @typescript-eslint/camelcase */
  }

  /**
   * ABSTRACT METHOD
   */
  public run(): Promise<any> {
    return Promise.resolve({});
  }

  public execute(): Promise<any> {
    const clientInfoUrl = `https://${this.config.testId}.${
      this.config.hosts.lookup
    }/l`;
    return Promise.all([this.run(), getClientInfo(clientInfoUrl)])
      .then((value): any => this.generateResult(...value))
      .then((result): any => (this.result = result))
      .then(this.encode)
      .then((result): void => this.send(result))
      .then((): any => this.result)
      .catch((): Promise<any> => Promise.resolve(this.result));
    //TODO: do something better than swallowing the error
  }
}

export default Task;
