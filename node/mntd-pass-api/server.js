'use strict'

const fastify = require('fastify')({
  logger: {
    prettyPrint: true
  }
})
const port = process.env.PORT || 8080

// Register Routes
fastify
  .register(require('fastify-helmet'))
  .register(require('@plugins/authentication'))
  .after(() => {
    fastify
      .register(require('@routes/users'))
      .register(require('@routes/secrets'))
      .get('/', async (request, reply) => {
        return { version: 'mntd-pass v0.1' }
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
