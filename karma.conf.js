const customLaunchers = require("./saucelabs-browsers");

module.exports = function(config) {
  const sauce = config.withSaucelabs || false;

  config.set({
    frameworks: ["mocha", "chai-spies", "chai-as-promised", "chai"],
    customLaunchers: customLaunchers,
    browsers: sauce ? Object.keys(customLaunchers) : ["Electron"],
    reporters: sauce ? ["mocha", "saucelabs"] : ["mocha"],
    concurrency: 2, // The concurrency limit on our Sauce Labs plan :/
    singleRun: true,
    browserNoActivityTimeout: sauce ? 20000 : 10000,
    // Sadly, The order of these files is important
    files: [
      { pattern: "src/config/**.js", included: false },
      { pattern: "src/lib/!(config).js", included: false },
      { pattern: "src/tasks/**/*.js", included: false },
      {
        pattern: "node_modules/fetch-mock/es5/client-browserified.js",
        included: true,
        served: true,
        watched: false
      },
      "test/*.spec.js",
      "test/**/*.spec.js",
      {
        pattern: "dist/scout.js",
        included: false,
        served: true,
        watched: false,
        nocache: true
      }
    ],
    preprocessors: {
      "src/**/*.js": ["rollup"],
      "test/*.spec.js": ["rollup"],
      "test/**/*.spec.js": ["rollup"]
    },
    rollupPreprocessor: {
      plugins: [
        require("rollup-plugin-node-resolve")({
          jsnext: true,
          main: true,
          browser: true
        }),
        require("rollup-plugin-commonjs")(),
        require("rollup-plugin-node-builtins")(),
        require("rollup-plugin-node-globals")(),
        require("rollup-plugin-babel")({
          exclude: "node_modules/**",
          presets: [["es2015", { modules: false }]],
          plugins: ["rewire-exports", "external-helpers"]
        })
      ],
      format: "iife",
      name: "FASTLY",
      output: {
        name: "FASTLY"
      },
      exports: "named"
    },
    client: {
      useIframe: false
    },
    sauceLabs: {
      testName: "Insights.js JS unit-tests"
    }
  });
};
