'use strict'

const express = require('express')
const msgpack = require('express-msgpack')
const app = express()

app.use(msgpack())

// Use Content-Type: application/msgpack
app.post('/decode', (req, res) => {
  const body = req.body
  console.log(body)
  res.send(body)
})

// User Accept: application/msgpack
app.get('/encode', (req, res) => {
  res.json({ hello: 'world' })
})

app.listen(8080, () => {
  console.log('Listening on port 8080')
})
