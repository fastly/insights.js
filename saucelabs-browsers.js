// Set of browsers to run on Sauce Labs in CI
// Atempts to cover baseline of browsers supporting window.performance.getEntriesByType("resource")
// Check out https://saucelabs.com/platforms for all browser/platform combos
// Support table: http://caniuse.com/#search=resource%20timing

// Attempts to cover our baseline supported browsers, with support for following APIs
// Resource Timing: http://caniuse.com/#feat=resource-timing
// Beacon: http://caniuse.com/#feat=beacon

module.exports = {
  sl_edge_latest: {
    base: "SauceLabs",
    browserName: "MicrosoftEdge",
    platform: "Windows 10"
  },
  sl_edge_lowest: {
    base: "SauceLabs",
    browserName: "MicrosoftEdge",
    platform: "Windows 10",
    version: "14"
  },
  // sl_ie_lowest: {
  // 	base: 'SauceLabs',
  // 	browserName: 'internet explorer',
  // 	platform: 'Windows 7',
  // 	version: '10'
  // },
  // sl_ie_latest: {
  // 	base: 'SauceLabs',
  // 	browserName: 'internet explorer',
  // 	platform: 'Windows 7',
  // 	version: '11'
  // },
  sl_chrome_lowest: {
    base: "SauceLabs",
    browserName: "chrome",
    platform: "Windows 10",
    version: "42"
  },
  //sl_chrome_latest: {
  //	base: 'SauceLabs',
  //	browserName: 'chrome',
  //	platform: 'macOS 10.12',
  //	version: 'beta'
  //},
  sl_firefox_lowest: {
    base: "SauceLabs",
    browserName: "firefox",
    version: "39"
  },
  sl_firefox: {
    base: "SauceLabs",
    browserName: "firefox"
  }
};
