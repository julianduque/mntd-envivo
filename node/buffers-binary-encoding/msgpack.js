'use strict'

const fs = require('fs')
const path = require('path')
const assert = require('assert')
const { encode, decode } = require('@msgpack/msgpack')
const pkg = require('./package-minimal.json')

const jsonString = JSON.stringify(pkg)
const pkgEncoded = encode(pkg)
console.log(Buffer.byteLength(jsonString))
console.log(Buffer.byteLength(pkgEncoded))

assert.deepStrictEqual(pkg, decode(pkgEncoded))
fs.writeFileSync(path.join(__dirname, 'out', 'package-msgpack.dat'), pkgEncoded)