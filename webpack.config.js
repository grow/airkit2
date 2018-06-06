const path = require('path');
const webpack = require('webpack');
const BabiliPlugin = require('babili-webpack-plugin');
const utils = require('./utils');


/**
 * Recursively checks the ./src/ folder for files ending in .example.js.
 * @return {Object} A map of `name` => `path`, where `name` is
 *     [name].example.js.
 */
function getEntry() {
  const entry = {};
  utils.listFiles('./src/').forEach((filepath) => {
    const filename = path.basename(filepath);
    if (filename.endsWith('.example.js')) {
      const name = path.basename(filename, '.example.js');
      entry[name] = './' + filepath;
    }
  });
  return entry;
}


module.exports = {
  mode: 'production',
  entry: getEntry(),
  plugins: [
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false,
    }),
    new BabiliPlugin({}),
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader?presets[]=es2015',
      },
    ],
  },
  output: {
    path: path.resolve(__dirname, './dist/js/'),
    filename: '[name]/[name].example.min.js',
  },
};
