const path = require('path')
const fs = require('fs')
const rimraf = require('rimraf')
const mkdirp = require('mkdirp')
const mime = require('mime')
const files = require('../util/files')
const logger = require('../util/logger')

const build = (destination) => {
  if (!destination) destination = path.join(process.cwd(), 'public')

  var dirs = fs.readdirSync(process.cwd())
  if (dirs.indexOf('languages') < 0) {
    return logger.error(`error: You need to be inside the folder of your project!\n\nFolder "languages" could not be found in this directory.`)
  }
  if (dirs.indexOf('site') < 0) {
    return logger.error(`error: You need to be inside the folder of your project!\n\nFolder "site" could not be found in this directory.`)
  }
  if (fs.existsSync(destination)) {
    rimraf.sync(destination)
  }
  mkdirp.sync(destination)
  var sources = files.getFiles(path.join(process.cwd(), 'site'))
  for (var f of sources) {
    var content = fs.readFileSync(f)
    var newPath = f.replace(path.join(process.cwd(), 'site'), destination)
    if (mime.lookup(f).indexOf('text') >= 0 || mime.lookup(f).indexOf('javascript') >= 0) {
      // TODO: replace content.toString()
    }
    files.writeFileSync(newPath, content)
  }

  return `build ${destination}`
}

module.exports = build
