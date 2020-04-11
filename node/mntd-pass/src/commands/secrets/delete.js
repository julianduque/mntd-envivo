'use strict'

const { Command } = require('@oclif/command')
const { CLIError } = require('@oclif/errors')
const { cli } = require('cli-ux')
const { userServices, secretServices } = require('@mntd/services')

class SecretsDeleteCommand extends Command {
  async run () {
    try {
      const { args } = this.parse(SecretsDeleteCommand)
      const { username, name } = args
      const password = await cli.prompt('Enter your password', { type: 'hide' })

      const user = await userServices.authenticate(username, password)
      if (!user) throw new CLIError('Invalid user or password')

      await secretServices.deleteSecret(user, name)
      this.log(`secret ${name} deleted`)
      this.exit(0)
    } catch (err) {
      if (err instanceof CLIError) {
        throw err
      } else {
        throw new CLIError('Cannot delete secret')
      }
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
