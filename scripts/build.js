const path = require("path");
const fs = require("fs");
const rollup = require("rollup");

const babel = require("rollup-plugin-babel");
const uglify = require("rollup-plugin-uglify");
const commonjs = require("rollup-plugin-commonjs");
const filesize = require("rollup-plugin-filesize");
const hash = require("rollup-plugin-hash");
const nodeResolve = require("rollup-plugin-node-resolve");
const builtins = require("rollup-plugin-node-builtins");
const globals = require("rollup-plugin-node-globals");
const replace = require("rollup-plugin-post-replace");
const license = require("rollup-plugin-license");

const config = require("../config.js");

function getOutput(dist, source) {
  const base = path.basename(source);
  return path.join(dist, base);
}

function generateConfig({
  input,
  dir = "dist/",
  intro = "",
  production = false,
  version = "0.0.0",
  callback = () => {}
}) {
  const basename = path.basename(input, ".js");

  return {
    input: {
      input,
      plugins: [
        nodeResolve({
          jsnext: true,
          main: true,
          browser: true
        }),
        commonjs(),
        globals(),
        builtins(),
        babel(),
        filesize(),
        production
          ? hash({
              dest: `${dir}${basename}.[hash].js`,
              manifest: `${dir}manifest.${basename}.json`,
              callback
            })
          : null,
        production ? uglify() : null,
        production
          ? replace({
              values: {
                "<% VERSION %>": version,
                '"<% APIKEY %>"': config.esi.apiKey,
                '"<% SESSION %>"': config.esi.session,
                '"<% CONFIG %>"': config.esi.config,
                '"<% BUILD %>"': config.esi.build,
                '"<% SERVER %>"': config.esi.server,
                '"<% TASKS %>"': config.esi.tasks,
                '"<% POPS %>"': config.esi.pops
              }
            })
          : null,
        license({
          banner: {
            file: "LICENSE"
          }
        })
      ].filter(p => p)
    },
    output: {
      file: getOutput(dir, input),
      format: "iife",
      intro
    }
  };
}

async function bundle({ input, output }) {
  const bundle = await rollup.rollup(input);
  return bundle.write(output);
}

async function build(
  inputFiles,
  dir = "dist/",
  version = "0.0.0",
  production = false
) {
  const files = inputFiles.filter(f => fs.existsSync(f));

  if (!files.length) {
    throw Error("Input file[s] must be valid.");
  }

  const fileOverrides = {
    "src/lib.js": {},
    "src/scout.js": {
      intro: production ? config.prod : config.dev
    }
  };

  const output = files.reduce((res, file) => {
    res[file] = getOutput(dir, file);
    return res;
  }, {});

  const configs = files.map(input => {
    const callback = hash => (output[input] = hash);
    const defaultConfig = {
      input,
      dir,
      callback,
      version,
      intro: "",
      production
    };
    const config = Object.assign(defaultConfig, fileOverrides[input]);
    return generateConfig(config);
  });

  const builds = configs.map(bundle);

  await Promise.all(builds);
  return output;
}

module.exports = { build };
