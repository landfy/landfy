const path = require('path')
const fs = require('fs')
const rimraf = require('rimraf')
const mkdirp = require('mkdirp')
const fileUtil = require('../util/file')
const logger = require('../util/logger')

const build = (destination) => {
  if (!destination) {
    destination = path.join(process.cwd(), 'public')
  }

  const dirs = fs.readdirSync(process.cwd())

  if (!dirs.includes('languages')) {
    return logger.error(`You need to be inside the folder of your project!\n\nFolder "languages" could not be found in this directory.`)
  }

  if (!dirs.includes('site')) {
    return logger.error(`You need to be inside the folder of your project!\n\nFolder "site" could not be found in this directory.`)
  }

  if (fs.existsSync(destination)) {
    rimraf.sync(destination)
  }

  mkdirp.sync(destination)

  const sources = fileUtil.getFiles(path.join(process.cwd(), 'site'))

  for (let file of sources) {
    const content = fs.readFileSync(file)
    const newPath = file.replace(path.join(process.cwd(), 'site'), destination)

    if (fileUtil.isText(file) || fileUtil.isJs(file)) {
      // TODO: replace content.toString()
    }

    fileUtil.writeFileSync(newPath, content)
  }

  return `build ${destination}`
}

module.exports = build
