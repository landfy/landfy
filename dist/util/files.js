'use strict';

var fs = require('fs');
var mkdirp = require('mkdirp');

var _require = require('path'),
    dirname = _require.dirname;

function getFiles(dir, files_) {
  files_ = files_ || [];
  var fileNames = fs.readdirSync(dir);

  fileNames.forEach(function (fileName) {
    var name = dir + '/' + fileName;
    if (fs.statSync(name).isDirectory()) {
      getFiles(name, files_);
    } else {
      files_.push(name);
    }
  });
  return files_;
}

function writeFileSync(path, contents) {
  mkdirp.sync(dirname(path));
  fs.writeFileSync(path, contents);
}

module.exports = {
  getFiles: getFiles,
  writeFileSync: writeFileSync
};