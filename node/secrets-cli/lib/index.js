'use strict'

const path = require('path')

function createDb (type) {
  const db = require(path.join(__dirname, `${type}.js`))
  return db.createDb()
}

module.exports = {
  createDb
}
