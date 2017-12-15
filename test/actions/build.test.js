const actions = require('../../dist/actions')
const logger = require('../../dist/util/logger')
const STRING = require('../../string/string.json')

test('build action', () => {
  logger.error = jest.fn()
  actions.build('dist')
  expect(logger.error).toBeCalledWith(STRING.LANGUAGE_NOT_FOUND)
})
