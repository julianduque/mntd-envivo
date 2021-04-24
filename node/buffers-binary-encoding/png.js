'use strict'

const { PNG } = require('pngjs')
const fs = require('fs')

fs.createReadStream('./img/avatar.png')
  .pipe(new PNG({ filterType: 4 }))
  .on('parsed', function () {
    for (let y = 0; y < this.width; y++) {
      for (let x = 0; x < this.height; x++) {
        let idx = (this.width * y + x) << 2
        if (idx % 8 === 0) {
          this.data[idx] = 255 - this.data[idx]
          this.data[idx + 1] = 100 * this.data[idx + 1]
          this.data[idx + 2] = 100 - this.data[idx + 2]
          this.data[idx + 3] = this.data[idx + 3] >> 2
        }
      }
    }

    this.pack().pipe(fs.createWriteStream('./img/out.png'))
  })