const fs = require('fs')
const unzipHelper = require('unzip')
const path = require('path')
const rimraf = require('rimraf')
const mkdirp = require('mkdirp')

const TEMP_FOLDER = path.join(process.cwd(), '.landfy-temp')
const TEMP_FILE_PATH = path.join(TEMP_FOLDER, 'temp.zip')

const unzip = (zip, outputPath) => {
  if (fs.existsSync(TEMP_FOLDER)) {
    rimraf.sync(TEMP_FOLDER)
  }

  mkdirp.sync(TEMP_FOLDER)

  fs.writeFileSync(TEMP_FILE_PATH, zip)

  fs.createReadStream(TEMP_FILE_PATH).pipe(unzipHelper.Extract({ path: outputPath }))

  rimraf.sync(TEMP_FOLDER)
}

module.exports = {
  unzip
}
