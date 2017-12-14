'use strict';

var fs = require('fs');
var unzipHelper = require('unzip');

var unzip = function unzip(zipPath, outputPath) {
  console.log(zipPath);

  fs.createReadStream(zipPath).pipe(unzipHelper.Extract({ path: outputPath }));
};

module.exports = {
  unzip: unzip
};