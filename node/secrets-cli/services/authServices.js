'use strict'

const db = require('../models')
const { comparePassword } = require('../lib/crypto')

async function authenticate (username, password) {
  const user = await db.User.findOne({ where: { username } })
  if (!user) return null

  if (await comparePassword(password, user.password)) {
    delete user.password
    return user
  }

  return null
}

module.exports = {
  authenticate
}
