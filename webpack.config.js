const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const BabiliPlugin = require('babili-webpack-plugin');


/**
 * Recursively lists files in a directory.
 * @param {string} dirpath
 * @return {Array<string>}
 */
function listFiles(dirpath) {
  let files = [];
  fs.readdirSync(dirpath).forEach((basename) => {
    const stats = fs.lstatSync(path.join(dirpath, basename));
    if (stats.isDirectory()) {
      files = files.concat(listFiles(path.join(dirpath, basename)));
    } else {
      files.push(path.join(dirpath, basename));
    }
  });
  return files;
}


/**
 * Recursively checks the ./src/ folder for files ending in .example.js.
 * @return {Object} A map of `name` => `path`, where `name` is
 *     [name].example.js.
 */
function getEntry() {
  const entry = {};
  listFiles('./src/').forEach((filepath) => {
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
    filename: '[name].bundle.js',
  },
};
