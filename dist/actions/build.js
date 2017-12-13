'use strict';

var path = require('path');
var fs = require('fs');
var rimraf = require('rimraf');
var mkdirp = require('mkdirp');
var mime = require('mime');
var files = require('../util/files');
var logger = require('../util/logger');

var build = function build(destination) {
  if (!destination) destination = path.join(process.cwd(), 'public');

  var dirs = fs.readdirSync(process.cwd());
  if (dirs.indexOf('languages') < 0) {
    return logger.error('error: You need to be inside the folder of your project!\n\nFolder "languages" could not be found in this directory.');
  }
  if (dirs.indexOf('site') < 0) {
    return logger.error('error: You need to be inside the folder of your project!\n\nFolder "site" could not be found in this directory.');
  }
  if (fs.existsSync(destination)) {
    rimraf.sync(destination);
  }
  mkdirp.sync(destination);
  var sources = files.getFiles(path.join(process.cwd(), 'site'));
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = sources[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var f = _step.value;

      var content = fs.readFileSync(f);
      var newPath = f.replace(path.join(process.cwd(), 'site'), destination);
      if (mime.lookup(f).indexOf('text') >= 0 || mime.lookup(f).indexOf('javascript') >= 0) {
        // TODO: replace content.toString()
      }
      files.writeFileSync(newPath, content);
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  return 'build ' + destination;
};

module.exports = build;