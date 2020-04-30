'use strict'

const path = require('path')
const protoLoader = require('@grpc/proto-loader')
const grpc = require('@grpc/grpc-js')

const packageDefinition = protoLoader.loadSync(
  path.join(__dirname, 'Service.proto'),
  {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    arrays: true
  }
)
const packageObject = grpc.loadPackageDefinition(packageDefinition)
const chat = packageObject.Chat

const messages = []

function sendMessage (call, callback) {
  messages.push(call.request)
  callback(null, { status: true })
}

function getHistory (call, callback) {
  callback(null, { messages })
}

function getHistoryStream (call) {
  messages.forEach((message) => call.write(message))
  call.end()
}

const start = () => {
  const server = new grpc.Server()
  server.addService(chat.service, {
    sendMessage,
    getHistory,
    getHistoryStream
  })

  server.bindAsync('0.0.0.0:5001', grpc.ServerCredentials.createInsecure(), (err) => {
    if (err) throw err
    server.start()
  })
}

start()
