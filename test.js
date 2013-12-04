var assert = require('assert')
var path = require('path')
var fs = require('fs')
var stream = require('stream')
var co = require('co')

var toArray = require('./')

var file = path.join(__dirname, 'index.js')

function emptyStream() {
  var s = new stream()
  process.nextTick(function () {
    s.emit('end')
  })
  return s
}

describe('Stream To Array', function () {
  describe('as a function', function () {
    it('should work', function (done) {
      toArray(fs.createReadStream(file), function (err, arr) {
        if (err)
          return done(err)

        assert.ok(Array.isArray(arr))
        assert.ok(arr.length)

        done()
      })
    })

    it('should work as a yieldable', function (done) {
      co(function* () {
        var arr = yield toArray(fs.createReadStream(file))
        assert.ok(Array.isArray(arr))
        assert.ok(arr.length)
      })(done)
    })

    it('should work as a yieldable with zalgo', function (done) {
      co(function* () {
        var arr = yield toArray(emptyStream())
        assert.ok(Array.isArray(arr))
        assert.equal(arr.length, 0)
      })(done)
    })
  })

  describe('as a method', function () {
    it('should work', function (done) {
      var stream = fs.createReadStream(file)
      stream.toArray = toArray
      stream.toArray(function (err, arr) {
        if (err)
          return done(err)

        assert.ok(Array.isArray(arr))
        assert.ok(arr.length)

        done()
      })
    })

    it('should work as a yieldable', function (done) {
      co(function* () {
        var stream = fs.createReadStream(file)
        stream.toArray = toArray
        var arr = yield stream.toArray()
        assert.ok(Array.isArray(arr))
        assert.ok(arr.length)
      })(done)
    })

    it('should work as a yieldable with zalgo', function (done) {
      co(function* () {
        var stream = emptyStream()
        stream.toArray = toArray
        var arr = yield stream.toArray()
        assert.ok(Array.isArray(arr))
        assert.equal(arr.length, 0)
      })(done)
    })
  })
})