const { Readable } = require('stream')


class MyReadable extends Readable {
  #interval = null

  constructor() {
    super({ objectMode: true })

    this.count = 0
  }

  _read () {
    this.push({ count: this.count++ })
  }
}

module.exports = MyReadable