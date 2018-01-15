const path = require('path')
const fs = require('fs')
const rimraf = require('rimraf')
const mkdirp = require('mkdirp')
const fileUtil = require('../util/file')
const logger = require('../util/logger')

const STRING = require('../../string/string.json')

const build = (destination) => {
  if (!destination) {
    destination = path.join(process.cwd(), 'public')
  }

  const dirs = fs.readdirSync(process.cwd())

  if (!dirs.includes('languages')) {
    return logger.error(STRING.LANGUAGE_NOT_FOUND)
  }

  if (!dirs.includes('site')) {
    return logger.error(STRING.SITE_NOT_FOUND)
  }

  if (fs.existsSync(destination)) {
    rimraf.sync(destination)
  }

  mkdirp.sync(destination)

  const sources = fileUtil.getFiles(path.join(process.cwd(), 'site'))
  const languageFiles = fileUtil.getFiles(path.join(process.cwd(), 'languages'))
  const pathConfig = path.join(process.cwd(), 'landfy.json')
  const config = fs.existsSync(pathConfig) ? require(pathConfig) : null
  for (let file of sources) {
    languageFiles.forEach((lang) => {
      var content = fs.readFileSync(file)
      const languageFile = JSON.parse(fs.readFileSync(lang).toString())
      const newPath = getNewPath(languageFiles, config, lang, destination, file)

      if (fileUtil.isText(file) || fileUtil.isJs(file)) {
        for (var string in languageFile) {
          content = content.toString().replace(new RegExp(`\\[${string}]`, 'g'), languageFile[string])
        }
      }

      fileUtil.writeFileSync(newPath, content)
    })
  }

  return `build ${destination}`
}

function getNewPath (languageFiles, config, lang, destination, file) {
  if (languageFiles.length <= 1 || (config && config['default-language'] && path.basename(lang).replace('.json', '') === config['default-language'])) {
    return file.replace(path.join(process.cwd(), 'site'), destination)
  }

  if (languageFiles.length > 1 && config && config['default-language'] && path.basename(lang).replace('.json', '') !== config['default-language']) {
    return file.replace(path.join(process.cwd(), 'site'), path.join(destination, path.basename(lang).replace('.json', '')))
  }

  if (languageFiles.length > 1 && path.basename(lang) === 'en.json') {
    return file.replace(path.join(process.cwd(), 'site'), destination)
  }

  return file.replace(path.join(process.cwd(), 'site'), path.join(destination, path.basename(lang).replace('.json', '')))
}

module.exports = build
