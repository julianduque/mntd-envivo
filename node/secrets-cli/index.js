#!/usr/bin/env node

'use strict'

require('dotenv').config()

const minimist = require('minimist')
const promptly = require('promptly')
const argv = minimist(process.argv.slice(2))
const Sequelize = require('sequelize')
const { usersServices, secretsServices, authServices } = require('./services')

const promptPassword = () => promptly.password('Enter your password: ', { replace: '*' })

async function main () {
  const command = argv._.shift()

  switch (command) {
    case ('users:create'):
      try {
        const { user } = argv
        const password = await promptPassword()
        const created = await usersServices.create(user, password)
        console.log(created.toJSON())
        console.log('users create Success.')
      } catch (err) {
        if (err instanceof Sequelize.UniqueConstraintError) throw new Error('Username already exists')
        else throw new Error('Cannot create user')
      }
      break
    case ('users:list'):
      try {
        const results = await usersServices.list()
        results.rows.forEach(u => {
          console.log(`- ${u.username}`)
        })
        console.log(`\tTotal: ${results.count}`)
      } catch (err) {
        throw new Error('Cannot list user')
      }
      break
    case ('secrets:create'):
      try {
        const { user, name, value } = argv
        const pass = await promptPassword()
        const isAuth = await authServices.authenticate(user, pass)
        if (!isAuth) throw new Error('Invalid user or password')

        const secret = await secretsServices.create(isAuth, pass, name, value)
        console.log(secret.toJSON())
        console.log(`secret: ${name} created for user '${isAuth.username}'`)
      } catch (err) {
        console.log(err)
        if (err instanceof Sequelize.UniqueConstraintError) throw new Error('Secret name already exists')
        else throw new Error('Cannot create secret')
      }
      break
    case ('secrets:list'):
      try {
        const { user } = argv

        const pass = await promptPassword()
        const isAuth = await authServices.authenticate(user, pass)
        if (!isAuth) throw new Error('Invalid user or password')

        const secrets = await secretsServices.list(isAuth)
        secrets.rows.forEach(s => {
          console.log(`- ${s.name}`)
        })
        console.log(`\tTotal: ${secrets.count}`)
      } catch (err) {
        throw new Error('Cannot list secrets')
      }
      break
    case 'secrets:get':
      try {
        const { user, name } = argv
        const pass = await promptPassword()
        const isAuth = await authServices.authenticate(user, pass)
        if (!isAuth) throw new Error('Invalid user or password')

        const secret = await secretsServices.getSecrets(isAuth, pass, name)
        if (!secret) return console.log(`secret ${name} not found`)

        console.log(`name: ${secret.name}, value: ${secret.value}`)
      } catch (err) {
        throw new Error('Cannot get secret')
      }
      break
    case 'secrets:update':
      try {
        const { user, name, value } = argv
        const pass = await promptPassword()
        const isAuth = await authServices.authenticate(user, pass)
        if (!isAuth) throw new Error('Invalid user or password')

        await secretsServices.update(isAuth, pass, name, value)
        console.log(`secret ${name} updated`)
      } catch (err) {
        throw new Error('Cannot update secret')
      }
      break
    case 'secrets:delete':
      try {
        const { user, name } = argv
        const pass = await promptPassword()
        const isAuth = await authServices.authenticate(user, pass)
        if (!isAuth) throw new Error('Invalid user or password')

        await secretsServices.deleteSecret(isAuth, name)
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
