const { Command } = require('@oclif/command')

class UsersCommand extends Command {
  async run () {
    this._help()
  }
}

UsersCommand.description = 'Manage users'
UsersCommand.flags = {}

module.exports = UsersCommand
