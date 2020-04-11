'use strict'

const { Command } = require('@oclif/command')
const { CLIError } = require('@oclif/errors')
const { cli } = require('cli-ux')
const { AUTHENTICATED, isAuthenticated, authenticate } = require('@mntd/auth')
const { secretServices } = require('@mntd/services')

class SecretsDeleteCommand extends Command {
  async run () {
    try {
      const { args } = this.parse(SecretsDeleteCommand)
      const { username, name } = args

      let password = AUTHENTICATED
      if (!await isAuthenticated(username)) {
        password = await cli.prompt('Enter your password', { type: 'hide' })

        const user = await authenticate(username, password)
        if (!user) throw new CLIError('Invalid user or password')
      }

      await secretServices.deleteSecret(username, name)
      this.log(`secret ${name} deleted`)
    } catch (err) {
      if (err instanceof CLIError) {
        throw err
      } else {
        throw new CLIError('Cannot delete secret')
      }
    } finally {
      this.exit(0)
    }
  }
}

SecretsDeleteCommand.description = 'Delete a secret by username and name'
SecretsDeleteCommand.flags = {}
SecretsDeleteCommand.args = [
  { name: 'username', required: true },
  { name: 'name', required: true }
]

module.exports = SecretsDeleteCommand
