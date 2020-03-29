'use strict'

const db = require('../models')
const { hashPassword, comparePassword, generateKey, generateRandomKey, encrypt, decrypt } = require('./crypto')

async function authenticate (username, password) {
  const user = await getAuthenticatedUser(username, password)
  return user !== null
}

async function getAuthenticatedUser (username, password) {
  const user = await db.User.findOne({
    where: { username },
    raw: true
  })

  if (!user) return false
  const hashed = user.password

  delete user.password

  if (comparePassword(password, hashed)) {
    return user
  }

  return null
}

async function createUser (username, password) {
  const user = db.User.build({
    username,
    password: await hashPassword(password),
    randomkey: generateRandomKey()
  })

  await user.save()
}

async function listUsers () {
  const res = await db.User.findAll({ raw: true })
  return {
    count: res.length,
    users: res
  }
}

async function createSecret (username, pass, name, value) {
  const user = await getAuthenticatedUser(username, pass)
  if (!user) return

  const secretKey = generateKey(pass)
  const randomKey = user.randomkey
  const encrypted = encrypt(value, secretKey, randomKey)

  await db.Secret.build({
    username,
    name,
    value: encrypted
  }).save()
}

async function listSecrets (user) {
  const secrets = await db.Secret.findAll({
    where: {
      username: user
    },
    raw: true
  })
  return secrets
}

async function getSecret (username, pass, name) {
  const secret = await db.Secret.findOne({
    where: {
      username,
      name
    },
    raw: true
  })
  const user = await getAuthenticatedUser(username, pass)
  if (!user) return

  if (!secret) return

  const secretKey = generateKey(pass)
  const randomKey = user.randomkey
  const decrypted = decrypt(secret.value, secretKey, randomKey)

  secret.value = decrypted
  return secret
}

async function updateSecret (username, name, value, pass) {
  const user = await db.User.findOne({ where: { username }, raw: true })
  const secret = await db.Secret.findOne({
    where: {
      username,
      name
    }
  })

  const secretKey = generateKey(pass)
  const randomKey = user.randomkey
  const encrypted = encrypt(value, secretKey, randomKey)

  secret.value = encrypted
  await secret.save()
}

async function deleteSecret (user, name) {
  const secret = await db.Secret.findOne({
    where: {
      username: user,
      name
    }
  })

  await secret.destroy()
}

module.exports = {
  createUser,
  listUsers,
  createSecret,
  listSecrets,
  getSecret,
  updateSecret,
  deleteSecret,
  authenticate
}
