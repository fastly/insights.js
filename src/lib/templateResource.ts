type ResourceReducer =
  | ((resource: string, config: Config) => string)
  | ((resource: string) => string);

const DICTIONARY =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
const DICTIONARY_LENGTH = DICTIONARY.length;
const RANDOM_LENGTH = 16;

// Removes all spaces from string, this allows the other reducers to have more
// reliable match patterns as they don't need to be concerned about whitespace.
function removeWhitespace(resource: string): string {
  return resource.replace(/\s/g, "");
}

// Replaces the template placeholder <% RANDOM %> with a random string
function replaceRandom(resource: string): string {
  const randomLetter = (): string =>
    DICTIONARY.charAt(Math.floor(Math.random() * DICTIONARY_LENGTH));
  const random = Array(RANDOM_LENGTH)
    .fill(null)
    .reduce((acc): string => acc + randomLetter(), "");
  return resource.replace(/<%RANDOM%>/gi, random);
}

// Replaces the template placeholder <% TEST_ID %> with the test ID from config
function replaceTestId(resource: string, config: Config): string {
  return resource.replace(/<%TEST_ID%>/gi, config.test.id);
}

export default function templateResource(
  resource: string,
  config: Config
): string {
  // Note: removeWhitespace must come first to ensure the proceeding reducers
  // are consitent and deterministic.
  const reducers: ResourceReducer[] = [
    removeWhitespace,
    replaceTestId,
    replaceRandom
  ];
  return reducers.reduce((acc, r): string => r(acc, config), resource);
}
