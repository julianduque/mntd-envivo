'use strict'

const fs = require('fs')
const path = require('path')
const assert = require('assert')
const { encode, decode } = require('@msgpack/msgpack')
const pkg = require('./package-minimal')

const jsonString = JSON.stringify(pkg)
const encodedPkg = encode(pkg)

console.log('JSON Size: ' + Buffer.byteLength(jsonString))
console.log('MsgPack Size: ' + Buffer.byteLength(encodedPkg))

assert.deepEqual(pkg, decode(encodedPkg))
fs.writeFileSync(path.join(__dirname, 'out', 'pkg-msgpack.dat'), encodedPkg)