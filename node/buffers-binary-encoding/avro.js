'use strict'

const fs = require('fs')
const path = require('path')
const assert = require('assert')
const avro = require('avsc')
const pkg = require('./package-minimal.json')

const schema = fs.readFileSync(path.join(__dirname, 'schema', 'Package.avsc.json'), 'utf8')

const type = avro.Type.forSchema(JSON.parse(schema))
const buffer = type.toBuffer(pkg)
const value = type.fromBuffer(buffer)

console.log(`JSON Size: ${Buffer.byteLength(JSON.stringify(pkg))}`)
console.log(`Avro Size: ${Buffer.byteLength(buffer)}`)

assert.deepEqual(value, pkg)
fs.writeFileSync(path.join(__dirname, 'out', 'pkg-avro.dat'), buffer)