const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const merge = require('webpack-merge');
const validate = require('webpack-validator');

const parts = require('./libs/parts');

const PATHS = {
  app: path.join(__dirname,  'app'),
  build: path.join(__dirname, 'build')
};

const commom = {
  entry: {
    app: PATHS.app
  },
  output: {
    path: PATHS.build,
    filename: '[name].js'
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Webpack demo'
    })
  ]
};

var config;

switch (process.env.npm_lifecycle_event) {
  case 'build':
    config = merge(
      commom,
      {
        devtool: 'source-map'
      },
      parts.setFreeVariables(
        'process.env.NODE_ENV',
        'production'
      ),
      parts.minify(),
      parts.setupCSS(PATHS.app)
    );
    break;
  default:
    config = merge(
      commom,
      {
        devtool: 'source-map'
      },
      parts.setupCSS(PATHS.app),
      parts.devServer({
        host: process.env.HOST,
        port: process.env.PORT
      })
    );
}

module.exports = validate(config);
