'use strict'

const fs = require('fs')
const { promisify } = require('util')
const stream = require('stream')
const pipeline = promisify(stream.pipeline)
const MyReadable = require('./MyReadable')
const getStream = require('get-stream')
const JSONStream = require('JSONStream')
const UppercaserStream = require('./UppercaserStream')

async function main () {
  try {
    await pipeline(
      fs.createReadStream('stdin.txt'),
      new UppercaserStream(),
      process.stdout
    )
  } catch (err) {
    console.log(err.message)
  }
}

main()