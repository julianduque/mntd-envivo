'use strict'

const { authenticate } = require('@mntd/auth')
const fp = require('fastify-plugin')
const messages = {
  badRequestErrorMessage: 'Format is Authorization: Bearer [token]',
  noAuthorizationInHeaderMessage: 'Autorization header is missing!',
  authorizationTokenExpiredMessage: 'Authorization token expired',
  // for the below message you can pass a sync function that must return a string as shown or a string
  authorizationTokenInvalid: err => {
    return `Authorization token is invalid: ${err.message}`
  }
}
async function authentication(fastify, options) {
  fastify
    .register(require('fastify-jwt'), {
      secret: 'supersecret',
      messages,
      sign: {
        expiresIn: 300
      }
    })
    .register(require('fastify-auth'))
    .decorate('validateJWT', async (request, reply) => {
      try {
        await request.jwtVerify()
      } catch (err) {
        reply.send(err)
      }
    })
    .decorate('validateUserPassword', async (request, reply) => {
      const { username, password } = request.body
      if (await authenticate(username, password)) {
        request.user = username
      } else {
        reply.code(401).send(new Error('Forbidden'))
      }
    })
    .after(() => {
      fastify.post(
        '/auth',
        {
          preValidation: fastify.auth([fastify.validateUserPassword])
        },
        async (request, reply) => {
          const user = request.user
          const token = fastify.jwt.sign({ user })
          return token
        }
      )
    })
}

module.exports = fp(authentication)
