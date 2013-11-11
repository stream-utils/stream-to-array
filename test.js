var assert = require('assert')
var path = require('path')
var fs = require('fs')
var stream = require('stream')
var co = require('co')

var streamTo = require('./')

var file = path.join(__dirname, 'index.js')

function emptyStream() {
  var s = new stream()
  process.nextTick(function () {
    s.emit('end')
  })
  return s
}

describe('Stream To', function () {
  describe('Array', function () {
    it('should work', function (done) {
      streamTo.array(fs.createReadStream(file), function (err, arr) {
        if (err)
          return done(err)

        assert.ok(Array.isArray(arr))
        assert.ok(arr.length)

        done()
      })
    })

    it('should work as a yieldable', function (done) {
      co(function* () {
        var arr = yield streamTo.array(fs.createReadStream(file))
        assert.ok(Array.isArray(arr))
        assert.ok(arr.length)
      })(done)
    })

    it('should work as a yieldable with zalgo', function (done) {
      co(function* () {
        var arr = yield streamTo.array(emptyStream())
        assert.ok(Array.isArray(arr))
        assert.equal(arr.length, 0)
      })(done)
    })
  })

  describe('Buffer', function () {
    it('should work', function (done) {
      streamTo.buffer(fs.createReadStream(file), function (err, buf) {
        if (err)
          return done(err)

        assert.ok(Buffer.isBuffer(buf))
        assert.ok(buf.length)

        done()
      })
    })

    it('should work as a yieldable', function (done) {
      co(function* () {
        var buf = yield streamTo.buffer(fs.createReadStream(file))
        assert.ok(Buffer.isBuffer(buf))
        assert.ok(buf.length)
      })(done)
    })

    it('should work as a yieldable with zalgo', function (done) {
      co(function* () {
        var buf = yield streamTo.buffer(emptyStream())
        assert.ok(Buffer.isBuffer(buf))
        assert.equal(buf.length, 0)
      })(done)
    })
  })
})