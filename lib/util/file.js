const fs = require('fs')
const mkdirp = require('mkdirp')
const mime = require('mime')
const { dirname } = require('path')

const getFiles = (dir, files_) => {
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

const writeFileSync = (path, contents) => {
  mkdirp.sync(dirname(path))
  fs.writeFileSync(path, contents)
}

const isText = (file) => {
  return mime.lookup(file).indexOf('text') >= 0
}

const isJs = (file) => {
  return mime.lookup(file).indexOf('javascript') >= 0
}

module.exports = {
  getFiles,
  writeFileSync,
  isText,
  isJs
}
