#!/usr/bin/env node

'use strict'

require('dotenv').config()

const minimist = require('minimist')
const promptly = require('promptly')
const { createDb } = require('./lib')
const argv = minimist(process.argv.slice(2))

const promptPassword = () => promptly.password('Enter your password: ', { replace: '*' })

async function main () {
  const db = await createDb(process.env.DB_TYPE)
  const command = argv._.shift()

  switch (command) {
    case 'users:create':
      try {
        const { user } = argv
        const pass = await promptPassword()
        await db.createUser(user, pass)
        console.log(`${user} created`)
      } catch (err) {
        console.log(err)
        throw new Error('Cannot create user')
      }
      break
    case 'users:list':
      try {
        const results = await db.listUsers()
        results.users.forEach(u => {
          console.log(`- ${u.user}`)
        })
        console.log(`\tTotal: ${results.count}`)
      } catch (err) {
        throw new Error('Cannot list user')
      }
      break
    case 'secrets:create':
      try {
        const { user, name, value } = argv
        const pass = await promptPassword()
        const isAuth = await db.authenticate(user, pass)
        if (!isAuth) throw new Error('Invalid user or password')

        await db.createSecret(user, pass, name, value)
        console.log(`secret: ${name} created`)
      } catch (err) {
        console.log(err)
        throw new Error('Cannot create secret')
      }
      break
    case 'secrets:list':
      try {
        const { user } = argv

        const pass = await promptPassword()
        const isAuth = await db.authenticate(user, pass)
        if (!isAuth) throw new Error('Invalid user or password')

        const secrets = await db.listSecrets(user)
        secrets.forEach(s => {
          console.log(`- ${s.name}`)
        })
      } catch (err) {
        throw new Error('Cannot list secrets')
      }
      break
    case 'secrets:get':
      try {
        const { user, name } = argv
        const pass = await promptPassword()
        const isAuth = await db.authenticate(user, pass)
        if (!isAuth) throw new Error('Invalid user or password')

        const secret = await db.getSecret(user, pass, name)
        if (!secret) return console.log(`secret ${name} not found`)
        console.log(`- ${secret.name} = ${secret.value}`)
      } catch (err) {
        console.log(err)
        throw new Error('Cannot get secret')
      }
      break
    case 'secrets:update':
      try {
        const { user, name, value } = argv
        const pass = promptPassword()
        const isAuth = await db.authenticate(user, pass)
        if (!isAuth) throw new Error('Invalid user or password')

        await db.updateSecret(user, name, value)
        console.log(`secret ${name} updated`)
      } catch (err) {
        throw new Error('Cannot update secret')
      }
      break
    case 'secrets:delete':
      try {
        const { user, name } = argv
        const pass = await promptPassword()
        const isAuth = await db.authenticate(user, pass)
        if (!isAuth) throw new Error('Invalid user or password')

        await db.deleteSecret(user, name)
        console.log(`secret ${name} deleted`)
      } catch (err) {
        throw new Error('Cannot delete secret')
      }
      break
    default:
      console.error(`command not found: ${command}`)
  }
}

main().catch(err => console.log(err))
