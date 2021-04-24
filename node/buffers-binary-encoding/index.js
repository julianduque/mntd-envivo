'use strict'

const buf = Buffer.from([0x01, 0x02, 0x03])

for (const c of buf) {
  console.log(c)
}