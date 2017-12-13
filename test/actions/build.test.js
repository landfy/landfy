const {build} = require('../../lib/actions')

test('build action', () => {
  expect(build('dist')).toBe('build dist')
})
