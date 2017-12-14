const path = require('path')
const fs = require('fs')
const fileUtil = require('../../dist/util/file')

test('file getFiles', () => {
  const files = fileUtil.getFiles(path.join(__dirname, '../'))
  expect((files.join().indexOf('file.test.js') > -1)).toEqual(true)
})

test('file writeFileSync', () => {
  const file = path.join(__dirname, 'temp.test.file.txt')
  const text = 'temp text to file'
  fileUtil.writeFileSync(file, text)
  expect(fs.existsSync(file)).toEqual(true)
  expect(fs.readFileSync(file).toString()).toEqual(text)
  fs.unlinkSync(file)
})

test('file isText valid', () => {
  expect(fileUtil.isText('test.txt')).toEqual(true)
})

test('file isJs', () => {
  expect(fileUtil.isJs('test.js')).toEqual(true)
})
