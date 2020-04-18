'use strict'

const fastify = require('fastify')({
  logger: {
    prettyPrint: true
  }
})
const port = process.env.PORT || 8080

// Register Routes
fastify
  .register(require('@plugins/authentication'))
  .after(() => {
    fastify.register(require('@routes/users'))
      .get('/', async (request, reply) => {
        return { hello: 'world' }
      })
      .post('/', async (request, reply) => {
        return { hello: 'world post' }
      })
      .get('/private', {
        preValidation: fastify.auth([fastify.validateJWT])
      }, async (request, reply) => {
        return 'yays'
      })
  })

const start = async () => {
  try {
    await fastify.listen(port)
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

start()
