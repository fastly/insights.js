import "unfetch/polyfill";
import { CONFIG_URL } from "./constants";

interface Response {
  json(): Promise<Config>;
}

export function init(): Promise<Config> {
  return fetch(CONFIG_URL).then((res: Response): Promise<Config> => res.json());
  // TODO: deal with errors
}
