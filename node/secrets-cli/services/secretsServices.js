'use strict'

const db = require('../models')
const { generateKey, encrypt, decrypt } = require('../lib/crypto')

async function create (user, name, value) {
  const { username, password, randomKey } = user
  const secretKey = generateKey(password)
  const encrypted = encrypt(value, secretKey, randomKey)
  const secret = db.Secret.build({ username, name, value: encrypted })
  return secret.save()
}

async function list (user) {
  const { username } = user
  const secrets = db.Secret.findAndCountAll({ where: { username } })
  return secrets
}

async function getSecrets (user, name) {
  const { username, password, randomKey } = user
  const result = await db.Secret.findOne({ where: { username, name } })

  if (!result) return null

  const secret = result.toJSON()

  const secretKey = generateKey(password)
  const decrypted = decrypt(secret.value, secretKey, randomKey)

  return {
    ...secret,
    value: decrypted
  }
}

async function update (user, name, value) {
  const { username, password, randomKey } = user
  const secretKey = generateKey(password)
  const encrypted = encrypt(value, secretKey, randomKey)

  return db.Secret.update({ value: encrypted }, { where: { username, name } })
}

async function deleteSecret (user, name) {
  const { username } = user
  return db.Secret.destroy({ where: { username, name } })
}

module.exports = {
  create,
  list,
  getSecrets,
  update,
  deleteSecret
}
