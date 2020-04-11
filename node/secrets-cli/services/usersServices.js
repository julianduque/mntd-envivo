'use strict'
const db = require('../models')

async function create (username, password) {
  const user = db.User.build({ username, password })
  return user.save()
}

async function list () {
  const users = db.User.findAndCountAll()
  return users
}

module.exports = {
  create,
  list
}
