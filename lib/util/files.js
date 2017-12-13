const fs = require('fs')
const mkdirp = require('mkdirp')
const { dirname } = require('path')

function getFiles (dir, files_) {
  files_ = files_ || []
  const fileNames = fs.readdirSync(dir)

  fileNames.forEach((fileName) => {
    var name = `${dir}/${fileName}`
    if (fs.statSync(name).isDirectory()) {
      getFiles(name, files_)
    } else {
      files_.push(name)
    }
  })
  return files_
}

function writeFileSync (path, contents) {
  mkdirp.sync(dirname(path))
  fs.writeFileSync(path, contents)
}

module.exports = {
  getFiles,
  writeFileSync
}
