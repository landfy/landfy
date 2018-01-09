const fs = require('fs')
const path = require('path')
const rimraf = require('rimraf')
const actions = require('../../dist/actions')
const logger = require('../../dist/util/logger')
const STRING = require('../../string/string.json')

test('build not in folder', () => {
  logger.error = jest.fn()
  actions.build('dist')
  expect(logger.error).toBeCalledWith(STRING.LANGUAGE_NOT_FOUND)
})

test('build not in folder', () => {
  logger.error = jest.fn()
  const pathLanguages = path.join(process.cwd(), 'languages')
  if (!fs.existsSync(pathLanguages)) {
    fs.mkdirSync(pathLanguages)
  }
  actions.build('dist')
  expect(logger.error).toBeCalledWith(STRING.SITE_NOT_FOUND)
  rimraf.sync(pathLanguages)
})
