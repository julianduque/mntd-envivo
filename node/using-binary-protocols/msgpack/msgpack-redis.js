'use strict'

const Redis = require('ioredis')
const msgpack = require('@msgpack/msgpack')

const redis = new Redis()
const sub = new Redis()

const start = async () => {
  const data = Buffer.from(msgpack.encode({ my: 'buffer' }))
  await redis.setBuffer('my-buffer', data)

  const buffer = await redis.getBuffer('my-buffer')
  console.log(msgpack.decode(buffer))

  await sub.subscribe('my-channel')
  sub.on('messageBuffer', (topicBuffer, messageBuffer) => {
    const topic = topicBuffer.toString('utf8')
    if (topic === 'my-channel') {
      console.log(msgpack.decode(messageBuffer))
    }
  })

  setInterval(() => {
    const messageBuffer = Buffer.from(msgpack.encode({ hello: 'world' }))
    redis.publishBuffer('my-channel', messageBuffer)
  }, 3000)
}

start()
