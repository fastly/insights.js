import "unfetch/polyfill";

interface Cache {
  [key: string]: Promise<ClientInfo>;
}

const cache: Cache = {};

/** Cleans the cache: necessary for testing */
function reset(url: string): void {
  delete cache[url];
}

// TODO: Need to handle errors and retry
/**
 * Function that performs a unique API query to get client data
 * Memoizes responses to ensure that we only hit the API once
 */
function getClientInfo(url: string): Promise<ClientInfo> {
  if (cache[url]) {
    return cache[url];
  }
  cache[url] = fetch(url).then(
    (res: FetchResponse): Promise<ClientInfo> =>
      res.json() as Promise<ClientInfo>
  );
  return cache[url];
}

export { getClientInfo, reset };
