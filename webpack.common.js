const path = require('path');

const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlApiTokenWebpackPlugin = require('./webpack.HtmlApiTokenWebpackPlugin.js');

const DEV_API_TOKEN = "2e8a8c19-e1c6-4d68-9200-d6a894b39414";

module.exports = {
  entry: './src/index.ts',
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.ts$/,
        exclude: /node_modules/,
        loader: 'eslint-loader',
        options: {
          fix: true
        }
      },
      {
        test: /\.ts$/,
        use: 'babel-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: 'Insights.js',
      template: path.resolve(__dirname, 'src', 'index.html')
    }),
    new HtmlApiTokenWebpackPlugin({
      apiToken: DEV_API_TOKEN
    }),
  ],
  output: {
    library: 'FASTLY',
    libraryTarget: 'var',
    libraryExport: 'default',
    filename: '[name].[hash].js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/'
  }
};
