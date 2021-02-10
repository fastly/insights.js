// import typescript from "@rollup/plugin-typescript";
import resolve from "@rollup/plugin-node-resolve";
import html from "@rollup/plugin-html";
import typescript from "rollup-plugin-typescript2";
import { terser } from "rollup-plugin-terser";
import license from "rollup-plugin-license";
import sizes from "rollup-plugin-sizes";
import serve from "rollup-plugin-serve";

const DEV_API_TOKEN = "2e8a8c19-e1c6-4d68-9200-d6a894b39414";

const makeHtmlAttributes = (attributes) => {
  if (!attributes) {
    return "";
  }

  const keys = Object.keys(attributes);
  // eslint-disable-next-line no-param-reassign
  return keys.reduce(
    (result, key) => (result += ` ${key}="${attributes[key]}"`),
    ""
  );
};

const htmlTemplate = async ({ attributes, files, meta, publicPath, title }) => {
  const scripts = (files.js || [])
    .map(({ fileName }) => {
      const attrs = makeHtmlAttributes(attributes.script);
      return `<script src="${publicPath}${fileName}?k=${DEV_API_TOKEN}"${attrs}></script>`;
    })
    .join("\n");

  const links = (files.css || [])
    .map(({ fileName }) => {
      const attrs = makeHtmlAttributes(attributes.link);
      return `<link href="${publicPath}${fileName}" rel="stylesheet"${attrs}>`;
    })
    .join("\n");

  const metas = meta
    .map((input) => {
      const attrs = makeHtmlAttributes(input);
      return `<meta${attrs}>`;
    })
    .join("\n");

  return `
<!doctype html>
<html${makeHtmlAttributes(attributes.html)}>
  <head>
    ${metas}
    <title>${title}</title>
    ${links}
  </head>
  <body>
    <h1>${title}</h1>
    ${scripts}
  </body>
</html>`;
};

const extensions = [".ts", ".js"];
const include = [
  "src/**/*.ts",
  "**/*.js",
  "**/node_modules/@openinsights/openinsights/src/**/*.ts",
  "**/@fastly/performance-observer-polyfill/**",
  "node_modules/open-insights-provider-fastly/src/**/*.ts",
];
/* eslint-disable-next-line no-undef */
const env = process.env["ENV"];
const plugins = {
  default: [
    resolve({
      extensions,
      include,
    }),
    typescript({
      include,
    }),
  ],
  dev: [
    html({
      title: "Fastly insights.js debug",
      template: htmlTemplate,
      publicPath: "http://localhost:10001/",
    }),
    env === "dev" ? serve("dist") : null,
  ],
  prod: [
    terser({
      output: {
        comments: false,
      },
    }),
    license({
      banner: {
        content: {
          file: "LICENSE_TEMPLATE",
        },
      },
    }),
    sizes(),
  ],
};

export default {
  input: "./src/index.ts",
  preserveSymlinks: true,
  plugins: [...plugins.default, ...plugins[env]],
  output: [
    {
      dir: 'dist',
      entryFileNames: "main.[hash].js",
      format: "iife",
      name: "FASTLY",
    },
  ],
};
