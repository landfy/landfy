const logger = require('../../dist/util/logger')

test('logger error', () => {
  expect(logger.error('test')).toEqual('test')
})
