const { Transform } = require('stream')

class UppercaserStream extends Transform {
  constructor() {
    super()
    this.setEncoding('utf8')
  }
  _transform (chunk, enc, callback) {
    this.push(chunk.toString().toUpperCase())
    callback()
  }
}

module.exports = UppercaserStream