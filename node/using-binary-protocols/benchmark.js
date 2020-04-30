'use strict'

const fs = require('fs')
const net = require('net')
const path = require('path')
const avro = require('avsc')
const protoLoader = require('@grpc/proto-loader')
const grpc = require('@grpc/grpc-js')
const { Suite } = require('benchmark')

// Avro
const protocolFile = fs.readFileSync(
  path.join(__dirname, 'avro', 'Service.avsc'),
  'utf8'
)
const protocol = avro.readProtocol(protocolFile)
const service = avro.Service.forProtocol(protocol)

const avroClient = service.createClient({
  buffering: true,
  transport: net.connect(5000)
})

// GRPC
const packageDefinition = protoLoader.loadSync(
  path.join(__dirname, 'grpc', 'Service.proto'),
  {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    arrays: true
  }
)
const packageObject = grpc.loadPackageDefinition(packageDefinition)
const grpcClient = new packageObject.Chat('localhost:5001', grpc.credentials.createInsecure())

const sendMessageBench = new Suite()
const getHistoryBench = new Suite()

const payload = { name: 'Julian', content: 'Hello' }
const BENCH = process.env.BENCH || 'send'

function runGetHistory () {
  getHistoryBench
    .add('avro#getHistory', {
      defer: true,
      fn: async function (deferred) {
        avroClient.getHistory((err, result) => {
          if (err) throw err
          deferred.resolve()
        })
      }
    })
    .add('grpc#getHistory', {
      defer: true,
      fn: async function (deferred) {
        grpcClient.getHistory(null, (err, result) => {
          if (err) throw err
          deferred.resolve()
        })
      }
    })
    .on('cycle', event => {
      console.log(String(event.target))
    })
    .on('error', function (err) {
      console.log(err)
    })
    .on('complete', function () {
      console.log('Fastest is ' + this.filter('fastest').map('name'))
      process.exit(0)
    }).run({ async: true })
}

function runSendMessage () {
  sendMessageBench
    .add('avro#sendMessage', {
      defer: true,
      fn: async function (deferred) {
        avroClient.sendMessage(payload, (err, result) => {
          if (err) throw err
          deferred.resolve()
        })
      }
    })
    .add('grpc#sendMessage', {
      defer: true,
      fn: async function (deferred) {
        grpcClient.sendMessage(payload, (err, result) => {
          if (err) throw err
          deferred.resolve()
        })
      }
    })
    .on('cycle', event => {
      console.log(String(event.target))
    })
    .on('error', function (err) {
      console.log(err)
    })
    .on('complete', function () {
      console.log('Fastest is ' + this.filter('fastest').map('name'))
      process.exit(0)
    }).run({ async: true })
}

switch (BENCH) {
  case 'send':
    runSendMessage()
    break
  case 'get':
    runGetHistory()
    break
  default: runSendMessage()
}
