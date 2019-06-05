const hasBeaconSupport =
  "sendBeacon" in navigator && typeof navigator.sendBeacon === "function";

function beacon(url: string, data: string): void {
  if (hasBeaconSupport) {
    navigator.sendBeacon(url, data);
  } else {
    fetch(url, {
      method: "POST",
      body: data,
      keepalive: true
    });
  }
}

export { beacon };
