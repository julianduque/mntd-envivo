'use strinct'

const fs = require('fs')
const path = require('path')
const chalk = require('chalk')
const { Suite } = require('benchmark')
const protobufjs = require('protobufjs')
const msgpack = require('@msgpack/msgpack')
const avro = require('avsc')

function run (schema, opts) {
  const type = avro.parse(schema)
  return [DecodeSuite, EncodeSuite].map(BenchmarkSuite => {
    const stats = []
    const suite = new BenchmarkSuite(type, opts)
      .on('start', () => console.error(`${chalk.green(BenchmarkSuite.key_)} ${type}`))
      .on('cycle', formatStats)
      .run()

    stats.push({
      value: suite.getValue(),
      stats: suite.map(benchmark => {
        const stats = benchmark.stats
        return {
          name: benchmark.name,
          mean: stats.mean,
          rme: stats.rme
        }
      })
    })
    return { name: Suite.key_, stats }
  })
}

class CustomSuite extends Suite {
  constructor (type, opts) {
    super()

    this._type = type
    this._compatibleType = avro.parse(type.getSchema(), {
      typeHook,
      wrapUnions: opts.wrapUnions
    })
    this._value = opts.value ? type.fromString(opts.value) : type.random()

    Object.keys(opts).forEach(name => {
      const fn = this['__' + name]
      if (typeof fn === 'function') {
        this.add(name, fn.call(this, opts[name])) // Add benchmark.
      }
    })
  }

  getType (isProtoBuf) {
    return isProtoBuf ? this._compatibleType : this._type
  }

  getValue (isProtoBuf) {
    if (isProtoBuf) {
      const type = this.getType(true) // Read enum values as integers.
      return type.fromBuffer(this.getType().toBuffer(this._value))
    } else {
      return this._value
    }
  }
}

class DecodeSuite extends CustomSuite {
  __avsc () {
    const type = this.getType()
    const buf = type.toBuffer(this.getValue())
    return function () {
      const val = type.fromBuffer(buf)
      if (val.$) {
        throw new Error()
      }
    }
  }

  __protobufjs (args) {
    const parts = args.split(':')
    const root = protobufjs.parse(fs.readFileSync(parts[0])).root
    const message = root.lookup(parts[1])
    const buf = message.encode(this.getValue(true)).finish()
    return () => {
      const obj = message.decode(buf)
      if (obj.$) {
        throw new Error()
      }
    }
  }

  __json () {
    const str = JSON.stringify(this.getValue())
    return () => {
      const obj = JSON.parse(str)
      if (obj.$) {
        throw new Error()
      }
    }
  }

  __jsonString () {
    const type = this.getType()
    const str = type.toString(this.getValue())
    return () => {
      const obj = JSON.parse(str)
      if (obj.$) {
        throw new Error()
      }
    }
  }

  __msgpack () {
    const buf = msgpack.encode(this.getValue())
    return () => {
      var obj = msgpack.decode(buf)
      if (obj.$) {
        throw new Error()
      }
    }
  }
}
DecodeSuite.key_ = 'decode'

class EncodeSuite extends CustomSuite {
  __avsc () {
    const type = this.getType()
    const val = this.getValue()
    return function () {
      const buf = type.toBuffer(val)
      if (!buf.length) {
        throw new Error()
      }
    }
  }

  __json () {
    const val = this.getValue()
    return () => {
      const str = JSON.stringify(val)
      if (!str.length) {
        throw new Error()
      }
    }
  };

  __protobufjs (args) {
    const parts = args.split(':')
    const root = protobufjs.parse(fs.readFileSync(parts[0])).root
    const message = root.lookup(parts[1])
    const val = this.getValue(true)
    return () => {
      const buf = message.encode(val).finish()
      if (!buf.length) {
        throw new Error()
      }
    }
  }

  __jsonString () {
    const type = this.getType()
    const obj = JSON.parse(type.toString(this.getValue()))
    return () => {
      const str = JSON.stringify(obj)
      if (!str.length) {
        throw new Error()
      }
    }
  }

  __msgpack () {
    const val = this.getValue()
    return () => {
      const buf = msgpack.encode(val)
      if (!buf.length) {
        throw new Error()
      }
    }
  }
}
EncodeSuite.key_ = 'encode'

function typeHook (attrs, opts) {
  if (attrs.type === 'enum') {
    return avro.parse('int', opts)
  }
}

function formatStats (event) {
  console.error(String(event.target))
}

const schema = path.join(__dirname, 'schemas', 'Coupon.avsc')
const results = run(schema, {
  json: true,
  jsonString: true,
  msgpack: true,
  protobufjs: path.join(__dirname, 'schemas', 'Coupon.proto:Coupon'),
  avsc: true
})

// console.log(JSON.stringify(results))
