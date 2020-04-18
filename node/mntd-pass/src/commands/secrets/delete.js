'use strict'

const { Command } = require('@oclif/command')
const { CLIError } = require('@oclif/errors')
const { secretServices } = require('@mntd/services')
const { requestAuthenticate } = require('../../shared')

class SecretsDeleteCommand extends Command {
  async run () {
    try {
      const { args } = this.parse(SecretsDeleteCommand)
      const { username, name } = args

      await requestAuthenticate(username)

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
