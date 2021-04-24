'use strict'

const http = require('http')
const server = http.createServer((req, res) => {
  res.end('Hello World')
})

server.on('request', (req, res) => {
  console.log(req.headers)
})

server.listen(3000)