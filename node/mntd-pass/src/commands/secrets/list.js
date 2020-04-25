'use strict'

const { Command } = require('@oclif/command')
const { CLIError } = require('@oclif/errors')
const { cli } = require('cli-ux')
const { secretServices } = require('@mntd/services')

class SecretsListCommand extends Command {
  async run () {
    try {
      const { args } = this.parse(SecretsListCommand)
      const { username } = args

      await this.config.runHook('authenticate', { username })

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
        console.log(err)
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
