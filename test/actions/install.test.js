const actions = require('../../dist/actions')

test('install action', () => {
  expect(actions.install('first')).toBe('install first')
})
