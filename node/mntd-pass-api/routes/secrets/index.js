'use strict'

const { secretServices } = require('@mntd/services')
module.exports = async function (fastify, options) {
  fastify.addSchema({
    $id: 'publicSecret',
    type: 'object',
    properties: {
      username: { type: 'string' },
      name: { type: 'string' },
      createdAt: { type: 'string' }
    }
  })
  fastify.addSchema({
    $id: 'secrets',
    type: 'array',
    items: { $ref: 'publicSecret#' }
  })
  fastify.addSchema({
    $id: 'result',
    type: 'object',
    properties: {
      count: { type: 'integer' },
      data: { $ref: 'secrets#' }
    }
  })
  fastify.get(
    '/secrets/:username',
    {
      preValidation: fastify.auth([fastify.validateJWT]),
      schema: {
        response: {
          200: 'result#'
        }
      }
    },
    async (req, reply) => {
      const { username } = req.params
      const secrets = await secretServices.listSecrets(username)
      return {
        count: secrets.count,
        data: secrets.rows
      }
    }
  )

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
  fastify.post(
    '/secrets',
    {
      preValidation: fastify.auth([fastify.validateJWT]),
      schema: {
        body: 'createSecret#',
        response: {
          201: 'publicSecret#'
        }
      }
    },
    async (req, reply) => {
      const { username, name, value } = req.body
      reply.code(201)
      return secretServices.createSecret(username, name, value)
    }
  )
  fastify.addSchema({
    $id: 'deleteSecret',
    type: 'object',
    properties: {
      username: { type: 'string' },
      name: { type: 'string' }
    },
    required: ['username', 'name']
  })
  fastify.delete(
    '/secrets/:username/:name',
    {
      preValidation: fastify.auth([fastify.validateJWT]),
      schema: {
        body: 'deleteSecret#'
      }
    },
    async (req, reply) => {
      const { username, name } = req.params
      await secretServices.deleteSecret(username, name)
      reply.send({ status: 'deleted' })
    }
  )
  fastify.addSchema({
    $id: 'publicGetSecret',
    type: 'object',
    properties: {
      username: { type: 'string' },
      name: { type: 'string' },
      value: { type: 'string' },
      createdAt: { type: 'string' }
    }
  })
  fastify.get(
    '/secrets/:username/:name',
    {
      preValidation: fastify.auth([fastify.validateJWT]),
      schema: {
        response: {
          200: 'publicGetSecret#'
        }
      }
    },
    async (req, reply) => {
      const { username, name } = req.params
      const secret = await secretServices.getSecret(username, name)
      return secret
    }
  )

  fastify.addSchema({
    $id: 'updateSecret',
    type: 'object',
    properties: {
      value: { type: 'string' }
    },
    required: ['value']
  })
  fastify.put(
    '/secrets/:username/:name',
    {
      preValidation: fastify.auth([fastify.validateJWT]),
      schema: {
        body: 'updateSecret#'
      }
    },
    async (req, reply) => {
      const { username, name } = req.params
      const { value } = req.body
      await secretServices.updateSecret(username, name, value)
      reply.send({ status: 'updated' })
    }
  )
}
