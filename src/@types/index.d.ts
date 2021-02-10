import { TestResultBundle } from "@openinsights/openinsights";

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
