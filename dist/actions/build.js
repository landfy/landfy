'use strict';

var path = require('path');
var fs = require('fs');
var rimraf = require('rimraf');
var mkdirp = require('mkdirp');
var fileUtil = require('../util/file');
var logger = require('../util/logger');

var build = function build(destination) {
  if (!destination) {
    destination = path.join(process.cwd(), 'public');
  }

  var dirs = fs.readdirSync(process.cwd());

  if (!dirs.includes('languages')) {
    return logger.error('You need to be inside the folder of your project!\n\nFolder "languages" could not be found in this directory.');
  }

  if (!dirs.includes('site')) {
    return logger.error('You need to be inside the folder of your project!\n\nFolder "site" could not be found in this directory.');
  }

  if (fs.existsSync(destination)) {
    rimraf.sync(destination);
  }

  mkdirp.sync(destination);

  var sources = fileUtil.getFiles(path.join(process.cwd(), 'site'));

  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = sources[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var file = _step.value;

      var content = fs.readFileSync(file);
      var newPath = file.replace(path.join(process.cwd(), 'site'), destination);

      if (fileUtil.isText(file) || fileUtil.isJs(file)) {
        // TODO: replace content.toString()
      }

      fileUtil.writeFileSync(newPath, content);
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