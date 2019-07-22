// The ENV var is replaced at compile time via webpack.DefinePlugin
declare const PRODUCTION: string;

export const CONFIG_HOST = "https://test.fastly-insights.com";
export const CONFIG_PATH = "/api/v1/config/";
export const CLIENT_INFO_PATH = "/client-info";
export const SCRIPT_SRC_REGEXP = PRODUCTION
  ? /^https:\/\/[a-z]+\.fastly-insights\.com/
  : /\/main/;
