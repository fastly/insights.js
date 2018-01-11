import assign from "../util/assign";

const cache = {};

// For tests
function reset(url) {
  delete cache[url];
}

function normalizeResponse(raw) {
  return assign({}, raw, {
    client_asn: parseInt(raw.client_asn, 10),
    resolver_asn: parseInt(raw.resolver_asn, 10)
  });
}

// Memoize response to ensure we only call once for all tasks
// TODO: Need to handle errors and retry
function get(url) {
  if (cache[url]) {
    return cache[url];
  } else {
    cache[url] = fetch(url)
      .then(res => res.json())
      .then(normalizeResponse);
    return cache[url];
  }
}

export { get, normalizeResponse, reset };
