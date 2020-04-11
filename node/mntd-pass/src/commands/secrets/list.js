'use strict'

const { Command } = require('@oclif/command')
const { CLIError } = require('@oclif/errors')
const { cli } = require('cli-ux')
const { userServices, secretServices } = require('@mntd/services')

class SecretsListCommand extends Command {
  async run () {
    try {
      const { args } = this.parse(SecretsListCommand)
      const { username } = args
      const password = await cli.prompt('Enter your password', { type: 'hide' })

      const user = await userServices.authenticate(username, password)
      if (!user) throw new CLIError('Invalid user or password')

      const secrets = await secretServices.listSecrets(username)
      cli.table(secrets.rows, {
        name: {
          minWidth: 10
        }
      })

      this.log(`Total: ${secrets.count}`)
    } catch (err) {
      if (err instanceof CLIError) {
        throw err
      } else {
        throw new CLIError('Cannot list secrets')
      }
    }
  }
}

SecretsListCommand.description = 'Lists secrets by username'
SecretsListCommand.flags = {}
SecretsListCommand.args = [
  { name: 'username', required: true }
]

module.exports = SecretsListCommand
