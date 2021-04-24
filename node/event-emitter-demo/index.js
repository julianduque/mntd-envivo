'use strict'

const net = require('net')

const server = new net.Server()

server.on('connection', (socket) => {
  socket.setEncoding('utf8')
  socket.write('Welcome to the Echo Server\n')
  socket.on('data', (data) => {
    console.log(`Received: ${data}`)
    socket.write(`ECHO: ${data.toUpperCase()}`)
  })
})

server.listen(5000)