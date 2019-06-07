import { hasProperty } from "./object";

const hasBeaconSupport = hasProperty(navigator, "sendBeacon");

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
