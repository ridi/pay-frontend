/* eslint-disable */
require('dotenv-safe').config();

const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const {
  baseDir,
  outputDir,
} = require('./paths');

module.exports = {
  mode: 'development',
  output: {
    // webpack dev server doesn't allow to use `contenthash`
    filename: '[name].[hash].min.js',
    chunkFilename: '[name].[hash].min.js',
  },
  devtool: 'eval-cheap-module-source-map',
  plugins: [
    new webpack.DefinePlugin({
      API_SEVER_URL: '"https://pay-api.dev.ridi.io"',
      BOOKS_SERVER_URL: '"https://dev.ridi.io"',
    }),
    new HtmlWebpackPlugin({
      template: 'template/index.hbs',
      cache: true,
    }),
    new webpack.EvalSourceMapDevToolPlugin({
      test: /\.(jsx?|tsx?)($|\?)/i,
      module: true,
    }),
    new webpack.HotModuleReplacementPlugin(),
  ],
  devServer: {
    port: 9000,
    contentBase: [
      outputDir,
      baseDir,
      // path.join(baseDir, 'public'),
      path.join(baseDir, 'src'), // to support sourcemap
    ],
    host: '0.0.0.0',
    disableHostCheck: true,
    historyApiFallback: true,
    compress: true,
    hot: true,
    open: false,
    public: `https://${process.env.RIDI_PAY_HOST}`,
  },
  watchOptions: {
    poll: true,
  },
};
