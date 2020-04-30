'use strict'

const fs = require('fs')
const path = require('path')
const assert = require('assert')
const pkg = require('./package-minimal.json')
const protobufjs = require('protobufjs')

const main = async () => {
  const root = await protobufjs.load(path.join(__dirname, 'schemas', 'package.proto'))
  const Package = root.lookupType('Package')
  const err = Package.verify(pkg)
  if (err) throw err
  
  
  const message = Package.create(pkg)
  const buffer = Package.encode(message).finish()
  
  console.log('JSON Size: ' + Buffer.byteLength(JSON.stringify(pkg)))
  console.log('Protobuf Size: ' + Buffer.byteLength(buffer))

  const decodedMsg = Package.decode(buffer)
  const obj = Package.toObject(decodedMsg)

  assert.deepEqual(obj, pkg)
  fs.writeFileSync(path.join(__dirname, 'out', 'pkg-protubuf.dat'), buffer)
}

main().catch(console.error)