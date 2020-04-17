const { isAuthenticated, authenticate } = require('@mntd/auth')
const { CLIError } = require('@oclif/errors')
const { cli } = require('cli-ux')

module.exports = async function ({ username }) {
  if (!await isAuthenticated(username)) {
    const password = await cli.prompt('Enter your password', { type: 'hide' })

    const user = await authenticate(username, password)
    if (!user) throw new CLIError('Invalid user or password')
  }
}
