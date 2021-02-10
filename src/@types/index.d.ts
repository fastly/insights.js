import { TestResultBundle } from "open-insights";

interface Agent {
  hasFeatureSupport: boolean;
}

interface Fastly {
  client: Agent;
  results: TestResultBundle[];
}

interface QueryParameters {
  [key: string]: string;
}
