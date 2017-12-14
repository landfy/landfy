'use strict';

var path = require('path');
var fs = require('fs');
var rimraf = require('rimraf');
var mkdirp = require('mkdirp');
var fileUtil = require('../util/file');
var logger = require('../util/logger');

var STRING = require('../../string/string.json');

var build = function build(destination) {
  if (!destination) {
    destination = path.join(process.cwd(), 'public');
  }

  var dirs = fs.readdirSync(process.cwd());

  if (!dirs.includes('languages')) {
    return logger.error(STRING.LANGUAGE_NOT_FOUND);
  }

  if (!dirs.includes('site')) {
    return logger.error(STRING.SITE_NOT_FOUND);
  }

  if (fs.existsSync(destination)) {
    rimraf.sync(destination);
  }

  mkdirp.sync(destination);

  var sources = fileUtil.getFiles(path.join(process.cwd(), 'site'));
  var languageFiles = fileUtil.getFiles(path.join(process.cwd(), 'languages'));
  var pathConfig = path.join(process.cwd(), 'landfy.json');
  var config = fs.existsSync(pathConfig) ? require(pathConfig) : null;
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    var _loop = function _loop() {
      var file = _step.value;

      languageFiles.forEach(function (lang) {
        var content = fs.readFileSync(file);
        var languageFile = JSON.parse(fs.readFileSync(lang).toString());
        var newPath = getNewPath(languageFiles, config, lang, destination, file);

        if (fileUtil.isText(file) || fileUtil.isJs(file)) {
          for (var string in languageFile) {
            content = content.toString().replace(new RegExp('\\[' + string + ']', 'g'), languageFile[string]);
          }
        }

        fileUtil.writeFileSync(newPath, content);
      });
    };

    for (var _iterator = sources[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      _loop();
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

function getNewPath(languageFiles, config, lang, destination, file) {
  if (languageFiles.length <= 1 || config && config['default-language'] && path.basename(lang).replace('.json', '') === config['default-language']) {
    return file.replace(path.join(process.cwd(), 'site'), destination);
  }

  if (languageFiles.length > 1 && config && config['default-language'] && path.basename(lang).replace('.json', '') !== config['default-language']) {
    return file.replace(path.join(process.cwd(), 'site'), path.join(destination, path.basename(lang).replace('.json', '')));
  }

  if (languageFiles.length > 1 && path.basename(lang) === 'en.json') {
    return file.replace(path.join(process.cwd(), 'site'), destination);
  }

  return file.replace(path.join(process.cwd(), 'site'), path.join(destination, path.basename(lang).replace('.json', '')));
}

module.exports = build;