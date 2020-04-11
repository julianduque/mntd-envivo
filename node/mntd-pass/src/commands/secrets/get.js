'use strict'

const { Command, flags } = require('@oclif/command')
const { CLIError } = require('@oclif/errors')
const { cli } = require('cli-ux')
const { AUTHENTICATED, isAuthenticated, authenticate } = require('@mntd/auth')
const { secretServices } = require('@mntd/services')
const clipboardy = require('clipboardy')

class SecretsGetCommand extends Command {
  async run () {
    try {
      const { args, flags } = this.parse(SecretsGetCommand)
      const { username, name } = args

      let password = AUTHENTICATED
      if (!await isAuthenticated(username)) {
        password = await cli.prompt('Enter your password', { type: 'hide' })

        const user = await authenticate(username, password)
        if (!user) throw new CLIError('Invalid user or password')
      }

      const secret = await secretServices.getSecret(username, password, name)
      if (!secret) throw new CLIError(`secret ${name} not found`)

      if (flags.copy) {
        cli.action.start('Copying to clipboard')
        clipboardy.writeSync(secret.value)
        cli.action.stop('Copied to clipboard')
      } else {
        cli.table([secret], {
          name: {
            minWidth: 10
          },
          value: {
            minWidth: 12
          }
        })
      }
    } catch (err) {
      if (err instanceof CLIError) {
        throw err
      } else {
        throw new CLIError('Cannot get secret')
      }
    } finally {
      this.exit(0)
    }
  }
}

SecretsGetCommand.description = 'Lists secrets by username'
SecretsGetCommand.flags = {
  copy: flags.boolean({ char: 'c' })
}
SecretsGetCommand.args = [
  { name: 'username', required: true },
  { name: 'name', required: true }
]

module.exports = SecretsGetCommand
