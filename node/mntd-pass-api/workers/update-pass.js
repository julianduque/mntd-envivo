'use strict'

const { createRedisClient } = require('@mntd/db')
const { secretServices } = require('@mntd/services')

const subscriber = createRedisClient()

subscriber.subscribe('update-pass')
subscriber.on('message', (topic, data) => {
  switch (topic) {
    case 'update-pass':
      try {
        const parsed = JSON.parse(data)
        const { username, oldKey, newKey } = parsed
        secretServices.updateAllSecrets(username, oldKey, newKey)
      } catch (err) {
        console.error(err)
      }
      break
  }
})
