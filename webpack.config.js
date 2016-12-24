const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const merge = require('webpack-merge');
const validate = require('webpack-validator');

const PATHS = {
  app: path.join(__dirname,  'app'),
  build: path.join(__dirname, 'build')
};

module.exports = {};

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
    config = merge(commom, {});
    break;
  default:
    config = merge(commom, {});
}

module.exports = config;
module.exports = validate(config);
