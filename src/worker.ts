import "whatwg-fetch";

interface Response {
  json(): Promise<Config>;
}

export function init(): Promise<Config> {
  return fetch("https://api.fastly.com/api/url").then(
    (res: Response): Promise<Config> => res.json()
  );
}
