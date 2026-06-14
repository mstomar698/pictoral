const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');

// Resolve path to local wasm package (for local development)
// Use this instead of npm link for better reliability
const wasmPkgPath = path.resolve(__dirname, '..');

module.exports = {
  entry: ['./bootstrap.js'],
  output: {
    publicPath: '',
    path: path.resolve(__dirname, 'public'),
    filename: 'bootstrap.js',
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
    alias: {
      // Point to local wasm package instead of node_modules
      // This removes need for npm link
      'image-editor-bk-rust': path.resolve(wasmPkgPath, 'pkg'),
    },
  },
  experiments: {
    asyncWebAssembly: true,
  },
  mode: 'development',
  devServer: {
    static: {
      directory: path.join(__dirname, 'public'),
    },
    host: 'localhost',
    historyApiFallback: true,
    port: 3000,
    compress: true,
    open: true,
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /(node_modules|bower_components)/,
        use: 'ts-loader',
      },
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env',
              {
                plugins: [
                  '@babel/plugin-proposal-class-properties',
                  '@babel/plugin-syntax-dynamic-import',
                ],
              },
              '@babel/react',
            ],
          },
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      },
      {
        test: /\.(jpe?g|gif|png|ico|svg)$/i,
        use: {
          loader: 'url-loader',
          options: {
            limit: 1024,
            name: 'images/[name].[ext]',
          },
        },
      },
      {
        test: /\.(woff|woff2|eot|ttf|svg)(\?.*$|$)/i,
        use: {
          loader: 'url-loader',
          options: {
            limit: 10240,
            name: '../fonts/[name].[ext]',
          },
        },
      },
      {
        test: /\.wasm$/,
        type: 'webassembly/async',
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      PRODUCTION: JSON.stringify(true),
      URL_PATH: JSON.stringify(''),
    }),
    new CopyWebpackPlugin({
      patterns: [{ from: 'index.html' }],
    }),
  ],
};
