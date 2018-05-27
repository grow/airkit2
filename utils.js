const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const mkdirplib = require('mkdirp');


/**
 * Returns the hash of a string.
 * @param {string} str
 * @param {string} algorithm
 * @param {string} encoding
 */
function checksum(str, algorithm, encoding) {
  return crypto
      .createHash(algorithm || 'md5')
      .update(str, 'utf8')
      .digest(encoding || 'hex');
}


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


/**
 * Touches a file.
 * @param {string} filepath
 */
function touch(filepath) {
  fs.closeSync(fs.openSync(filepath, 'w'));
}


module.exports = {
  checksum: checksum,
  listFiles: listFiles,
  mkdirp: mkdirp,
  rmdir: rmdir,
  touch: touch,
};
