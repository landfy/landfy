const {install} = require('../../lib/actions')

test('install action', () => {
  expect(install('first')).toBe('install first')
})
