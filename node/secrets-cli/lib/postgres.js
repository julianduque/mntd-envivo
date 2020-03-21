'use strict'

const { Client } = require('pg')
const { hashPassword, comparePassword, generateKey, generateRandomKey, encrypt, decrypt } = require('./crypto')

const dbUrl = process.env.DB_URL
const client = new Client({
  connectionString: dbUrl
})

const queries = {
  tableUsers: `
    CREATE TABLE IF NOT EXISTS users (
      username  text PRIMARY KEY,
      password  text NOT NULL,
      randomkey text NOT NULL
    );
  `,
  tableSecrets: `
    CREATE TABLE IF NOT EXISTS secrets (
      username  text REFERENCES users (username),
      name      text NOT NULL,
      value     text NOT NULL,
      PRIMARY KEY (username, name)
    );
  `
}

async function createDb () {
  await client.connect()

  await client.query(queries.tableUsers)
  await client.query(queries.tableSecrets)

  return {
    client,
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
  const res = await client.query(`
    SELECT username, password, randomkey FROM users WHERE username = $1
  `, [
    username
  ])

  if (!res || !res.rows || !res.rows[0]) return false
  const user = res.rows[0]
  const hashed = user.password

  delete user.password

  if (comparePassword(password, hashed)) {
    return user
  }

  return null
}

async function createUser (username, password) {
  await client.query('INSERT INTO users VALUES ($1, $2, $3)',
    [
      username,
      await hashPassword(password),
      generateRandomKey()
    ]
  )
  await client.end()
}

async function listUsers () {
  const res = await client.query('SELECT username AS user FROM users')
  client.end()
  return {
    count: res.rowCount,
    users: res.rows
  }
}

async function createSecret (username, pass, name, value) {
  const user = await getAuthenticatedUser(username, pass)
  if (!user) return

  const secretKey = generateKey(pass)
  const randomKey = user.randomkey
  const encrypted = encrypt(value, secretKey, randomKey)

  await client.query('INSERT INTO secrets VALUES ($1, $2, $3)', [
    username,
    name,
    encrypted
  ])
  await client.end()
}

async function listSecrets (user) {
  const res = await client.query('SELECT name FROM secrets WHERE username = $1', [
    user
  ])
  await client.end()
  return res.rows
}

async function getSecret (username, pass, name) {
  const res = await client.query(`
    SELECT name, value FROM secrets
    WHERE username = $1 AND name = $2  
  `, [
    username,
    name
  ])
  const user = await getAuthenticatedUser(username, pass)
  if (!user) return

  if (!res.rows.length > 0) return
  const secret = res.rows[0]

  const secretKey = generateKey(pass)
  const randomKey = user.randomkey
  const decrypted = decrypt(secret.value, secretKey, randomKey)

  secret.value = decrypted

  await client.end()
  return secret
}

async function updateSecret (user, name, value) {
  await client.query(`
    UPDATE secrets
    SET value = $3
    WHERE username = $1 AND name = $2
  `, [
    user,
    name,
    value
  ])
  await client.end()
}

async function deleteSecret (user, name) {
  await client.query(`
    DELETE FROM secrets WHERE username = $1 AND name = $2
  `, [
    user,
    name
  ])
  await client.end()
}

module.exports = {
  createDb
}
