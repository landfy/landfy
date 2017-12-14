const fs = require('fs')
const unzipHelper = require('unzip')

const unzip = (zipPath, outputPath) => {
  fs.createReadStream(zipPath)
    .pipe(unzipHelper.Parse())
    .on('entry', (entry) => {
      entry.pipe(fs.createWriteStream(outputPath))
    })
}

module.exports = {
  unzip
}
