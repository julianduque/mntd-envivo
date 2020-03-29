const db = require('../models')
const {
  hashPassword,
  comparePassword,
  generateKey,
  generateRandomKey,
  encrypt,
  decrypt
} = require('./crypto')

function createDb () {
  return {
    createUser,
    listUsers,
    createSecret,
    listSecrets,
    getSecret,
    updateSecret,
    deleteSecret,
    authenticate
  }
}

async function authenticate (username, password) {
  const user = await getAuthenticatedUser(username, password)
  return user !== null
}

async function getAuthenticatedUser (username, password) {
  const res = await db.User.findOne({
    where: {
      username
    },
    attributes: ['id', 'username', 'password', 'fullName', 'randomkey']
  })

  if (!res) return false

  const user = res.toJSON()
  const hashed = user.password

  delete user.password

  if (comparePassword(password, hashed)) {
    return user
  }

  return null
}

async function createUser (username, passwd, fullName) {
  const password = await hashPassword(passwd)
  const randomkey = generateRandomKey()

  const user = await db.User.create({
    username,
    password,
    fullName,
    randomkey
  })

  return user.toJSON()
}

async function listUsers () {
  const users = await db.User.findAndCountAll({
    attributes: ['username']
  })
  return {
    count: users.count,
    users: users.rows
  }
}

async function createSecret (username, pass, name, value) {
  const user = await getAuthenticatedUser(username, pass)
  if (!user) return

  const secretKey = generateKey(pass)
  const randomKey = user.randomkey
  const encrypted = encrypt(value, secretKey, randomKey)

  await db.Secret.create({
    username,
    name,
    value: encrypted
  })
}

async function listSecrets (user) {
  const res = await db.Secret.findAll({ where: { username: user }})
  return res
}

async function getSecret (username, pass, name) {
  const res = await db.Secret.findOne({
    where: {
      username,
      name
    }
  })

  const user = await getAuthenticatedUser(username, pass)
  if (!user) return

  if (!res) return
  const secret = res.toJSON()

  const secretKey = generateKey(pass)
  const randomKey = user.randomkey
  const decrypted = decrypt(secret.value, secretKey, randomKey)

  secret.value = decrypted

  return secret
}

async function updateSecret (username, name, value, pass) {
  const user = await getAuthenticatedUser(username, pass)
  if (!user) return

  const secretKey = generateKey(pass)
  const randomKey = user.randomkey
  const encrypted = encrypt(value, secretKey, randomKey)

  await db.Secret.update({
    value: encrypted
  },{
    where: {
      username: user.username,
      name
    }
  })
}

async function deleteSecret (user, name) {
  const secret = await db.Secret.findOne({
    where: {
      username: user,
      name: name,
    }
  })

  if(!secret) return

  await secret.destroy({ force: true })
}

module.exports = {
  createDb
}