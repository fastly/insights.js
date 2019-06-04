import "unfetch/polyfill";
import "native-promise-only";

interface Response {
  json(): Promise<Config>;
}

export function init(): Promise<Config> {
  // FIXME; Use real API location, whatever that is
  return fetch("https://api.fastly.com/api/url").then(
    (res: Response): Promise<Config> => res.json()
  );
  // TODO: deal with errors
}
