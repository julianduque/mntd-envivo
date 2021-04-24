'use strict'

const { secretServices } = require('@mntd/services')

async function secretRoutes (fastify, options) {
  fastify.addSchema({
    $id: 'publicSecret',
    type: 'object',
    properties: {
      username: { type: 'string' },
      name: { type: 'string' }
    }
  })
  fastify.addSchema({
    $id: 'createSecret',
    type: 'object',
    properties: {
      username: { type: 'string' },
      name: { type: 'string' },
      value: { type: 'string' }
    },
    required: ['username', 'name', 'value']
  })
  fastify.addSchema({
    $id: 'deleteSecret',
    type: 'object',
    properties: {
      username: { type: 'string' },
      name: { type: 'string' }
    },
    required: ['username', 'name']
  })
  fastify.addSchema({
    $id: 'secrets',
    type: 'array',
    items: { $ref: 'publicSecret#' }
  })

  fastify.get('/secrets/:username', {
    preValidation: fastify.auth([fastify.validateJWT]),
    schema: {
      response: {
        200: 'secrets#'
      }
    }
  }, async (request, reply) => {
    const { username } = request.params
    const secrets = await secretServices.listSecrets(username)
    return secrets.rows
  })

  fastify.post('/secrets', {
    preValidation: fastify.auth([fastify.validateJWT]),
    schema: {
      body: 'createSecret#',
      response: {
        201: 'publicSecret#'
      }
    }
  }, async (request, reply) => {
    const { username, name, value } = request.body
    reply.code(201)
    return secretServices.createSecret(username, name, value)
  })

  fastify.delete('/secrets/:username/:name', {
    preValidation: fastify.auth([fastify.validateJWT])
  }, async (request, reply) => {
    const { username, name } = request.params
    await secretServices.deleteSecret(username, name)
    reply.send({ status: 'deleted' })
  })

  fastify.get('/secrets/:username/:name', {
    preValidation: fastify.auth([fastify.validateJWT])
  }, async (request, reply) => {
    const { username, name } = request.params
    return secretServices.getSecret(username, name)
  })
}

module.exports = secretRoutes
