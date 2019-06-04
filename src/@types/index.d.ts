interface Client {
  hasFeatureSupport: boolean;
}

interface Fastly {
  client: Client;
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
}

interface Server {
  datacenter: string;
}

interface Task {
  name: string;
  req_header: string;
  resource: string;
  resp_header: string;
  type: string;
  weight: number;
}

interface Config {
  apiKey: string;
  session: string;
  hosts: Host;
  settings: Settings;
  server: Server;
  tasks: Task[];
}
