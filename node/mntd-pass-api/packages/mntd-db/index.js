'use strict'

const Redis = require('ioredis')
const db = require('./models')

db.createRedisClient = () => {
  return new Redis()
}

module.exports = db
