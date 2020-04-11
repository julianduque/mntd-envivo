'use strict'

const { userServices } = require('@mntd/services')
const { Command } = require('@oclif/command')
const { CLIError } = require('@oclif/errors')
const { Sequelize } = require('@mntd/db')
const { cli } = require('cli-ux')

class UsersCreateCommand extends Command {
  async run () {
    const { args } = this.parse(UsersCreateCommand)
    const { username } = args
    const fullName = await cli.prompt('Enter your full name')
    const password = await cli.prompt('Enter your password', { type: 'hide' })

    try {
      const newUser = await userServices.createUser(username, password, fullName)
      this.log(`${newUser.username} created with id: ${newUser.id}`)
    } catch (err) {
      if (err instanceof Sequelize.UniqueConstraintError) {
        throw new CLIError('Username already exists')
      } else {
        throw new CLIError('Cannot create user')
      }
    } finally {
      this.exit(0)
    }
  }
}

UsersCreateCommand.description = 'Creates an user'
UsersCreateCommand.flags = {}
UsersCreateCommand.args = [
  { name: 'username', required: true }
]

module.exports = UsersCreateCommand
