'use strict'

const { User, redisClient } = require('@mntd/db')
const { comparePassword, generateKey } = require('@mntd/crypto')
const { promisify } = require('util')
const redisGet = promisify(redisClient.get).bind(redisClient)
const redisSet = promisify(redisClient.set).bind(redisClient)

const AUTHENTICATED = Symbol('AUTHENTICATED')

module.exports = {
  AUTHENTICATED,
  isAuthenticated (username) {
    return redisGet(username)
  },
  getSecretKey (username, password) {
    console.log(password)
    if (password === AUTHENTICATED) {
      return redisGet(username)
    } else {
      return generateKey(password)
    }
  },
  async authenticate (username, password) {
    const user = await User.findOne({ where: { username } })
    if (!user) return false

    const hashed = user.password

    if (await comparePassword(password, hashed)) {
      await redisSet(username, generateKey(password), 'EX', 3 * 60)
      return user
    }

    return null
  }
}
