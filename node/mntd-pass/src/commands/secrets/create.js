'use strict'

const { Command } = require('@oclif/command')
const { CLIError } = require('@oclif/errors')
const { cli } = require('cli-ux')
const { Sequelize } = require('@mntd/db')
const { secretServices } = require('@mntd/services')
const { requestAuthenticate } = require('../../shared')

class SecretsCreateCommand extends Command {
  async run () {
    try {
      const { args } = this.parse(SecretsCreateCommand)
      const { username, name } = args

      const password = await requestAuthenticate(username)

      const value = await cli.prompt('Enter your secret', { type: 'mask' })
      const secret = await secretServices.createSecret(username, password, name, value)

      this.log(`secret: ${secret.name} created for user '${username}'`)
    } catch (err) {
      if (err instanceof Sequelize.UniqueConstraintError) {
        throw new CLIError('Secret name already exists')
      } else if (err instanceof CLIError) {
        throw err
      } else {
        throw new CLIError('Cannot create secret')
      }
    } finally {
      this.exit(0)
    }
  }
}

SecretsCreateCommand.description = 'Creates a secret by name'
SecretsCreateCommand.flags = {}
SecretsCreateCommand.args = [
  { name: 'username', required: true },
  { name: 'name', required: true }
]
module.exports = SecretsCreateCommand
