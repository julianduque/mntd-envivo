'use strict'

const fastify = require('fastify')({
  logger: {
    prettyPrint: true
  }
})
const msgpack = require('@msgpack/msgpack')

// Using a Plugin for Serialization
fastify.register(require('fastify-accepts-serializer'), {
  // Magic... you can add more than just msgpack.. proto? avro?
  serializers: [
    {
      regex: /^application\/msgpack$/,
      serializer: body => Buffer.from(msgpack.encode(body))
    }
  ],
  default: 'application/json'
})

// Using Native for Content Type Decoding
fastify.addContentTypeParser('application/msgpack', {
  parseAs: 'buffer'
}, async (req, body, done) => {
  try {
    const res = msgpack.decode(body)
    return res
  } catch (err) {
    done(err)
  }
})

fastify.post('/decode', async (req, reply) => {
  const body = req.body
  fastify.log.info(body)
  return body
})

fastify.get('/encode', (req, reply) => {
  reply.send({ hello: 'world' })
})

const start = async () => {
  try {
    await fastify.listen(8080)
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

start()
