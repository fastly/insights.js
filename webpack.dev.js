const path = require('path');
const webpack = require('webpack');

const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    port: 8000,
    open: true
  },
  plugins: [
    new webpack.DefinePlugin({
      PRODUCTION: 'false'
    })
  ],
  output: {
    globalObject: 'this'
  }
});
