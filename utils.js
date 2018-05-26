const fs = require('fs');
const path = require('path');
const mkdirplib = require('mkdirp');


/**
 * Recursively lists files in a directory.
 * @param {string} dirpath
 * @return {Array<string>}
 */
function listFiles(dirpath) {
  let files = [];
  fs.readdirSync(dirpath).forEach((basename) => {
    const relpath = path.join(dirpath, basename);
    const stat = fs.lstatSync(relpath);
    if (stat.isDirectory()) {
      files = files.concat(listFiles(relpath));
    } else {
      files.push(relpath);
    }
  });
  return files;
}


/**
 * Recursively creates a directory and its parent directories.
 * @param {string} dirpath
 */
function mkdirp(dirpath) {
  mkdirplib.sync(dirpath);
}


/**
 * Recursively removes a directory.
 * @param {string} dirpath
 */
function rmdir(dirpath) {
  fs.readdirSync(dirpath).forEach((basename) => {
    const relpath = path.join(dirpath, basename);
    const stat = fs.lstatSync(relpath);
    if (stat.isDirectory()) {
      rmdir(relpath);
    } else {
      fs.unlinkSync(relpath);
    }
  });
  fs.rmdirSync(dirpath);
}


module.exports = {
  listFiles: listFiles,
  mkdirp: mkdirp,
  rmdir: rmdir,
};
