import assign from "../util/assign";

import testId from "../lib/unique-id";
import { beacon } from "../lib/beacon";

import { get as getClientInfo } from "../lib/client-info.js";

class Task {
  constructor(config) {
    this.config = assign({}, config);
    this.config.testId = testId;
    this.result = {};
    this.state = {
      hasRan: false
    };
  }

  static get hasCustomConfiguration() {
    return false;
  }

  encode(data) {
    return JSON.stringify(data);
  }

  send(data) {
    const { apiKey, session, hosts: { host } } = this.config;
    const url = `https://${host}/b?k=${apiKey}&s=${session}`;
    beacon(url, data);
  }

  generateResult({ testId, apiKey, server, type }, result, clientInfo) {
    return assign(
      {
        test_id: testId,
        test_api_key: apiKey,
        test_lib_version: "<% VERSION %>",
        test_server: JSON.stringify(server),
        test_timestamp: Math.floor(Date.now() / 1000), // Unix timestamp in seconds
        task_type: type,
        task_schema_version: "0.0.0",
        task_client_data: JSON.stringify(result),
        task_server_data: "<% SERVER_DATA %>"
      },
      clientInfo
    );
  }

  execute() {
    return Promise.all([
      this.run(),
      getClientInfo(
        `https://${this.config.testId}.${this.config.hosts.lookup}/l`
      )
    ])
      .then(result => this.generateResult(this.config, ...result))
      .then(result => (this.result = result))
      .then(this.encode)
      .then(result => this.send(result))
      .then(() => this.result)
      .catch(() => Promise.resolve(this.result));
    //TODO: do something better than swallowing the error
  }
}

export default Task;
