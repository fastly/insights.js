const path = require('path');

const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.ts',
  module: {
    rules: [
      {
        test: /worker\.ts$/,
        use: 'workerize-loader'
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
    })
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
