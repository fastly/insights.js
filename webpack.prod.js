const fs = require('fs');
const path = require('path');

const webpack = require('webpack');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const AssetsPlugin = require('assets-webpack-plugin');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const version = require('./package.json').version;

function getLicenseWithDate() {
   const license = fs.readFileSync(path.resolve(__dirname, 'LICENSE'), { encoding: 'utf8'});
   const now = Date.now();
   const year = new Date(now).getFullYear();
   const date = new Date(now).toISOString();
   return license.replace('[year]', year).replace('[date]', date);
}

function processManifest(assets) {
   return JSON.stringify(Object.entries(assets).reduce((res, [key , value]) => {
      if(key === "main") res["insights.js"] = value.js;
      if(key === "") res["worker.js"] = value.js;
      return res;
   }, {}));
}

module.exports = merge(common, {
   mode: 'production',
   plugins: [
      new webpack.BannerPlugin({
         banner: getLicenseWithDate()
      }),
      new BundleAnalyzerPlugin({
         analyzerMode: 'static'
      }),
      new webpack.DefinePlugin({
         PRODUCTION: 'true',
         VERSION: JSON.stringify(version)
      }),
      new AssetsPlugin({
         filename: 'manifest.json',
         useCompilerPath: true,
         includeAllFileTypes: false,
         fileTypes: ['js'],
         processOutput: processManifest
      })
   ],
   output: {
    publicPath: '/static/'
   }
});
