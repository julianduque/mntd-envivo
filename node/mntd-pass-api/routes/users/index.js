'use strict'

const { userServices } = require('@mntd/services')

async function userRoutes(fastify, options) {
  fastify.addSchema({
    $id: 'publicUser',
    type: 'object',
    properties: {
      username: { type: 'string' },
      fullName: { type: 'string' },
      createdAt: { type: 'string' }
    }
  })
  fastify.addSchema({
    $id: 'createUser',
    type: 'object',
    properties: {
      username: { type: 'string' },
      password: { type: 'string' }
    },
    required: ['username', 'password']
  })
  fastify.addSchema({
    $id: 'users',
    type: 'array',
    items: { $ref: 'publicUser#' }
  })

  fastify.get(
    '/users',
    {
      preValidation: fastify.auth([fastify.validateJWT]),
      schema: {
        response: {
          200: 'users#'
        }
      }
    },
    async (request, reply) => {
      const users = await userServices.listUsers()
      return users.rows
    }
  )

  fastify.post(
    '/users',
    {
      schema: {
        body: 'createUser#',
        response: {
          201: 'publicUser#'
        }
      }
    },
    async (request, reply) => {
      const { username, password, fullName } = request.body
      reply.code(201)
      return userServices.createUser(username, password, fullName)
    }
  )
}

module.exports = userRoutes
