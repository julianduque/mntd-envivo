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
const chat = new packageObject.Chat('localhost:5001', grpc.credentials.createInsecure())

chat.sendMessage({ name: 'Julian', content: 'Hello' }, (err, result) => {
  if (err) throw err
  console.log(result)
  console.log('sent')

  chat.getHistory(null, (err, result) => {
    if (err) throw err
    console.log(result)
  })

  const history = chat.getHistoryStream(null)
  history.on('data', d => console.log(`From stream: ${JSON.stringify(d)}`))
})
