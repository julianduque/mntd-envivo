'use strict'

const db = require('../models')
const minimist = require('minimist')
const promptly = require('promptly')
const { comparePassword } = require('../lib/crypto')
const argv = minimist(process.argv.slice(2))

module.exports = {
  async createUser (username, password) {
    
    return db.User.create({
      username,
      password
    })
  },

  listUsers () {
    return db.User.findAndCountAll()
  },

  async authenticate (username, pass) {
    const user = await db.User.findOne({ where: { username } })
    if (!user) return false

    const hashed = user.password

    if (await comparePassword(pass, hashed)) {
      return user
    }

    return null
  }
}
