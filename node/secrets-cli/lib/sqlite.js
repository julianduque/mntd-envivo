'use strict'

const path = require('path')
const { Database } = require('sqlite3').verbose()
const { hashPassword } = require('./crypto')

const client = new Database(path.join(__dirname, '..', 'secrets.db'))
const queries = {
  tableUsers: `
    CREATE TABLE IF NOT EXISTS users (
      user TEXT PRIMARY KEY,
      pass TEXT NOT NULL
    );
  `,
  tableSecrets: `
    CREATE TABLE IF NOT EXISTS secrets (
      user  TEXT,
      name  TEXT NOT NULL,
      value TEXT NOT NULL,
      PRIMARY KEY (user, name),
      FOREIGN KEY (user)
        REFERENCES users (user)
          ON DELETE CASCADE
          ON UPDATE NO ACTION
    );
  `
}

async function createDb () {
  return new Promise((resolve, reject) => {
    client.serialize(() => {
      client.run(queries.tableUsers)
      client.run(queries.tableSecrets, err => {
        if (err) return reject(err)

        resolve({
          client,
          createUser,
          listUsers,
          createSecret,
          listSecrets,
          getSecret,
          updateSecret,
          deleteSecret
        })
      })
    })
  })
}

async function createUser (user, pass) {
  const securePass = await hashPassword(pass)
  return new Promise((resolve, reject) => {
    const stmt = client.prepare('INSERT INTO users VALUES (?, ?)')
    stmt.run(user, securePass)
    stmt.finalize(err => {
      if (err) return reject(err)

      resolve()
    })
  })
}

async function listUsers () {
  return new Promise((resolve, reject) => {
    const users = []
    client.each('SELECT user FROM users', (err, row) => {
      if (err) return reject(err)

      users.push(row)
    }, (err, count) => {
      if (err) return reject(err)

      resolve({ count, users })
    })
  })
}

async function createSecret (user, name, value) {
  return new Promise((resolve, reject) => {
    const stmt = client.prepare('INSERT INTO secrets VALUES (?, ?, ?)')
    stmt.run(user, name, value, err => {
      if (err) return reject(err)

      resolve()
    })
  })
}

async function listSecrets (user) {
  return new Promise((resolve, reject) => {
    const stmt = client.prepare('SELECT name FROM secrets WHERE user = ?')
    stmt.all(user, (err, rows) => {
      if (err) return reject(err)

      resolve(rows)
    })
  })
}

async function getSecret (user, name) {
  return new Promise((resolve, reject) => {
    const stmt = client.prepare(`
      SELECT name, value FROM secrets 
      WHERE user = ? AND name = ?
    `)

    stmt.get(user, name, (err, row) => {
      if (err) return reject(err)

      stmt.finalize(() => {
        resolve(row)
      })
    })
  })
}

async function updateSecret (user, name, value) {
  return new Promise((resolve, reject) => {
    const stmt = client.prepare(
      `
      UPDATE secrets
      SET value = ?
      WHERE user = ? AND name = ?
      `
    )
    stmt.run(value, user, name, err => {
      if (err) return reject(err)

      resolve()
    })
  })
}

async function deleteSecret (user, name) {
  return new Promise((resolve, reject) => {
    const stmt = client.prepare(
      `
      DELETE FROM secrets WHERE user = ? AND name = ?
      `
    )
    stmt.run(user, name, err => {
      if (err) return reject(err)

      resolve()
    })
  })
}

module.exports = {
  createDb
}
