const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const merge = require('webpack-merge');
const validate = require('webpack-validator');
const StyleLintPlugin = require('stylelint-webpack-plugin');

const parts = require('./webpack/parts');
const loaders = require('./webpack/loaders');
const TARGET = process.env.npm_lifecycle_event;

process.env.BABEL_ENV = TARGET;

const PATHS = {
  app: path.join(__dirname,  'app'),
  style: path.join(__dirname, 'app', 'scss/main.scss'),
  images: path.join(__dirname, 'app', 'images'),
  build: path.join(__dirname, 'build')
};

const commom = {
  entry: {
    vendor: ['react'],
    style: PATHS.style,
    // if you need to include css frameworks, remove the top line and replace by:
    // style: [
    //   path.join(__dirname, 'node_modules', 'nameoftheframework'),
    //   path.join(__dirname, 'app', 'main.css')
    // ]
    app: PATHS.app
  },
  output: {
    path: PATHS.build,
    filename: '[name].[hash].js'
  },
  resolve: {
  extensions: ['', '.js', '.jsx']
  },
  module: {
    loaders
  },
  plugins: [
    new StyleLintPlugin({
      configFile: '.stylelintrc',
      files: ['**/*.s?(a|c)ss'],
      failOnError: false,
    }),
    new HtmlWebpackPlugin({
    	template: './app/template.html'
    })
  ]
};

var config;

switch (process.env.npm_lifecycle_event) {
  case 'build':
    config = merge(
      commom,
      {
        devtool: 'source-map',
        output: {
          path: PATHS.build,
          filename: '[name].[chunkhash].js',
          chunkFilename: '[chunkhash].js'
        }
      },
      parts.clean(PATHS.build),
      parts.setFreeVariables(
        'process.env.NODE_ENV',
        'production'
      ),
      parts.extractBundle({
        name: 'vendor',
        entries: ['react']
      }),
      parts.minify(),
      parts.extractSCSS(PATHS.style),
      parts.purifyCSS([PATHS.app])
    );
    break;
  default:
    config = merge(
      commom,
      {
        devtool: 'source-map'
      },
      parts.setupSCSS(PATHS.style),
      parts.devServer({
        host: process.env.HOST,
        port: process.env.PORT
      })
    );
}

module.exports = validate(config);
