'use strict'

const db = require('@mntd/db')
const { generateKey, encrypt, decrypt } = require('@mntd/crypto')

module.exports = {
  createSecret (user, password, name, value) {
    const secretKey = generateKey(password)
    const randomKey = user.randomKey
    const encrypted = encrypt(value, secretKey, randomKey)

    return db.Secret.create({
      username: user.username,
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
