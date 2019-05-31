interface Client {
  hasFeatureSupport: boolean;
}

interface Fastly {
  client: Client;
}
