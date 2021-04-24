'use strict'

const { hashPassword, comparePassword, generateKey } = require('@mntd/crypto')
const db = require('@mntd/db')

module.exports = {
  async createUser (username, password, fullName = '') {
    return db.User.create({
      username,
      password,
      fullName
    })
  },

  listUsers () {
    return db.User.findAndCountAll()
  },

  async changePassword (username, oldPassword, newPassword) {
    const user = await db.User.findOne({ where: { username } })
    const compared = await comparePassword(oldPassword, user.password)

    if (!compared) {
      throw new Error('Invalid Password')
    }

    user.password = await hashPassword(newPassword)
    await user.save()

    const oldKey = generateKey(oldPassword)
    const newKey = generateKey(newPassword)

    const redis = db.createRedisClient()
    redis.publish('update-pass', JSON.stringify({
      username,
      oldKey,
      newKey
    }))
  }
}
