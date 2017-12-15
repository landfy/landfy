const Ora = require('ora')

const spinner = new Ora()

const error = (message) => {
  spinner.fail(message)
  return message
}

const info = (message) => {
  spinner.start()
  spinner.text = message
}

const succeed = (message) => {
  spinner.succeed(message)
}

module.exports = {
  error,
  info,
  succeed
}
