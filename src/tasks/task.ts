import assign from "../util/assign";
import { beacon } from "../util/beacon";
import { getClientInfo } from "../util/client-info";
import templateResource from "../lib/templateResource";

interface State {
  hasRan: boolean;
}
// The VERSION var is replaced at compile time via webpack.DefinePlugin
declare const VERSION: string;

/* eslint-disable @typescript-eslint/camelcase */
const blankBeacon: Beacon = {
  client_user_agent: "",
  client_ip: "",
  client_asn: 0,
  client_region: "",
  client_country_code: "",
  client_continent_code: "",
  client_metro_code: "",
  client_postal_code: "",
  client_conn_speed: "",
  client_gmt_offset: "",
  client_latitude: "",
  client_longitude: "",
  resolver_ip: "",
  resolver_asn: 0,
  resolver_region: "",
  resolver_country_code: "",
  resolver_continent_code: "",
  resolver_conn_speed: "",
  resolver_latitude: "",
  resolver_longitude: "",
  test_id: "",
  test_api_key: "",
  test_lib_version: "",
  test_server: "",
  test_timestamp: 0,
  task_type: "",
  task_id: "",
  task_schema_version: "",
  task_client_data: "",
  task_server_data: ""
};
/* eslint-enable @typescript-eslint/camelcase */

abstract class Task implements TaskInterface {
  protected config: Config;
  protected data: TaskData;
  private beacon: Beacon;
  public state: State = { hasRan: false };

  public constructor(config: Config, data: TaskData) {
    this.beacon = assign({}, blankBeacon);
    this.config = assign({}, config);
    this.data = data;
    this.data.resource = templateResource(this.data.resource, config);
  }

  private encode(data: Beacon): string {
    return JSON.stringify(data);
  }

  /**
   * Sending data to the server: fire-and-forget. Not tracking if successful.
   * @param data - JSON-encoded string
   */
  private send(data: string): void {
    const {
      session,
      settings,
      hosts: { host }
    } = this.config;
    const url = `https://${host}/b?k=${settings.token}&s=${session}`;
    beacon(url, data);
  }

  /**
   * Creates an object that can be beaconed to the server
   * @param testResult - comes from this.test()
   * @param clientInfo - comes from getClientInfo()
   */
  private generateBeacon(
    testResult: TestResult,
    clientInfo: ClientInfo
  ): Beacon {
    const { test, settings, server } = this.config;
    /* eslint-disable @typescript-eslint/camelcase */
    this.beacon = assign(
      {
        test_id: test.id,
        test_api_key: settings.token,
        test_lib_version: VERSION,
        test_server: JSON.stringify(server),
        test_timestamp: Math.floor(Date.now() / 1000), // Unix timestamp in seconds
        task_type: this.data.type,
        task_id: this.data.id,
        task_schema_version: "0.0.0",
        task_client_data: JSON.stringify(testResult),
        task_server_data: "<% SERVER_DATA %>"
      },
      clientInfo
    );
    /* eslint-disable @typescript-eslint/camelcase */
    return this.beacon;
  }

  /**
   * ABSTRACT TEST METHOD
   */
  protected abstract test(): Promise<any>;

  public execute(): Promise<Beacon> {
    const lookup = this.config.hosts.lookup;
    const testId = this.config.test.id;
    const clientInfoUrl = `https://${testId}.${lookup}/l`;
    return Promise.all([this.test(), getClientInfo(clientInfoUrl)])
      .then(
        (runAndClientInfo): Beacon => this.generateBeacon(...runAndClientInfo)
      )
      .then((data): string => this.encode(data))
      .then((data): void => this.send(data))
      .then((): Beacon => this.beacon) // Clean up return data
      .catch(
        (): Promise<Beacon> => {
          //TODO: do something better than swallowing the error
          return Promise.resolve(this.beacon);
        }
      );
  }
}

export default Task;
