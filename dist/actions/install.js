'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var axios = require('axios');
var logger = require('../util/logger');
var to = require('../util/to');
var zip = require('../util/zip');
var path = require('path');
var fs = require('fs');

var getSourceList = function getSourceList() {
  return to(axios('https://cdn.rawgit.com/landfy/landing-pages/c77141b5/sources.json'));
};

var buildDownloadUrl = function buildDownloadUrl(baseUrl) {
  return baseUrl + '/archive/master.zip';
};

var geTemplateSource = function geTemplateSource(url) {
  return to(axios.request({
    responseType: 'arraybuffer',
    url: url,
    method: 'GET',
    headers: {
      'Content-Type': 'application/zip'
    }
  }));
};

var getTemplateFromSourceList = function getTemplateFromSourceList(templateList, templateToInstall) {
  return templateList.find(function (template) {
    return template.key === templateToInstall;
  });
};

var downloadSource = async function downloadSource(sourceDownloadUrl) {
  var _ref = await geTemplateSource(sourceDownloadUrl),
      _ref2 = _slicedToArray(_ref, 2),
      error = _ref2[0],
      response = _ref2[1];

  if (error) {
    throw logger.error('Fail on template download');
  }

  fs.writeFileSync(path.join(process.cwd(), 'build.zip'), response.data);
};

var install = async function install(templateName) {
  var _ref3 = await getSourceList(),
      _ref4 = _slicedToArray(_ref3, 2),
      error = _ref4[0],
      response = _ref4[1];

  if (error) {
    return logger.error('Error on acess the source list');
  }

  var sourceList = response.data;

  var templateToInstall = getTemplateFromSourceList(sourceList, templateName);

  if (!templateToInstall) {
    return logger.error('Invalid template key. Verify and try again');
  }

  var sourceDownloadUrl = buildDownloadUrl(templateToInstall.url);

  var zipPath = path.join(process.cwd(), 'build.zip');

  await downloadSource(sourceDownloadUrl, zipPath);

  var zipPathOut = path.join(process.cwd(), templateName);

  zip.unzip(zipPath, zipPathOut);
};

module.exports = install;