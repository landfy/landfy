const fs = require('fs')
const { Extract } = require('unzip')
const path = require('path')
const rimraf = require('rimraf')
const mkdirp = require('mkdirp')

const TEMP_FOLDER = path.join(process.cwd(), 'landfy-temp')
const TEMP_FILE_PATH = path.join(TEMP_FOLDER, 'temp.zip')

const unzip = (zipStream, outputPath) => {
  if (fs.existsSync(TEMP_FOLDER)) {
    rimraf.sync(TEMP_FOLDER)
  }

  mkdirp.sync(TEMP_FOLDER)

  fs.writeFileSync(TEMP_FILE_PATH, zipStream)

  fs
    .createReadStream(TEMP_FILE_PATH)
    .pipe(Extract({ path: outputPath }))

    // rimraf.sync(TEMP_FOLDER)
}

module.exports = {
  unzip
}
