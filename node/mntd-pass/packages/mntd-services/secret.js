'use strict'

const db = require('@mntd/db')
const { getSecretKey } = require('@mntd/auth')
const { generateKey, encrypt, decrypt } = require('@mntd/crypto')

module.exports = {
  async createSecret (username, password, name, value) {
    const user = await db.User.findOne({ where: { username } })

    if (!user) throw new Error('User not found')

    const secretKey = await getSecretKey(username, password)
    const randomKey = user.randomKey
    const encrypted = encrypt(value, secretKey, randomKey)

    return db.Secret.create({
      username,
      name,
      value: encrypted
    })
  },

  listSecrets (username) {
    return db.Secret.findAndCountAll({ where: { username } })
  },

  async getSecret (user, pass, name) {
    const secretKey = generateKey(pass)
    const randomKey = user.randomKey
    const secret = await db.Secret.findOne({
      where: {
        username: user.username,
        name
      }
    })

    if (!secret) return false

    const decrypted = decrypt(secret.value, secretKey, randomKey)

    return {
      ...secret.toJSON(),
      ...{
        value: decrypted
      }
    }
  },

  updateSecret (user, pass, name, value) {
    const secretKey = generateKey(pass)
    const randomKey = user.randomKey
    const encrypted = encrypt(value, secretKey, randomKey)

    return db.Secret.update({
      value: encrypted
    }, { where: { username: user.username, name } })
  },

  deleteSecret (user, name) {
    return db.Secret.destroy({
      where: {
        username: user.username,
        name
      }
    })
  }
}
