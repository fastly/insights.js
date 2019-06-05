import "unfetch/polyfill";
import { CONFIG_URL } from "./constants";

export function init(): Promise<Config> {
  return fetch(CONFIG_URL).then(
    (res: FetchResponse): Promise<Config> => res.json() as Promise<Config>
  );
  // TODO: deal with errors
}
