'use strict'

const { User, redisClient } = require('@mntd/db')
const { comparePassword, generateKey } = require('@mntd/crypto')

const AUTHENTICATED = Symbol('AUTHENTICATED')

module.exports = {
  AUTHENTICATED,
  async isAuthenticated (username) {
    return redisClient.get(username)
  },
  async getSecretKey (username, password) {
    if (password === AUTHENTICATED) {
      return redisClient.get(username)
    } else {
      return generateKey(password)
    }
  },
  async authenticate (username, password) {
    const user = await User.findOne({ where: { username } })
    if (!user) return false

    const hashed = user.password

    if (await comparePassword(password, hashed)) {
      await redisClient.set(username, generateKey(password), 'EX', 3 * 60)
      return user
    }

    return null
  }
}
