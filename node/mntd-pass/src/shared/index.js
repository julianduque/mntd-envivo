'use strict'

const { AUTHENTICATED, isAuthenticated, authenticate } = require('@mntd/auth')
const { CLIError } = require('@oclif/errors')
const { cli } = require('cli-ux')

async function requestAuthenticate (username) {
  let password = AUTHENTICATED
  if (!await isAuthenticated(username)) {
    password = await cli.prompt('Enter your password', { type: 'hide' })

    const user = await authenticate(username, password)
    if (!user) throw new CLIError('Invalid user or password')
  }
  return password
}

module.exports = {
  requestAuthenticate
}
