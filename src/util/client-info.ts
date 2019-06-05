import assign from "../util/assign";
import "unfetch/polyfill";

interface Cache {
  [key: string]: Promise<ClientInfo>;
}

const cache: Cache = {};

/** Cleans the cache: necessary for testing */
function reset(url: string): void {
  delete cache[url];
}

/* eslint-disable @typescript-eslint/camelcase */
function normalizeResponse(raw: RawClientInfo): ClientInfo {
  return assign({}, raw, {
    client_asn: parseInt(raw.client_asn, 10),
    resolver_asn: parseInt(raw.resolver_asn, 10)
  });
}
/* eslint-enable @typescript-eslint/camelcase */

// TODO: Need to handle errors and retry
/**
 * Function that performs a unique API query to get client data
 * Memoizes responses to ensure that we only hit the API once
 */
function getClientInfo(url: string): Promise<ClientInfo> {
  if (cache[url]) {
    return cache[url];
  }
  cache[url] = fetch(url)
    .then(
      (res: FetchResponse): Promise<RawClientInfo> =>
        res.json() as Promise<RawClientInfo>
    )
    .then(normalizeResponse);
  return cache[url];
}

export { getClientInfo, normalizeResponse, reset };
