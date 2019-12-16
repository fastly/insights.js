interface FetchResponse {
  json(): Promise<any>;
}

interface QueryParameters {
  [key: string]: string;
}

//  Classifiers
// ---------------------------------------------------------------------------
type CountryCode = string;
type ASN = number;
type ConnectionType = string;
type DeviceType = string;

//  Server response
// ---------------------------------------------------------------------------

interface Test {
  id: string;
}

interface Agent {
  hasFeatureSupport: boolean;
}

interface Client {
  country_code: CountryCode;
  connection_type: ConnectionType;
  asn: ASN;
  device_type: DeviceType;
  [key: string]: string | number;
}

interface Fastly {
  client: Agent;
  results: Beacon[];
}

interface Host {
  host: string;
  lookup: string;
}

interface Settings {
  initial_delay: number;
  max_tasks: number;
  report_errors: boolean;
  sample_rate: number;
  token: string;
}

interface Server {
  datacenter: string;
}

// Config/tasks
// ---------------------------------------------------------------------------
interface TaskClassification {
  country_code?: CountryCode[];
  asn?: ASN[];
  connection_type?: ConnectionType[];
  device_type?: DeviceType[];
  [key: string]: string[] | number[] | undefined;
}

interface TaskData {
  id: string;
  req_header: string;
  resource: string;
  resp_header: string;
  type: string;
  weight: number;
  classification: TaskClassification;
}

interface Config {
  client: Client;
  hosts: Host;
  server: Server;
  session: string;
  settings: Settings;
  tasks: TaskData[];
  test: Test;
}

interface TaskInterface {
  execute(): Promise<Beacon>;
}

// Result / ClientInfo / Beacon
// ---------------------------------------------------------------------------
interface ClientInfo {
  client_asn: number;
  client_conn_speed: string;
  client_continent_code: string;
  client_country_code: string;
  client_gmt_offset: string;
  client_ip: string;
  client_latitude: string;
  client_longitude: string;
  client_metro_code: string;
  client_postal_code: string;
  client_region: string;
  client_user_agent: string;
  resolver_asn: number;
  resolver_conn_speed: string;
  resolver_continent_code: string;
  resolver_country_code: string;
  resolver_ip: string;
  resolver_region: string;
  resolver_latitude: string;
  resolver_longitude: string;
}

interface TaskResult {
  test_id: string;
  task_schema_version: string;
  task_server_data: string;
  task_type: string;
  test_api_key: string;
  task_id: string;
  test_lib_version: string;
  test_server: string;
  test_timestamp: number;
  task_client_data: string;
}

interface TestResult {
  [key: string]: any;
}

interface ResourceTimingEntry {
  [key: string]: string | number;
}

type Beacon = ClientInfo & TaskResult;

// NetworkInformation
// ---------------------------------------------------------------------------
/// W3C Spec Draft http://wicg.github.io/netinfo/
// Edition: Draft Community Group Report 20 February 2019

// http://wicg.github.io/netinfo/#navigatornetworkinformation-interface
/* eslint-disable @typescript-eslint/no-empty-interface */
declare interface Navigator extends NavigatorNetworkInformation {}
declare interface WorkerNavigator extends NavigatorNetworkInformation {}
/* eslint-enable @typescript-eslint/no-empty-interface */

// http://wicg.github.io/netinfo/#navigatornetworkinformation-interface
declare interface NavigatorNetworkInformation {
  readonly connection?: NetworkInformation;
}

// http://wicg.github.io/netinfo/#connection-types
type NetworkConnectionType =
  | "bluetooth"
  | "cellular"
  | "ethernet"
  | "mixed"
  | "none"
  | "other"
  | "unknown"
  | "wifi"
  | "wimax";

// http://wicg.github.io/netinfo/#effectiveconnectiontype-enum
type EffectiveConnectionType = "2g" | "3g" | "4g" | "slow-2g";

// http://wicg.github.io/netinfo/#dom-megabit
type Megabit = number;
// http://wicg.github.io/netinfo/#dom-millisecond
type Millisecond = number;

interface NetworkInformation {
  [key: string]:
    | NetworkConnectionType
    | EffectiveConnectionType
    | Megabit
    | Millisecond
    | boolean;
}
