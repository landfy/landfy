const actions = require('../../dist/actions')
const logger = require('../../dist/util/logger')

test('build action', () => {
  logger.error = jest.fn()
  actions.build('dist')
  expect(logger.error).toBeCalledWith(`error: You need to be inside the folder of your project!\n\nFolder "languages" could not be found in this directory.`)
})
