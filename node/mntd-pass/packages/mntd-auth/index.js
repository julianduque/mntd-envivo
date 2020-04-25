'use strict'

const { User, createRedisClient } = require('@mntd/db')
const { comparePassword, generateKey } = require('@mntd/crypto')

async function isAuthenticated (username) {
  return await getSecretKey(username) != null
}

async function getSecretKey (username) {
  const redisClient = createRedisClient()
  const secretKey = await redisClient.get(username)
  redisClient.disconnect()
  return secretKey
}

async function authenticate (username, password) {
  const user = await User.findOne({ where: { username } })
  if (!user) return false

  const hashed = user.password

  if (await comparePassword(password, hashed)) {
    const redisClient = createRedisClient()
    await redisClient.set(username, generateKey(password), 'EX', 3 * 60)
    redisClient.disconnect()
    return user
  }

  return null
}

module.exports = {
  isAuthenticated,
  getSecretKey,
  authenticate
}
