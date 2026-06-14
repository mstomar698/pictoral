const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');

const wasmPkgPath = path.resolve(__dirname, '..');

module.exports = {
  entry: ['./bootstrap.js'],
  output: {
    publicPath: '/',
    path: path.resolve(__dirname, 'public'),
    filename: 'bootstrap.js',
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
    alias: {
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
    open: false,
    client: {
      overlay: true,
    },
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'ts-loader',
          options: { transpileOnly: true },
        },
      },
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env',
              '@babel/preset-react',
              '@babel/preset-typescript',
            ],
            plugins: [
              '@babel/plugin-transform-class-properties',
              '@babel/plugin-syntax-dynamic-import',
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
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 1024,
          },
        },
        generator: {
          filename: 'images/[name][ext]',
        },
      },
      {
        test: /\.(woff|woff2|eot|ttf)$/i,
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 10240,
          },
        },
        generator: {
          filename: 'fonts/[name][ext]',
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
      PRODUCTION: JSON.stringify(false),
      URL_PATH: JSON.stringify(''),
    }),
    new CopyWebpackPlugin({
      patterns: [{ from: 'index.html' }],
    }),
  ],
};
