const actions = require('../../dist/actions')

test('build action', () => {
  expect(actions.build('dist')).toBe('build dist')
})
