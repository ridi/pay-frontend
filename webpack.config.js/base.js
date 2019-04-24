// shared config (dev and prod)
const webpack = require('webpack');
const path = require('path');
const ChunkRenamePlugin = require('webpack-chunk-rename-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const {
  baseDir,
  srcDir,
  outputDir,
} = require('./paths');

module.exports = {
  context: srcDir,
  entry: {
    polyfill: ['@babel/polyfill', 'core-js/shim'],
    main: 'app/index.tsx',
  },
  output: {
    path: outputDir,
    publicPath: '/',
  },
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.tsx?$/,
        include: path.join(srcDir, 'app'),
        use: {
          loader: 'tslint-loader',
          options: {
            configFile: path.join(baseDir, 'tslint.js'),
            fix: true,
          },
        },
      },
      {
        test: /\.tsx?$/,
        include: path.join(srcDir, 'app'),
        use: ['babel-loader?cacheDirectory'],
      },
      {
        test: /\.hbs$/,
        include: path.join(srcDir, 'template'),
        loader: 'handlebars-loader',
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
        ]
      },
      {
        test: /\.(js)$/,
        include: /node_modules/,
        exclude: /polyfill/,
        use: {
          loader: 'babel-loader',
          options: {
            babelrc: false,
            plugins: [
              "transform-es3-member-expression-literals",
              "transform-es3-property-literals",
            ],
          }
        },
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
    modules: [
      srcDir,
      'node_modules',
    ],
    symlinks: false, // for performance
  },
  optimization: {
    namedModules: true,
    namedChunks: true,
    noEmitOnErrors: true,
    runtimeChunk: {
      name: 'manifest',
    },
    splitChunks: {
      cacheGroups: {
        vendors: false,
        common: {
          name: 'common',
          chunks: 'all',
          test (chunk) {
            return chunk.context && chunk.context.includes('node_modules') && !(/core-js/).test(chunk.identifier());
          },
        },
      },
    },
  },
  plugins: [
    new webpack.EnvironmentPlugin([
      'RIDI_PAY_API_SERVER_HOST',
      'RIDIBOOKS_HOST',
      'ACCOUNT_SERVER_HOST',
      'OAUTH2_CLIENT_ID',
    ]),
    new ChunkRenamePlugin({
      initialChunksWithEntry: true,
      common: '[name].[chunkhash].min.js',
    }),
    new MiniCssExtractPlugin({
      chunkFilename: 'styles.[chunkhash].css',
    }),
  ],
  performance: {
    hints: false,
  },
};
