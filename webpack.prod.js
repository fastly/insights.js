const fs = require('fs');
const path = require('path');

const webpack = require('webpack');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
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
      })
   ],
   output: {
    publicPath: '/static/'
   }
});
