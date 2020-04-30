'use strict'

const fs = require('fs')
const net = require('net')
const path = require('path')
const avro = require('avsc')

const protocolFile = fs.readFileSync(path.join(__dirname, 'Service.avsc'), 'utf8')
const protocol = avro.readProtocol(protocolFile)

const messages = []

const server = avro.Service.forProtocol(protocol)
  .createServer()
  .onSendMessage(sendMessage)
  .onGetHistory(getHistory)

function sendMessage (data, callback) {
  messages.push(data)
  callback(null, true)
}

function getHistory (callback) {
  callback(null, { messages })
}

net.createServer()
  .on('connection', conn => server.createChannel(conn))
  .listen(5000)
