const hasBeaconSupport =
  "sendBeacon" in navigator && typeof navigator.sendBeacon === "function";

function objectToQuery(obj) {
  return Object.keys(obj)
    .map((key, i) => {
      const prop = `${key}=${obj[key]}`;
      return i === 0 ? `?${prop}` : prop;
    })
    .join("&");
}

function beaconFromObject(path, data) {
  const query = objectToQuery(data);
  const url = `${path}${query}`;
  return navigator.sendBeacon(url);
}

function beacon(path, data) {
  if (hasBeaconSupport) {
    return navigator.sendBeacon(path, data);
  } else {
    return fetch(path, {
      method: "POST",
      body: data,
      keepalive: true
    });
  }
}

export { objectToQuery, beaconFromObject, beacon };
