'use strict'

const path = require('path')

module.exports = {
  development: {
    dialect: 'sqlite',
    storage: path.join(__dirname, 'secrets_dev.db'),
    logging: false
  },
  test: {
    dialect: 'sqlite',
    storage: path.join(__dirname, 'secrets_dev.db')
  },
  production: {
    use_env_variable: 'DATABASE_URL'
  }
}
